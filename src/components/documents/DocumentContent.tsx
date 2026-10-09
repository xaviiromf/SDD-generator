import { memo, useMemo } from 'react';
import type { DiagramDefinition } from '../../domain/diagrams';
import { MarkdownText } from './MarkdownText';
import { DiagramView } from '../diagrams/DiagramView';
export interface ContentBlock { kind: 'text' | 'mermaid'; source: string }
export function splitDocument(content: string): ContentBlock[] {
    const blocks: ContentBlock[] = [], lines = content.split(/(?<=\n)/); let text = '';
    for (let i = 0; i < lines.length; i++) {
        const open = /^ {0,3}(`{3,}|~{3,})([^\r\n]*)\r?\n?$/.exec(lines[i]);
        if (!open) { text += lines[i]; continue; }
        let end = i + 1;
        while (end < lines.length) { const close = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(lines[end]); if (close && close[1][0] === open[1][0] && close[1].length >= open[1].length) break; end++; }
        if (end === lines.length || open[2].trim() !== 'mermaid') { text += lines.slice(i, Math.min(end + 1, lines.length)).join(''); i = end; continue; }
        if (text) { blocks.push({ kind: 'text', source: text }); text = ''; }
        blocks.push({ kind: 'mermaid', source: lines.slice(i + 1, end).join('') }); i = end;
    }
    if (text) blocks.push({ kind: 'text', source: text }); return blocks;
}
export const DocumentContent = memo(function DocumentContent({ content, plain, revision, diagrams = [], navigate, active = true }: { content: string; plain: boolean; revision: number; diagrams?: DiagramDefinition[]; navigate?: (href: string) => boolean; active?: boolean }) {
    const blocks = useMemo(() => plain ? [{ kind: 'text' as const, source: content }] : splitDocument(content), [content, plain]);
    const definitions = useMemo(() => new Map(diagrams.map(d => [d.source.trimEnd(), d])), [diagrams]);
    return <div lang="es" className={`markdown ${active ? 'document-content' : 'document-cache'}`}>{blocks.map((block, i) => {
        if (block.kind === 'text') return plain ? <pre className="document-text" key={i}><code>{block.source}</code></pre> : <MarkdownText key={i} source={block.source} navigate={navigate}/>;
        const d = definitions.get(block.source.trimEnd());
        return <DiagramView active={active} key={d?.id ?? `manual-${i}`} source={block.source} revision={revision} title={d?.title ?? `Diagrama Mermaid ${i + 1}`} description={d?.description ?? 'Diagrama aportado en el documento. Consulta Código para sus relaciones.'}/>;
    })}</div>;
});
