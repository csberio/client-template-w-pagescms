import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { loadContent } from '../src/lib/content.mjs';
const data=loadContent();
const config=parse(fs.readFileSync('.pages.yml','utf8'));
function checkFields(fields,obj,location){
  for(const field of fields){
    const value=obj[field.name];
    if(field.required && (value===undefined || value===null || value===''))throw Error(`${location}.${field.name}: requerido`);
    if(field.type==='image' && value && !fs.existsSync(path.join('public',value)))throw Error(`${location}: imagen inexistente ${value}`);
    if(field.type==='object' && value)for(const item of field.list?value:[value])checkFields(field.fields,item,`${location}.${field.name}`);
  }
}
for(const entry of config.content){
  const files=entry.type==='collection'?fs.readdirSync(entry.path).filter(f=>f.endsWith('.json')).map(f=>path.join(entry.path,f)):[entry.path];
  for(const file of files)checkFields(entry.fields,JSON.parse(fs.readFileSync(file,'utf8')),file);
}
console.log(`Contenido y esquema CMS válidos: 3 páginas, ${data.projects.length} proyectos publicados.`);
