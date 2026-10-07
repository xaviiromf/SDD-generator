export function relativeReference(from: string, to: string): string {
    const source = from.split('/').slice(0, -1);
    const target = to.split('/');
    while (source.length && target.length && source[0] === target[0]) { source.shift(); target.shift(); }
    return [...source.map(() => '..'), ...target].join('/');
}
export function documentLink(from: string, to: string, title: string): string { return `[${title}](${relativeReference(from, to)})`; }
export function brokenReferences(documents: { path: string; content: string }[]): string[] {
    const known = new Set(documents.map(d => d.path));
    const broken: string[] = [];
    for (const document of documents) for (const match of document.content.matchAll(/\]\(([^\s)]+)\)/g)) {
        const href = match[1];
        if (/^[a-z][a-z\d+.-]*:/i.test(href) || href.startsWith('#')) continue;
        const parts = document.path.split('/').slice(0, -1);
        for (const part of href.split('#')[0].split('/')) { if (part === '..') parts.pop(); else if (part && part !== '.') parts.push(part); }
        if (!known.has(parts.join('/'))) broken.push(`${document.path}: ${href}`);
    }
    return broken;
}
