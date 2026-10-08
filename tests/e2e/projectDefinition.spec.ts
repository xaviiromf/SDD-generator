import {test,expect} from '@playwright/test';
import JSZip from 'jszip';
import {readFile} from 'node:fs/promises';
import {emptyConfiguration} from '../../src/domain/models';
import {createRequirement} from '../../src/domain/projectDefinition';
async function declaredRequirement(page:import('@playwright/test').Page){
 await page.goto('./');await page.getByText('Entrevista y contexto',{exact:true}).click();
 await page.getByRole('button',{name:'Añadir actores',exact:true}).click();
 await page.getByLabel(/Actores · CTX/).fill('Persona administradora');
 await page.getByLabel(/Estado de CTX/).selectOption('confirmado');
 await page.getByText('Requisitos y criterios',{exact:false}).first().click();await page.getByRole('button',{name:'Añadir requisito',exact:true}).click();
 await page.getByLabel('Título del requisito',{exact:true}).fill('Cancelar reserva');
 await page.getByRole('combobox',{name:'Actor responsable',exact:true}).selectOption({label:'CTX-1: Persona administradora'});
 await page.getByRole('textbox',{name:'Contexto y condición',exact:true}).fill('Cuando la reserva está pendiente');
 await page.getByRole('textbox',{name:'Comportamiento esperado',exact:true}).fill('Cancelar la reserva pendiente');
 await page.getByRole('button',{name:'Añadir criterio',exact:true}).click();await page.getByLabel(/Criterio CA/).fill('La reserva queda cancelada y consultable');
 await page.getByRole('combobox',{name:'Estado del requisito',exact:true}).selectOption('confirmado');
}
test('requisito y criterio llegan al ZIP, la trazabilidad y al borrador recuperado',async({page})=>{
 await declaredRequirement(page);
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')??'{}').project?.requirements[0].criteria[0]?.text)).toBe('La reserva queda cancelada y consultable');
 await page.getByText('Grafo de trazabilidad',{exact:false}).first().click();await expect(page.getByRole('region',{name:'Tabla de trazabilidad'})).toContainText('T-REQUISITO-RF-2');
 const button=page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true});await expect(button).toBeEnabled();
 const [download]=await Promise.all([page.waitForEvent('download'),button.click()]);const zip=await JSZip.loadAsync(await readFile((await download.path())!));
 const files=Object.values(zip.files).filter(f=>!f.dir);expect(files).toHaveLength(34);
 expect(await zip.file('specs/001-mi-proyecto/spec.md')!.async('string')).toContain('La reserva queda cancelada y consultable');
 expect(await zip.file('docs/TRACEABILITY.md')!.async('string')).toContain('CA-3');
 await page.reload();await expect(page.locator('.requirements-list')).toBeVisible();
 if(await page.locator('.requirements-list').getAttribute('open')===null)await page.locator('.requirements-list>summary').click();
 if(await page.locator('.requirement-card').getAttribute('open')===null)await page.locator('.requirement-card>summary').click();
 await expect(page.getByLabel('Título del requisito',{exact:true})).toHaveValue('Cancelar reserva');
});
test('el consentimiento de borrador mantiene bloqueos por ruta insegura y secreto',async({page})=>{
 await declaredRequirement(page);
 await page.getByLabel('Identificador',{exact:true}).fill('../ruta');
 await expect(page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true})).toBeDisabled();
 await page.getByLabel('Permitir borrador con conflictos tecnológicos para revisión').check();
 await expect(page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true})).toBeDisabled();
 await page.getByLabel('Identificador',{exact:true}).fill('mi-proyecto');
 await page.getByRole('textbox',{name:'Comportamiento esperado',exact:true}).fill('token='+'a'.repeat(25));
 await expect(page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true})).toBeDisabled();
});
test('un conflicto tecnológico solo permite descargar documentos tras consentimiento explícito',async({page})=>{
 const configuration=emptyConfiguration();configuration.selections.platform=['cli'];configuration.selections.frontend=['react'];
 configuration.origins.platform='manual';configuration.origins.frontend='manual';
 const requirement=createRequirement('RF-1');requirement.title='Conservar la decisión para revisión';requirement.behavior='Revisar la incompatibilidad declarada';configuration.project!.requirements=[requirement];
 await page.addInitScript(data=>localStorage.setItem('sdd-studio:borrador:v1',JSON.stringify(data)),configuration);
 await page.goto('./');const button=page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true});await expect(button).toBeDisabled();
 await page.getByLabel('Permitir borrador con conflictos tecnológicos para revisión').check();await expect(button).toBeEnabled();
 const [download]=await Promise.all([page.waitForEvent('download'),button.click()]);const zip=await JSZip.loadAsync(await readFile((await download.path())!));
 expect(Object.values(zip.files).filter(f=>!f.dir)).toHaveLength(34);
 expect(await zip.file('specs/001-mi-proyecto/spec.md')!.async('string')).toContain('Revisar la incompatibilidad declarada');
});
for(const width of [375,768,1280])test(`editor local y flujo sin código a ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.goto('./');
 if(width<1280)await page.getByRole('button',{name:'Idea / Prompt',exact:true}).click();
 await page.getByText('Entrevista y contexto',{exact:true}).click();
 await page.getByLabel('El proyecto requiere implementación de software').uncheck();
 await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')??'{}').project?.implementationRequired)).toBe(false);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
