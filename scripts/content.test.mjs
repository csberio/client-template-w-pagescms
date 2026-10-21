import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadContent, richText, schemas, formatDate } from '../src/lib/content.mjs';
test('rich text preserves formatting and removes executable content',()=>{
  const result=richText('## Encabezado\n\n**Negrita** y [enlace](https://example.org).\n\n<script>alert(1)</script>\n\n<img src="x" onerror="alert(1)">\n\n[malicioso](javascript:alert(1))');
  assert.match(result,/<h2>Encabezado<\/h2>/);assert.match(result,/<strong>Negrita<\/strong>/);assert.match(result,/href="https:\/\/example.org"/);assert.doesNotMatch(result,/<script|onerror|javascript:/);
});
test('unpublished projects are excluded and dates sort correctly',()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'velsant-cms-'));
  try{fs.cpSync('content',path.join(tmp,'content'),{recursive:true});const file=path.join(tmp,'content/projects/pausa.json');const project=JSON.parse(fs.readFileSync(file));project.published=false;fs.writeFileSync(file,JSON.stringify(project));const content=loadContent(tmp);assert.equal(content.projects.length,2);assert.equal(content.projects[0].id,'escritura');}finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
test('projects require valid date, main and secondary images and meaningful alt text',()=>{
  const project=loadContent().projects[0];assert.throws(()=>schemas.project.parse({...project,date:'2026-02-31'}));assert.throws(()=>schemas.project.parse({...project,mainImage:{src:'/media/test.svg',alt:''}}));assert.throws(()=>schemas.project.parse({...project,secondaryImage:null}));assert.throws(()=>schemas.project.parse({...project,mainImage:{src:'javascript:alert(1)',alt:'x'}}));assert.ok(schemas.project.parse({...project,extra1:null,extra2:null,extra3:null}));
});
test('CMS JSON edits appear in the content loader and date stays on selected day',()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'velsant-cms-'));
  try{fs.cpSync('content',path.join(tmp,'content'),{recursive:true});const file=path.join(tmp,'content/home.json');const home=JSON.parse(fs.readFileSync(file));home.title='Título cambiado desde CMS';fs.writeFileSync(file,JSON.stringify(home));assert.equal(loadContent(tmp).home.title,home.title);assert.match(formatDate('2026-10-18'),/18/);}finally{fs.rmSync(tmp,{recursive:true,force:true});}
});
