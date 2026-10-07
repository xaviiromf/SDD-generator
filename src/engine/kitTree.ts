import type { KitDocument } from './kitManifest';
export interface KitNode { key: string; name: string; document?: KitDocument; children: KitNode[]; }
export function kitTree(manifest: KitDocument[]): KitNode[] {
    const roots: KitNode[] = [];
    for (const document of manifest) {
        let siblings = roots;
        const parts = document.path.split('/');
        let key = '';
        parts.forEach((name, index) => {
            key += (key ? '/' : '') + name;
            let node = siblings.find(n => n.key === key);
            if (!node) { node = { key, name, children: [] }; siblings.push(node); }
            if (index === parts.length - 1) node.document = document;
            siblings = node.children;
        });
    }
    return roots;
}
export function treeLines(manifest: KitDocument[]): string {
    const lines: string[] = [];
    const walk = (nodes: KitNode[], depth: number) => nodes.forEach(node => { lines.push('  '.repeat(depth) + node.name + (node.document ? '' : '/')); walk(node.children, depth + 1); });
    walk(kitTree(manifest), 0);
    return lines.join('\n');
}
