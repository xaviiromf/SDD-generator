import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { validateConfiguration, isConfiguration } from '../../src/domain/validation';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { archetypes } from '../../src/catalog/archetypes';
import { technologies, fieldLabels, phaseLabels } from '../../src/catalog/technologies';
import { brokenReferences } from '../../src/engine/references';
import { literal, template, uiText, english } from '../../src/i18n/translate';
import { packageKit } from '../../src/services/zipExport';
import { exportTokens } from '../../src/services/tokenExport';
import { searchTechnologies, inferTechnologies } from '../../src/engine/matcher';
import { useEditorStore } from '../../src/store/editorStore';
import { useUIStore } from '../../src/store/uiStore';

// Names of files and products remain stable. These words identify untranslated
// scaffold prose rather than language-neutral commands or user's authored text.
const spanishProse = /\b(?:pendiente|pendientes|revisar|revisa|propuesto|propuestas|autoriza|ejecutado|ejecutada|ninguna|ninguno|seleccionadas|seleccionados|español|especificación|trazabilidad|alcance|familia|entorno|pila|contratos|ayudas|errores|actuación|archivos|evidencia|guía|requisitos|construcción|comprobaciones)\b/i;
const prose = (text: string) => text.replace(/(?:[\w.-]+\/)*[\w.-]+\.(?:md|txt|py|tsx|ts|vue|svelte|css|rs|go|json)/g, '');

describe('Idiomas independientes', () => {
    it('traduce los 34 documentos para todos los perfiles preservando rutas y referencias', () => {
        for (const preset of presets) {
            const selections = resolvePreset(preset, Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]])));
            const base = {...emptyConfiguration(), name:'Example', selections:{...selections, archetype:['a04'], integrity:['spanish','no-emojis']}};
            const es = compile(base), en = compile({...base,sddLanguage:'en'});
            expect(en.documents).toHaveLength(34);
            expect(en.documents.map(d=>d.path)).toEqual(es.documents.map(d=>d.path));
            expect(brokenReferences(en.documents)).toEqual([]);
            for (const doc of en.documents) {
                expect(doc.content, `${preset.id}: ${doc.path}`).not.toBe(es.documents.find(d=>d.id===doc.id)!.content);
                expect(prose(doc.content), `${preset.id}: ${doc.path}`).not.toMatch(spanishProse);
            }
            expect(en.documents.find(d=>d.id==='constitution')!.content).toContain('documentation in English');
            expect(en.documents.find(d=>d.id==='validation')!.content).toContain('Not executed');
        }
    });
    it('preserva literalmente el texto del usuario, incluso si coincide con una traducción', () => {
        const base={...emptyConfiguration(), sddLanguage:'en' as const, name:'Especificación', idea:'Pendiente de definir.\n<contrato>', positive:'Revisar requisitos y contratos pendientes\nNombre | texto', negative:'Cero emojis'};
        const kit=compile(base);
        const spec=kit.documents.find(d=>d.id==='spec')!.content;
        expect(spec).toContain('# Specification — Especificación');
        expect(spec).toContain('Pendiente de definir.\n&lt;contrato&gt;');
        expect(spec).toContain('Revisar requisitos y contratos pendientes');
        expect(spec).toContain('Cero emojis');
        expect(kit.documents.find(d=>d.id==='tasks')!.content).toContain('Verify the action according to the reviewed contract: Revisar requisitos y contratos pendientes');
        expect(template('en')`Proyecto: ${'Proyecto: Pendiente'}`).toBe('Project: Proyecto: Pendiente');
    });
    it('conserva UI, revisión y selección al cambiar el idioma independiente', () => {
        useEditorStore.getState().restore(emptyConfiguration());
        const base=useEditorStore.getState().config;
        useUIStore.getState().setLocale('en');
        expect(useEditorStore.getState().config).toBe(base);
        useEditorStore.getState().setSDDLanguage('en');
        const changed=useEditorStore.getState().config;
        expect(changed.revision).toBe(base.revision+1);
        expect(changed.selections).toBe(base.selections);
        useUIStore.getState().setLocale('es');
        expect(useEditorStore.getState().config).toBe(changed);
        expect(changed.sddLanguage).toBe('en');
        useEditorStore.getState().setSDDLanguage('en');
        expect(useEditorStore.getState().config).toBe(changed);
    });
    it('acepta borradores anteriores y rechaza idiomas no válidos', () => {
        const legacy=emptyConfiguration();
        delete legacy.sddLanguage;
        expect(isConfiguration(legacy)).toBe(true);
        useEditorStore.getState().restore(legacy);
        expect(useEditorStore.getState().config.sddLanguage).toBe('es');
        expect(isConfiguration({...legacy,sddLanguage:'fr'})).toBe(false);
        expect(validateConfiguration({...legacy,sddLanguage:'fr'} as unknown as ReturnType<typeof emptyConfiguration>)).toContainEqual({message:'Idioma del SDD no válido.',blocking:true});
    });
    it('exporta exactamente los 34 contenidos ingleses y localiza tokens y comentarios de preparación', async () => {
        const c={...emptyConfiguration(),sddLanguage:'en' as const,selections:{platform:['web-ssr'],architecture:['monolith'],language:['python'],backend:['django'],frontend:['django-templates'],archetype:['a04']}};
        const result=compile(c);
        const zip=await JSZip.loadAsync(await packageKit(result.documents,{slug:result.slug}));
        for(const d of result.documents) expect(await zip.file(d.path)!.async('string')).toBe(d.content);
        expect(prose(result.documents.find(d=>d.path==='docs/DECISIONS.md')!.content)).not.toMatch(spanishProse);
        const tokens=JSON.parse(exportTokens(archetypes[3],'json','en').content);
        expect(tokens.name).toBe('Swiss precision for software');
        expect(tokens.finish).toBe('1 px micro borders');
        expect(exportTokens(archetypes[3],'tailwind','en').content).toContain('// Tailwind CSS 3 configuration profile.');
        expect(result.documents.find(d=>d.path==='docs/ENVIRONMENT_AND_VERIFICATION.md')!.content).toContain('# Activate the environment');
    });
    it('localiza los mensajes dinámicos y permite búsqueda en ambos idiomas', () => {
        expect(uiText('Plantillas Django no es compatible con las decisiones actuales. Requiere: Django. Revisa el campo seleccionado.','en')).toBe('Django templates is incompatible with the current decisions. Requires: Django. Review the selected field.');
        expect(searchTechnologies('native linux')[0].id).toBe('linux');
        expect(searchTechnologies('Precisión suiza')[0].id).toBe('a04');
        expect(searchTechnologies('Swiss precision')[0].id).toBe('a04');
        expect(inferTechnologies('Use Python without Django').map(i=>i.id)).not.toContain('django');
    });
    it('incluye traducciones explícitas de todos los metadatos españoles del catálogo', () => {
        const labels=[...technologies.map(t=>t.label),...Object.values(fieldLabels),...phaseLabels,...presets.flatMap(p=>[p.label,p.description,...(p.variants??[]).map(v=>v.label)]),...archetypes.flatMap(a=>[a.name,a.texture])];
        for(const label of labels) if (/[áéíóúñ]/i.test(label) || spanishProse.test(label)) {
            expect(Object.hasOwn(english,label),label).toBe(true);
            expect(literal(label,'en'),label).not.toMatch(spanishProse);
        }
    });
});
