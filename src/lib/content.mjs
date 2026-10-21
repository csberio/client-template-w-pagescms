import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const text = z.string().trim().min(1);
const localImage = z.string().regex(/^\/media\/[a-zA-Z0-9_./-]+\.(svg|webp|png|jpg|jpeg|gif|avif)$/i);
const image = z.object({src:localImage,alt:text});
const optionalImage = z.preprocess(v => !v || (typeof v === "object" && !v.src && !v.alt) ? null : v, image.nullish());
const link = z.string().refine(v => /^\/(?!\/)/.test(v) || /^https:\/\//.test(v) || /^mailto:[^\s@]+@[^\s@]+$/.test(v), 'Usa una ruta local, https o mailto.');
export const schemas = {
  site:z.object({name:text,tagline:text,footer:text,catalogLabel:text,historyLabel:text,homeLabel:text,openLabel:text,closeLabel:text,emptyLabel:text,projectLabel:text,mainLabel:text,secondaryLabel:text,extraLabel:text,skipLabel:text,repository:z.string(),accent:z.string().regex(/^#[0-9a-fA-F]{6}$/),background:z.string().regex(/^#[0-9a-fA-F]{6}$/),ink:z.string().regex(/^#[0-9a-fA-F]{6}$/)}),
  home:z.object({eyebrow:text,title:text,description:text,ctaLabel:text,ctaHref:link,image,caption:text,noteTitle:text,note:text,seoTitle:text,seoDescription:text}),
  history:z.object({eyebrow:text,title:text,description:text,image,caption:text,body:text,milestones:z.array(z.object({year:text,title:text,description:text})).default([]),seoTitle:text,seoDescription:text}),
  catalog:z.object({eyebrow:text,title:text,description:text,seoTitle:text,seoDescription:text}),
  project:z.object({title:text,date:z.iso.date(),description:text,mainImage:image,secondaryImage:image,extra1:optionalImage,extra2:optionalImage,extra3:optionalImage,published:z.boolean().default(true)}),
};
export function loadContent(root=process.cwd()) {
  const read = name => schemas[name].parse(JSON.parse(fs.readFileSync(path.join(root,'content',`${name}.json`),'utf8')));
  const projects = fs.readdirSync(path.join(root,'content/projects')).filter(f=>f.endsWith('.json')).map(file=>({id:path.basename(file,'.json'),...schemas.project.parse(JSON.parse(fs.readFileSync(path.join(root,'content/projects',file),'utf8')))})).sort((a,b)=>b.date.localeCompare(a.date));
  return {site:read('site'),home:read('home'),history:read('history'),catalog:read('catalog'),projects:projects.filter(p=>p.published)};
}
export function richText(markdown) {
  return sanitizeHtml(marked.parse(markdown), {
    allowedTags:['p','br','strong','em','u','s','h2','h3','h4','ul','ol','li','blockquote','a','code','pre','hr','img','table','thead','tbody','tr','th','td'],
    allowedAttributes:{a:['href','title'],img:['src','alt','title','loading'],th:['colspan'],td:['colspan']},
    allowedSchemes:['https','mailto'],
    allowProtocolRelative:false,
    transformTags:{img:(tagName,attrs)=>({tagName,attribs:{...attrs,loading:'lazy'}})},
  });
}
export const content = loadContent();
export const formatDate = value => new Intl.DateTimeFormat('es-PR',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(`${value}T12:00:00Z`));
