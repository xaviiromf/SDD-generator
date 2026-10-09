import { diagramLimits } from '../domain/diagrams';

export type DiagramErrorKind = 'carga' | 'sintaxis' | 'seguridad' | 'limite' | 'obsoleto';
export class DiagramError extends Error {
    constructor(public readonly kind: DiagramErrorKind, message: string) { super(message); this.name = 'DiagramError'; }
}
export function validateDiagramSource(source: string): void {
    if (new TextEncoder().encode(source).length > diagramLimits.sourceBytes) throw new DiagramError('limite', 'El bloque supera 32 KiB. Reduce su tamaño para mostrarlo.');
    if (!/^\s*(?:flowchart\s+(?:TD|TB|BT|LR|RL)|graph\s+(?:TD|TB|BT|LR|RL)|erDiagram|sequenceDiagram)\s*(?:\r?\n|$)/.test(source)) throw new DiagramError('sintaxis', 'Este tipo de diagrama no está admitido. Consulta la vista Código.');
    if (/^\s*(?:---|%%\{|click\b|style\b|classDef\b|class\b|linkStyle\b)/im.test(source) || /<\/?[a-z]|javascript\s*:|data\s*:|\b(?:href|callback|img|image|icon)\s*[=:]|@\{|\bfa[bslr]?:|!\[|\$\$/i.test(source)) throw new DiagramError('seguridad', 'El bloque contiene configuración, HTML o recursos no permitidos.');
    const masked = source.replace(/"(?:\\.|[^"\\])*"/g, '""');
    const identities = new Set<string>();
    for (const match of masked.matchAll(/^\s*(?:(?:actor|participant)\s+)?([A-Za-z][\w-]*)\s*(?:\[|\(|\{|$)/gm)) identities.add(match[1]);
    for (const match of masked.matchAll(/(?=\b([A-Za-z][\w-]*)\s*(?:-->>|->>|-->|---|==>|-\.->)\s*(?:\|[^|]*\|\s*)?([A-Za-z][\w-]*))/g)) { identities.add(match[1]); identities.add(match[2]); }
    for (const match of masked.matchAll(/^\s*([A-Za-z][\w-]*)\s+[|o}{.-]+\s+([A-Za-z][\w-]*)\s*:/gm)) { identities.add(match[1]); identities.add(match[2]); }
    for (const match of masked.matchAll(/^\s*(?:actor|participant)\s+([^\s:;]+)/gm)) identities.add(match[1]);
    if (/^\s*(?:flowchart|graph)\b/.test(source)) {
        for (const match of masked.matchAll(/&\s*([\p{L}\p{N}_][\p{L}\p{N}_.-]*)/gu)) identities.add(match[1]);
        for (const match of masked.matchAll(/(?:^|[;\n])\s*([\p{L}\p{N}_][\p{L}\p{N}_.-]*)\s*(?=[;\n]|$)/gu)) identities.add(match[1]);
    }
    const nodes = identities.size;
    const edges = source.match(/(?:-->>|->>|-->|---|[|}o][|o{].{2}[|o}{][|o{])/g)?.length ?? 0;
    if (nodes > diagramLimits.nodes || edges > diagramLimits.edges) throw new DiagramError('limite', 'El diagrama supera el límite de elementos o relaciones. Divide su fuente.');
}
const elements = new Set(['svg', 'g', 'symbol', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'text', 'tspan', 'defs', 'marker', 'clipPath', 'title', 'desc', 'style', 'use', 'linearGradient', 'radialGradient', 'stop', 'pattern', 'filter', 'feDropShadow']);
const attributes = new Set(['id', 'class', 'xmlns', 'xmlns:xlink', 'viewBox', 'width', 'height', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry', 'd', 'points', 'transform', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'fill-rule', 'clip-rule', 'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'alignment-baseline', 'dx', 'dy', 'marker-end', 'marker-start', 'marker-mid', 'markerWidth', 'markerHeight', 'refX', 'refY', 'orient', 'markerUnits', 'clip-path', 'clipPathUnits', 'preserveAspectRatio', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-roledescription', 'style', 'href', 'xlink:href', 'offset', 'stop-color', 'stop-opacity', 'gradientUnits', 'gradientTransform', 'patternUnits', 'patternContentUnits', 'filter', 'filterUnits', 'stdDeviation', 'flood-color', 'flood-opacity', 'color-interpolation-filters']);
const properties = new Set(['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'fill-rule', 'clip-rule', 'opacity', 'fill-opacity', 'stroke-opacity', 'font-family', 'font-size', 'font-weight', 'font-style', 'text-anchor', 'dominant-baseline', 'alignment-baseline', 'color', 'background', 'background-color', 'border', 'border-radius', 'border-color', 'border-width', 'border-style', 'padding', 'margin', 'line-height', 'text-decoration', 'white-space', 'word-wrap', 'overflow-wrap', 'display', 'visibility', 'max-width', 'width', 'height', 'rx', 'ry', 'marker-end', 'marker-start', 'marker-mid', 'transform', 'transform-origin', 'filter', 'flood-color', 'flood-opacity', 'color-interpolation-filters']);
function safeValue(value: string, references: Set<string>, selectorSyntax = false): boolean {
    if (/@import|expression\s*\(|javascript\s*:|data\s*:|https?\s*:|\/\/|</i.test(value)) return false;
    if (!selectorSyntax && />/.test(value)) return false;
    for (const match of value.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) {
        if (!match[1].startsWith('#')) return false;
        references.add(match[1].slice(1));
    }
    return true;
}
function cleanDeclarations(declarations: CSSStyleDeclaration, references: Set<string>): string {
    const kept: string[] = [];
    for (let i = 0; i < declarations.length; i++) {
        const key = declarations.item(i), value = declarations.getPropertyValue(key);
        if (!safeValue(value, references)) throw new DiagramError('seguridad', 'El SVG contiene estilos o recursos externos.');
        if (properties.has(key)) kept.push(`${key}:${value}`);
    }
    return kept.join(';');
}
export function sanitizeDiagramSvg(raw: string, accessible?: { title: string; description: string }): { sanitizedSvg: string; width: number; height: number } {
    if (new TextEncoder().encode(raw).length > diagramLimits.cacheBytes) throw new DiagramError('limite', 'El SVG supera el límite de representación segura.');
    const doc = new DOMParser().parseFromString(raw, 'image/svg+xml');
    const root = doc.documentElement;
    if (doc.querySelector('parsererror') || root.localName !== 'svg' || root.namespaceURI !== 'http://www.w3.org/2000/svg') throw new DiagramError('seguridad', 'El resultado no es un SVG válido.');
    const ids = new Set<string>(), references = new Set<string>();
    const rootId = root.id;
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(rootId)) throw new DiagramError('seguridad', 'La identidad SVG no es válida.');
    if (accessible) {
        for (const [name, content, attribute] of [['title', accessible.title, 'aria-labelledby'], ['desc', accessible.description, 'aria-describedby']] as const) {
            const element = root.querySelector(name) ?? doc.createElementNS(root.namespaceURI, name);
            if (!element.parentNode) root.prepend(element);
            if (!element.id) element.id = `${rootId}_accessible_${name}`;
            element.textContent = content; root.setAttribute(attribute, element.id);
        }
    }
    for (const element of [root, ...root.querySelectorAll('*')]) {
        if (element.namespaceURI !== root.namespaceURI || !elements.has(element.localName)) throw new DiagramError('seguridad', 'El SVG contiene elementos no permitidos.');
        if (element.id) { if (ids.has(element.id)) throw new DiagramError('seguridad', 'El SVG contiene identidades duplicadas.'); ids.add(element.id); }
        for (const attr of [...element.attributes]) {
            if (attr.name === 'xmlns' || attr.name === 'xmlns:xlink') {
                if (attr.value !== (attr.name === 'xmlns' ? root.namespaceURI : 'http://www.w3.org/1999/xlink')) throw new DiagramError('seguridad', 'El espacio de nombres SVG no está permitido.');
                continue;
            }
            if (/^on/i.test(attr.name) || !safeValue(attr.value, references)) throw new DiagramError('seguridad', 'El SVG contiene acciones o recursos no permitidos.');
            if (attr.name === 'href' || attr.name === 'xlink:href') { if (!attr.value.startsWith('#')) throw new DiagramError('seguridad', 'El SVG contiene enlaces externos.'); references.add(attr.value.slice(1)); }
            if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') attr.value.split(/\s+/).forEach(id => references.add(id));
            if (!attributes.has(attr.name)) element.removeAttribute(attr.name);
        }
        if (element.hasAttribute('style')) {
            const style = document.createElement('span').style; style.cssText = element.getAttribute('style')!;
            element.setAttribute('style', cleanDeclarations(style, references));
        }
        if (element.localName === 'style') {
            if (!safeValue(element.textContent ?? '', references, true)) throw new DiagramError('seguridad', 'El SVG contiene estilos no permitidos.');
            const sheet = new CSSStyleSheet(); sheet.replaceSync(element.textContent ?? '');
            const rules: string[] = [];
            for (const rule of [...sheet.cssRules]) {
                if (rule instanceof CSSStyleRule) {
                    if (!rule.selectorText.split(',').every(s => s.trim().startsWith(`#${rootId}`) && /^[\s>.:[#]/.test(s.trim().slice(rootId.length + 1) || ' ') && !/[+~]/.test(s))) throw new DiagramError('seguridad', 'El estilo SVG no está delimitado al diagrama.');
                    rules.push(`${rule.selectorText}{${cleanDeclarations(rule.style, references)}}`);
                } else if (!(rule instanceof CSSKeyframesRule)) throw new DiagramError('seguridad', 'El SVG contiene reglas CSS no permitidas.');
            }
            element.textContent = rules.join('\n');
        }
    }
    if ([...references].some(id => !ids.has(id))) throw new DiagramError('seguridad', 'El SVG contiene referencias internas inexistentes.');
    // Identidades únicas por instancia, también al mostrar fuentes iguales en varios paneles.
    const names = new Map([...ids].map((id, index) => [id, id === rootId ? rootId : `${rootId}_elemento_${index}`]));
    const rewrite = (value: string) => value.replace(/url\(\s*["']?#([^"')\s]+)["']?\s*\)/g, (_match, id: string) => `url(#${names.get(id) ?? id})`);
    for (const element of [root, ...root.querySelectorAll('*')]) {
        for (const attr of [...element.attributes]) {
            if (attr.name === 'id') element.setAttribute('id', names.get(attr.value)!);
            else if (attr.name === 'aria-labelledby' || attr.name === 'aria-describedby') element.setAttribute(attr.name, attr.value.split(/\s+/).map(id => names.get(id)!).join(' '));
            else if (attr.name === 'href' || attr.name === 'xlink:href') element.setAttribute(attr.name, `#${names.get(attr.value.slice(1))}`);
            else element.setAttribute(attr.name, rewrite(attr.value));
        }
        if (element.localName === 'style') element.textContent = rewrite(element.textContent ?? '').replace(/#([A-Za-z_][\w-]*)/g, (match, id: string) => names.has(id) ? `#${names.get(id)}` : match);
    }
    const vb = (root.getAttribute('viewBox') ?? '').trim().split(/[ ,]+/).map(Number);
    const width = vb.length === 4 ? vb[2] : Number.parseFloat(root.getAttribute('width') ?? '');
    const height = vb.length === 4 ? vb[3] : Number.parseFloat(root.getAttribute('height') ?? '');
    if (![width, height].every(n => Number.isFinite(n) && n > 0 && n <= 100000)) throw new DiagramError('limite', 'Las dimensiones SVG no son válidas.');
    root.setAttribute('width', String(width)); root.setAttribute('height', String(height)); root.setAttribute('role', 'img');
    return { sanitizedSvg: new XMLSerializer().serializeToString(root), width, height };
}
