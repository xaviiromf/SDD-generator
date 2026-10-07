import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

test('las cuatro combinaciones conservan la independencia y el documento seleccionado', async ({page}) => {
    await page.goto('./');
    await expect(page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true})).toBeEnabled();
    await page.getByLabel('Documento del kit').selectOption('MANUAL-PARA-USUARIO.txt');
    const spanish = await page.locator('pre').innerText();
    await page.getByRole('switch',{name:'Idioma de la UI',exact:true}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','en');
    await expect(page.getByRole('heading',{name:'One idea. A clear plan.'})).toBeVisible();
    await expect(page.locator('pre')).toHaveText(spanish);
    await expect(page.getByRole('switch',{name:'SDD language'})).toHaveAttribute('aria-checked','false');
    await page.getByRole('switch',{name:'SDD language'}).click();
    await expect(page.locator('pre')).toContainText('QUICK GUIDE');
    const english = await page.locator('pre').innerText();
    await expect(page.getByLabel('Kit document')).toHaveValue('MANUAL-PARA-USUARIO.txt');
    await page.getByRole('switch',{name:'UI language'}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','es');
    await expect(page.locator('pre')).toHaveText(english);
    await expect(page.getByRole('switch',{name:'Idioma del SDD'})).toHaveAttribute('aria-checked','true');
    await page.getByRole('switch',{name:'Idioma del SDD'}).click();
    await expect(page.locator('pre')).toHaveText(spanish);
});

test('UI inglesa cubre fases, catálogo, arquetipos, diálogos, búsqueda y errores', async ({page}) => {
    await page.goto('./');
    await page.getByRole('switch',{name:'Idioma de la UI'}).click();
    await page.getByLabel('Preset',{exact:true}).selectOption('go-service');
    await expect(page.getByRole('dialog')).toContainText('Apply Go microservice and networking');
    await expect(page.getByLabel('Database',{exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Cancel',exact:true}).click();
    await expect(page.getByLabel('Preset',{exact:true})).toBeFocused();
    for(const phase of ['Architecture and topology','Languages and frameworks','Persistence and communication','Aesthetics and tokens','Security and constitution','Workflow and distribution','Platform and environment']) {
        await page.getByRole('button',{name:phase,exact:false}).click();
        const content=await page.locator('.phase-content[data-state=open]').innerText();
        expect(content).not.toMatch(/\b(?:Elegir|Pendiente|Persistencia|Lenguajes|Pruebas|Protecciones|Interfaz|Acabado|Elegir estilo|Texto|Secundario|Botón)\b/);
    }
    await page.getByRole('button',{name:'Search the studio'}).click();
    await page.getByRole('combobox',{name:'Search technologies and presets'}).fill('Swiss precision');
    await expect(page.getByRole('option',{name:'Swiss precision for software Archetype'})).toBeVisible();
    await page.keyboard.press('Escape');
    await page.getByLabel('Identifier',{exact:true}).fill('../invalid');
    await expect(page.getByRole('alert')).toContainText('The identifier must contain');
    await expect(page.getByRole('button',{name:'Download SDD Kit (.zip)',exact:true})).toBeDisabled();
    await page.getByLabel('Identifier',{exact:true}).fill('example');
    await page.getByLabel('Your idea, in your words').fill('Manage bookings');
    await expect(page.locator('.scope-badge')).toContainText('Entities were detected without defined persistence.');
    await page.getByLabel('Your idea, in your words').fill('token='+'a'.repeat(25));
    await expect(page.getByRole('alert')).toContainText('A possible credential was detected.');
    page.once('dialog', async dialog=>{expect(dialog.message()).toContain('Delete only the SDD-Studio draft?');await dialog.dismiss();});
    await page.getByRole('button',{name:'Delete draft',exact:true}).click();
});

test('visor, copia, 34 archivos del ZIP y preparación usan el idioma del SDD con UI española', async ({page}) => {
    await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:(text:string)=>{(window as unknown as {copied:string}).copied=text;return Promise.resolve();}}});});
    await page.goto('./');
    await page.getByLabel('Tu idea, en tus palabras').fill('Pendiente de definir.');
    await page.getByRole('switch',{name:'Idioma del SDD'}).click();
    await expect(page.locator('pre')).toContainText('# Specification');
    await expect(page.locator('pre')).toContainText('Pendiente de definir.');
    await expect(page.getByRole('button',{name:'Copiar Prompt Maestro',exact:true})).toBeEnabled();
    await page.getByRole('button',{name:'Copiar Prompt Maestro',exact:true}).click();
    await expect.poll(()=>page.evaluate(()=>(window as unknown as {copied:string}).copied)).toContain('English, zero emojis');
    const copied=await page.evaluate(()=>(window as unknown as {copied:string}).copied);
    const contents:Record<string,string>={};
    const selector=page.getByLabel('Documento del kit');
    const options=await selector.locator('option').evaluateAll(elements=>elements.map(e=>({id:(e as HTMLOptionElement).value,path:e.textContent!})));
    for(const option of options){await selector.selectOption(option.id);contents[option.path]=await page.locator('pre').innerText();}
    const downloadPromise=page.waitForEvent('download');
    await page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true}).click();
    const zip=await JSZip.loadAsync(await readFile((await (await downloadPromise).path())!));
    expect(Object.values(zip.files).filter(f=>!f.dir)).toHaveLength(34);
    for(const [path,content]of Object.entries(contents))expect(await zip.file(path)!.async('string'),path).toBe(content);
    expect(await zip.file('prompts/00-orchestrator.md')!.async('string')).toBe(copied);
    await page.getByRole('button',{name:'Comando de Setup Rápido'}).click();
    await expect(page.getByRole('dialog')).toContainText('Texto para copiar');
    await expect(page.getByLabel('Contenido para copiar')).toHaveValue(/# There is no approved recipe/);
});

test('persiste las dos preferencias y cambia idiomas sin conexión', async ({page,context}) => {
    await page.goto('./');
    await page.getByLabel('Tu idea, en tus palabras').fill('Conservar mi texto');
    await page.getByRole('switch',{name:'Idioma de la UI'}).click();
    await page.getByRole('switch',{name:'SDD language'}).click();
    await expect.poll(()=>page.evaluate(()=>JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')??'{}').sddLanguage)).toBe('en');
    await page.evaluate(async()=>{await navigator.serviceWorker.ready;});
    await page.reload();
    await expect(page.getByRole('switch',{name:'UI language'})).toHaveAttribute('aria-checked','true');
    await expect(page.getByRole('switch',{name:'SDD language'})).toHaveAttribute('aria-checked','true');
    await expect(page.getByLabel('Your idea, in your words')).toHaveValue('Conservar mi texto');
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('switch',{name:'UI language'}).click();
    await expect(page.locator('pre')).toContainText('# Specification');
    await page.getByRole('switch',{name:'Idioma del SDD'}).click();
    await expect(page.locator('pre')).toContainText('# Especificación');
    await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Conservar mi texto');
    await expect(page.getByRole('button',{name:'Descargar Kit SDD (.zip)',exact:true})).toBeEnabled();
});

test('los controles caben en móvil, funcionan con teclado y no necesitan almacenamiento', async ({page}) => {
    await page.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('Restricted');};});
    await page.goto('./');
    for(const width of [320,375,768,1440]) {
        await page.setViewportSize({width,height:900});
        const ui=page.getByRole('switch',{name:/Idioma de la UI|UI language/});
        const sdd=page.getByRole('switch',{name:/Idioma del SDD|SDD language/});
        await expect(ui).toBeVisible();await expect(sdd).toBeVisible();
        const box=await sdd.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
        await ui.focus();await page.keyboard.press('Space');
        await expect(page.locator('html')).toHaveAttribute('lang',width===320||width===768?'en':'es');
        await sdd.focus();await page.keyboard.press('Enter');
    }
    await expect(page.getByRole('switch',{name:'Idioma de la UI'})).toHaveAttribute('aria-checked','false');
    await expect(page.getByRole('switch',{name:'Idioma del SDD'})).toHaveAttribute('aria-checked','false');
});
