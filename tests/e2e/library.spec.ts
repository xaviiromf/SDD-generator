import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import JSZip from 'jszip';
async function library(page:Page){await page.getByRole('button',{name:'Proyectos',exact:true}).click();await expect(page.getByRole('dialog',{name:'Biblioteca de proyectos locales'})).toBeVisible();await expect(page.getByRole('button',{name:'Nuevo proyecto',exact:true})).toBeEnabled();}
async function close(page:Page){await page.getByRole('button',{name:'Cerrar biblioteca',exact:true}).click();}
async function idea(page:Page){if((await page.viewportSize())!.width<1280)await page.getByRole('button',{name:'Idea / Prompt',exact:true}).click();}
test('biblioteca mantiene proyectos y versiones tras recargar y restaurar',async({page})=>{
 await page.goto('./');await page.getByLabel('Nombre del proyecto',{exact:true}).fill('Proyecto uno');await library(page);
 await page.getByLabel('Nombre de la versión',{exact:true}).fill('Primera versión');await page.getByRole('button',{name:'Guardar versión actual',exact:true}).click();await expect(page.getByText('Primera versión ·',{exact:false})).toBeVisible();
 await page.getByRole('button',{name:'Nuevo proyecto',exact:true}).click();await expect(page.getByRole('heading',{name:'Nuevo proyecto · Activo',exact:true})).toBeVisible();await close(page);
 await page.getByLabel('Nombre del proyecto',{exact:true}).fill('Proyecto dos');await library(page);await close(page);await page.reload();await library(page);
 await expect(page.getByRole('heading',{name:'Proyecto dos · Activo',exact:true})).toBeVisible();
 await page.getByRole('region',{name:'Proyecto Proyecto uno',exact:true}).getByRole('button',{name:'Comparar y abrir',exact:true}).click();await expect(page.getByRole('dialog',{name:'Comparar cambios'})).toBeVisible();await page.getByRole('button',{name:'Cancelar comparación'}).click();await expect(page.getByRole('heading',{name:'Proyecto dos · Activo',exact:true})).toBeVisible();
 await page.getByRole('region',{name:'Proyecto Proyecto uno',exact:true}).getByRole('button',{name:'Comparar y abrir',exact:true}).click();await page.getByRole('button',{name:'Confirmar cambios',exact:true}).click();await expect(page.getByRole('heading',{name:'Proyecto uno · Activo',exact:true})).toBeVisible();await close(page);
 await page.getByLabel('Tu idea, en tus palabras',{exact:true}).fill('Cambio posterior de requisitos');await library(page);await page.getByRole('button',{name:'Comparar y recuperar',exact:true}).click();await expect(page.getByRole('region',{name:'Diferencias del proyecto'})).toContainText('Cambio posterior');await page.getByRole('button',{name:'Confirmar cambios',exact:true}).click();await expect(page.getByText('Antes de recuperar ·',{exact:false})).toBeVisible();await close(page);await expect(page.getByLabel('Tu idea, en tus palabras',{exact:true})).toHaveValue('');
});
test('respaldo e importación exigen comparación, cancelan sin escribir y conservan copia anterior',async({page})=>{
 await page.goto('./');await library(page);const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldar biblioteca',exact:true}).click()]);
 const backup=JSON.parse(await readFile((await download.path())!,'utf8'));expect(backup.format).toBe('sdd-studio-backup');backup.projects[0].draft.name='Nombre importado';const raw=JSON.stringify(backup),before=await page.evaluate(()=>localStorage.getItem('sdd-studio:biblioteca:v1'));
 await page.getByLabel('Importar respaldo JSON').setInputFiles({name:'respaldo.json',mimeType:'application/json',buffer:Buffer.from(raw)});await expect(page.getByRole('dialog',{name:'Comparar cambios'})).toBeVisible();await page.getByRole('button',{name:'Cancelar comparación'}).click();expect(await page.evaluate(()=>localStorage.getItem('sdd-studio:biblioteca:v1'))).toBe(before);
 await page.getByLabel('Importar respaldo JSON').setInputFiles({name:'respaldo.json',mimeType:'application/json',buffer:Buffer.from(raw)});await page.getByLabel('Sustituir proyectos con IDs coincidentes y conservar copia previa').check();await page.getByRole('button',{name:'Confirmar cambios',exact:true}).click();await expect(page.getByRole('heading',{name:'Nombre importado · Activo',exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'Mi proyecto',exact:true})).toBeVisible();
 const saved=await page.evaluate(()=>localStorage.getItem('sdd-studio:biblioteca:v1'));
 await page.getByLabel('Importar respaldo JSON').setInputFiles({name:'roto.json',mimeType:'application/json',buffer:Buffer.from('{roto')});await expect(page.getByRole('alert')).toContainText('JSON');expect(await page.evaluate(()=>localStorage.getItem('sdd-studio:biblioteca:v1'))).toBe(saved);
});
test('aportación por sección sobrevive a regeneración, resolución y exportación de 34 archivos',async({page})=>{
 await page.goto('./');const downloadButton=page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true});await expect(downloadButton).toBeEnabled();
 await page.getByText('Aportaciones manuales por sección',{exact:true}).click();await page.getByRole('combobox',{name:'Sección de destino',exact:true}).selectOption({label:'Problema y propósito'});
 await page.getByRole('button',{name:'Añadir aportación manual',exact:true}).click();await page.getByRole('textbox',{name:/Texto de MAN-/}).fill('Este acuerdo manual debe conservarse.');await expect(downloadButton).toBeEnabled();
 await page.getByLabel('Tu idea, en tus palabras',{exact:true}).fill('Nueva idea declarada para revisar');await expect(page.getByRole('button',{name:'Revisar cambios de secciones',exact:true})).toBeVisible();await expect(downloadButton).toBeDisabled();await page.getByRole('button',{name:'Revisar cambios de secciones',exact:true}).click();await page.getByRole('button',{name:'Cancelar revisión',exact:true}).click();await expect(downloadButton).toBeDisabled();
 await page.getByRole('button',{name:'Revisar cambios de secciones',exact:true}).click();await page.getByRole('combobox',{name:/Resolución de MAN-/}).selectOption('keep');await page.getByRole('button',{name:'Confirmar resolución',exact:true}).click();await expect(downloadButton).toBeEnabled();
 const [download]=await Promise.all([page.waitForEvent('download'),downloadButton.click()]);const zip=await JSZip.loadAsync(await readFile((await download.path())!));expect(Object.values(zip.files).filter(f=>!f.dir)).toHaveLength(34);expect(await zip.file('specs/001-mi-proyecto/spec.md')!.async('string')).toContain('Este acuerdo manual debe conservarse.');
 await page.reload();await page.getByText('Aportaciones manuales por sección',{exact:true}).click();await expect(page.getByRole('textbox',{name:/Texto de MAN-/})).toHaveValue('Este acuerdo manual debe conservarse.');
});
for(const width of [375,768,1280])test(`biblioteca accesible y sin desbordamiento a ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('./');await idea(page);await library(page);await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.querySelector('[role=dialog]')!.contains(document.activeElement))).toBe(true);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Proyectos',exact:true})).toBeFocused();
});
test('otra pestaña no sobrescribe la edición y un conflicto de biblioteca mantiene el borrador',async({page,context})=>{
 await page.goto('./');await library(page);await close(page);
 const second=await context.newPage();await second.goto('./');await library(second);await second.getByLabel('Nombre de la versión').fill('Versión desde segunda pestaña');await second.getByRole('button',{name:'Guardar versión actual',exact:true}).click();await expect(second.getByText('Versión desde segunda pestaña ·',{exact:false})).toBeVisible();
 await page.getByLabel('Tu idea, en tus palabras',{exact:true}).fill('Edición local que no debe perderse');await library(page);await expect(page.getByRole('alert')).toContainText('otra pestaña');
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldar borrador actual',exact:true}).click()]);const backup=JSON.parse(await readFile((await download.path())!,'utf8'));expect(backup.projects[0].draft.idea).toBe('Edición local que no debe perderse');await second.close();
});
test('la edición con veinte proyectos y cien requisitos mantiene respuesta menor de 16 ms',async({page},testInfo)=>{
 test.skip(testInfo.project.name!=='chromium','El entorno de referencia de rendimiento es Chromium.');test.setTimeout(60000);
 const {emptyConfiguration}=await import('../../src/domain/models');const {createRequirement}=await import('../../src/domain/projectDefinition');const {isProjectLibrary}=await import('../../src/domain/projectLibrary');
 const configuration=emptyConfiguration();configuration.project!.requirements=Array.from({length:100},(_,i)=>({...createRequirement(`RF-${i}`),title:`Requisito ${i}`,behavior:'Conservar los datos declarados',criteria:[{id:`CA-${i}`,text:'Los datos siguen disponibles'}]}));
 const date='2026-10-08T12:00:00.000Z';const data={schemaVersion:1 as const,revision:1,activeId:'P-0',projects:Array.from({length:20},(_,i)=>({id:`P-${i}`,createdAt:date,updatedAt:date,draft:configuration,versions:[]}))};expect(isProjectLibrary(data)).toBe(true);
 await page.addInitScript(({configuration,data})=>{localStorage.setItem('sdd-studio:borrador:v1',JSON.stringify(configuration));localStorage.setItem('sdd-studio:biblioteca:v1',JSON.stringify(data));},{configuration,data});
 await page.goto('./');await library(page);await close(page);
 const result=await page.evaluate(async()=>{
  const input=document.querySelector('.idea-field textarea')!;const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value')!.set!;const samples:number[]=[];let begin=0;
  const capture=()=>{begin=performance.now();},bubble=()=>{samples.push(performance.now()-begin);};document.addEventListener('input',capture,true);document.addEventListener('input',bubble);
  for(let i=0;i<200;i++){setter.call(input,`Idea para prueba de volumen ${i}`);input.dispatchEvent(new Event('input',{bubbles:true}));await new Promise(resolve=>setTimeout(resolve,17));}
  document.removeEventListener('input',capture,true);document.removeEventListener('input',bubble);samples.sort((a,b)=>a-b);return {samples:samples.length,p95:samples[189],projects:20,requirements:100};
 });console.info('Rendimiento de biblioteca:',JSON.stringify(result));await testInfo.attach('biblioteca-rendimiento',{body:JSON.stringify(result),contentType:'application/json'});expect(result.samples).toBe(200);expect(result.p95).toBeLessThan(16);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sdd-studio:biblioteca:v1')!).projects.find((p:{id:string})=>p.id==='P-0').draft.idea)).toBe('Idea para prueba de volumen 199');
});
test('el guardado automático no cancela un clic de creación mientras el trabajador está ocupado',async({page})=>{
 await page.addInitScript(()=>{const Original=window.Worker;const setter=Object.getOwnPropertyDescriptor(Original.prototype,'onmessage')!.set!;window.Worker=class extends Original{constructor(url:string|URL,options?:WorkerOptions){super(url,options);if(String(url).includes('projectImport.worker'))Object.defineProperty(this,'onmessage',{set:(handler:(e:MessageEvent)=>void)=>setter.call(this,(e:MessageEvent)=>setTimeout(()=>handler(e),1000))});}};});
 await page.goto('./');await library(page);await close(page);await page.getByLabel('Nombre del proyecto',{exact:true}).fill('Cambio que activa autoguardado');await library(page);
 const button=page.getByRole('button',{name:'Nuevo proyecto',exact:true}),box=(await button.boundingBox())!;await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(1000);await expect(button).toBeEnabled();await page.mouse.up();await expect(page.getByRole('heading',{name:'Nuevo proyecto · Activo',exact:true})).toBeVisible();
});
test('la biblioteca conserva datos corruptos y permite respaldar la edición segura',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('sdd-studio:biblioteca:v1','{biblioteca-rota'));await page.goto('./');await library(page);await expect(page.getByRole('alert')).toContainText('dañada');await page.getByRole('button',{name:'Nuevo proyecto',exact:true}).click();expect(await page.evaluate(()=>localStorage.getItem('sdd-studio:biblioteca:v1'))).toBe('{biblioteca-rota');
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldar borrador actual',exact:true}).click()]);const backup=JSON.parse(await readFile((await download.path())!,'utf8'));expect(backup.projects[0].draft.slug).toBe('mi-proyecto');
});
test('versiones y respaldos funcionan sin red tras completar la caché local',async({page,context})=>{
 await page.goto('./');await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa');await context.setOffline(true);await page.reload();await library(page);await page.getByLabel('Nombre de la versión').fill('Versión sin red');await page.getByRole('button',{name:'Guardar versión actual',exact:true}).click();await expect(page.getByText('Versión sin red ·',{exact:false})).toBeVisible();
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldar biblioteca',exact:true}).click()]);const backup=JSON.parse(await readFile((await download.path())!,'utf8'));expect(backup.projects[0].versions[0].label).toBe('Versión sin red');
});
