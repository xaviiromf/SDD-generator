/* global localStorage, document, HTMLTextAreaElement, performance, setTimeout, MutationObserver, clearTimeout, Event, structuredClone, console */
import process from 'node:process';
import {chromium} from 'playwright';
import JSZip from 'jszip';
import {readFile,writeFile} from 'node:fs/promises';

// Banco técnico: datos ya preparados, no representa tiempo de trabajo humano.
const corpus=JSON.parse(await readFile('specs/005-generador-profesional/fixtures/corpus.json','utf8'));
const browser=await chromium.launch();
const previous=process.env.SDD_BASE_URL??'http://127.0.0.1:4174/SDD-generator/';
const current=process.env.SDD_H2_URL??'http://127.0.0.1:4173/SDD-generator/';
const summary=values=>{
 const sorted=[...values].sort((a,b)=>a-b);
 return {samples:sorted.length,medianMs:sorted[Math.floor(sorted.length/2)],p95Ms:sorted[Math.ceil(sorted.length*.95)-1]};
};
const seedPage=await browser.newPage();await seedPage.goto(previous);
await seedPage.getByLabel('Conjunto predefinido').selectOption('client-spa');
await seedPage.getByRole('button',{name:'Aplicar conjunto',exact:true}).click();
await seedPage.waitForFunction(()=>localStorage.getItem('sdd-studio:borrador:v1'));
const seed=await seedPage.evaluate(()=>JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')));
await seedPage.close();
seed.origins=Object.fromEntries(Object.keys(seed.selections).map(key=>[key,'manual']));
function project(sample,count=1){
 const context=Object.fromEntries(['components','actors','capabilities','processes','entities','rules','decisions','assumptions','questions','exclusions','contracts'].map(key=>[key,[]]));
 context.actors=[{id:'ACT-1',text:sample.actor,status:'confirmado',origin:'user',references:[]}];
 return {schemaVersion:1,projectId:'mi-proyecto',revision:1,nextId:1000,mode:sample.mode,implementationRequired:sample.id!=='12',context,
  requirements:Array.from({length:count},(_,i)=>({id:`RF-${i+2}`,title:sample.behavior,kind:'functional',status:'confirmado',origin:'user',actorId:'ACT-1',context:sample.idea,behavior:sample.behavior,priority:'media',exceptions:[sample.exception],criteria:[{id:`CA-${i+2}`,text:sample.criterion}],ruleIds:[],componentIds:[],decisionIds:[],contractIds:[]}))};
}
async function generation(page,value){
 return page.evaluate(async value=>{
  const input=document.querySelector('.idea-field textarea');
  const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;
  const begin=performance.now();let busy=false;
  return new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>{observer.disconnect();reject(new Error('La generación no terminó en cinco segundos'));},5000);
   const observer=new MutationObserver(()=>{
    const button=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Descargar Kit SDD'));
    if(button?.disabled)busy=true;
    if(button&&!button.disabled&&busy){clearTimeout(timeout);observer.disconnect();resolve(performance.now()-begin);}
   });
   observer.observe(document.body,{subtree:true,attributes:true,childList:true});
   setter.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));
  });
 },value);
}
function findings(docs,sample){
 const spec=docs['specs/001-mi-proyecto/spec.md'];
 const tasks=docs['specs/001-mi-proyecto/tasks.md'];
 const validation=docs['specs/001-mi-proyecto/validation.md'];
 const lines=spec.split('\n');
 const rf=lines.find(line=>/RF-[A-Za-z0-9-]+/.test(line)&&line.includes(sample.behavior))?.match(/RF-[A-Za-z0-9-]+/)?.[0];
 const ca=lines.find(line=>/CA-[A-Za-z0-9-]+/.test(line)&&line.includes(sample.criterion))?.match(/CA-[A-Za-z0-9-]+/)?.[0];
 const checks={
  hechosLiterales:[sample.actor,sample.behavior,sample.criterion,sample.exception].every(text=>spec.includes(text)),
  comportamientoConId:!!rf,
  criterioConId:!!ca,
  tareaConCriterio:!!ca&&tasks.includes(ca),
  grafoCompleto:!!ca&&!!rf&&docs['docs/TRACEABILITY.md'].split('\n').some(line=>line.includes(ca)&&line.includes(rf)&&line.includes('T-')),
  validacionInicialConCriterio:!!ca&&validation.includes(ca)&&validation.includes('No ejecutado'),
  manifiesto34:Object.keys(docs).length===34,
 };
 return {checks,pendingStructuralFindings:Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name)};
}
const results=[];
try{
 for(const [version,url] of [['anterior',previous],['H2',current]]){
  const generationSamples=[],zipSamples=[],cases=[];
  for(const sample of corpus){
   const context=await browser.newContext();const page=await context.newPage();
   const configuration=structuredClone(seed);configuration.name=sample.title;
   if(version==='H2')configuration.project=project(sample);
   await page.addInitScript(data=>localStorage.setItem('sdd-studio:borrador:v1',JSON.stringify(data)),configuration);
   await page.goto(url);const button=page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true});await button.waitFor();
   const input=[sample.idea,`Actor declarado: ${sample.actor}`,`Comportamiento declarado: ${sample.behavior}`,`Criterio declarado: ${sample.criterion}`,`Excepción declarada: ${sample.exception}`].join('\n');
   await generation(page,input+'\nMuestra de calentamiento.');
   let docs;
   for(let i=0;i<5;i++){
    generationSamples.push(await generation(page,input+`\nMuestra técnica ${i}.`));
    const [download]=await Promise.all([page.waitForEvent('download'),button.click()]);
    const zip=await JSZip.loadAsync(await readFile(await download.path()));
    docs=Object.fromEntries(await Promise.all(Object.values(zip.files).filter(f=>!f.dir).map(async f=>[f.name,await f.async('string')])));
    zipSamples.push(await page.evaluate(()=>performance.getEntriesByName('sdd:empaquetado-zip').at(-1).duration));
   }
   const result={id:sample.id,...findings(docs,sample)};cases.push(result);
   console.log(version,sample.id,result.pendingStructuralFindings.length);
   await context.close();
  }
  results.push({version,generation:summary(generationSamples),zip:summary(zipSamples),pendingStructuralFindings:cases.reduce((n,c)=>n+c.pendingStructuralFindings.length,0),cases});
 }
 const context=await browser.newContext(),page=await context.newPage();const configuration={...seed,project:project(corpus[0],100)};
 await page.addInitScript(data=>localStorage.setItem('sdd-studio:borrador:v1',JSON.stringify(data)),configuration);await page.goto(current);
 const volume=[];await generation(page,'Banco de cien requisitos: calentamiento.');
 for(let i=0;i<30;i++)volume.push(await generation(page,`Banco de cien requisitos: muestra ${i}.`));
 await context.close();
 const report={date:'2026-10-08',browser:await browser.version(),baselineCommit:'53d13c20339ebc9316b44e26247eb60f44eee781',method:'Datos preparados, mismo texto libre y selección manual client-spa; H2 recibe además sus campos estructurados. Un calentamiento y cinco muestras por caso/versión. Generación observada hasta botón de ZIP habilitado; ZIP según Performance API. Orden anterior seguido de H2, sin estimación de trabajo humano.',humanParticipants:0,humanTimeSaving:'No medido',semanticReview:'Pendiente',mcp:'Desactivado',results,maximum100Requirements:summary(volume)};
 await writeFile('specs/005-generador-profesional/fixtures/comparison.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.results.map(({version,generation,zip,pendingStructuralFindings})=>({version,generation,zip,pendingStructuralFindings}))));console.log('Volumen',report.maximum100Requirements);
}finally{await browser.close();}
