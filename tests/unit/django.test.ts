import { describe, it, expect } from 'vitest';
import { emptyConfiguration, type Configuration } from '../../src/domain/models';
import { optionsFor, compatibilityDiagnostics } from '../../src/domain/compatibility';
import { compile } from '../../src/engine/compiler';
import { isConfiguration } from '../../src/domain/validation';

const djangoConfig = (): Configuration => ({ ...emptyConfiguration(), selections: {
    platform: ['web-ssr'], architecture: ['monolith'], language: ['python'], backend: ['django']
} });
describe('Ecosistema Django', () => {
    it('ofrece Django para Python con servidor y explica selecciones incompatibles', () => {
        const c = djangoConfig();
        expect(optionsFor('backend', c).some(t => t.id === 'django')).toBe(true);
        expect(optionsFor('backend', { ...c, selections: { ...c.selections, language: ['typescript'] } }).some(t => t.id === 'django')).toBe(false);
        expect(optionsFor('backend', { ...c, selections: { ...c.selections, architecture: ['client'] } }).some(t => t.id === 'django')).toBe(false);
        expect(isConfiguration(emptyConfiguration())).toBe(true);
    });
    it('requiere Django para complementos y DRF para OpenAPI y Simple JWT', () => {
        const c = djangoConfig();
        expect(optionsFor('api', c).map(t => t.id)).toEqual(['django-rest-framework', 'django-ninja']);
        expect(optionsFor('api', emptyConfiguration())).toEqual([]);
        expect(optionsFor('addons', c).some(t => t.id === 'drf-spectacular')).toBe(false);
        c.selections.api = ['django-rest-framework'];
        c.selections.addons = ['drf-spectacular', 'django-filter', 'django-channels'];
        c.selections.auth = ['django-simplejwt'];
        expect(compatibilityDiagnostics(c)).toEqual([]);
        c.selections.api = ['django-ninja'];
        expect(compatibilityDiagnostics(c).filter(d => d.blocking)).toHaveLength(2);
        expect(c.selections.addons).toContain('drf-spectacular');
        expect(compatibilityDiagnostics(c)[0].message).toContain('Requiere:');
        c.selections.backend = ['fastapi'];
        expect(optionsFor('addons', c)).toEqual([]);
    });
    it('propone estructura Django y declara las opciones elegidas en el kit', () => {
        const c = djangoConfig();
        c.selections.frontend = ['django-templates'];
        c.selections.api = ['django-rest-framework'];
        c.selections.addons = ['django-channels', 'django-celery'];
        c.selections.storage = ['django-orm', 'postgres'];
        c.selections.auth = ['django-allauth'];
        c.selections.security = ['django-cors-headers'];
        c.selections.testing = ['pytest-django'];
        const result = compile(c);
        expect(result.diagnostics).toEqual([]);
        expect(result.targetTree).toEqual(expect.arrayContaining(['manage.py', 'config/settings.py', 'apps/core/serializers.py', 'apps/core/consumers.py', 'config/celery.py', 'templates/']));
        expect(result.targetTree).not.toContain('src/main.py');
        const plan = result.documents.find(d => d.id === 'plan')!.content;
        expect(plan).toContain('Django REST Framework');
        expect(plan).toContain('pytest-django');
        c.selections.api = ['django-ninja'];
        expect(compile(c).targetTree).toContain('apps/core/api/schemas.py');
    });
});
