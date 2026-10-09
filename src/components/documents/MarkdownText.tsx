import { Fragment, memo, type ReactNode } from 'react';
import { CircleAlert, Info, Lightbulb, OctagonAlert, TriangleAlert } from 'lucide-react';
const alerts = { NOTE: { title: 'Nota', Icon: Info }, TIP: { title: 'Consejo', Icon: Lightbulb }, IMPORTANT: { title: 'Importante', Icon: CircleAlert }, WARNING: { title: 'Advertencia', Icon: TriangleAlert }, CAUTION: { title: 'Precaución', Icon: OctagonAlert } };
function safeLink(href: string): boolean {
    try { return ['http:', 'https:'].includes(new URL(href, 'https://sdd.local/').protocol); } catch { return false; }
}
function inline(text: string, navigate?: (href: string) => boolean): ReactNode[] {
    const result: ReactNode[] = []; let last = 0;
    const pattern = /(`+)([^`\n]+)\1|\*\*([^*\n]+)\*\*|(?<!!)\[([^\]\n]+)\]\(([^\s)]+)\)|\*([^*\n]+)\*/g;
    for (const m of text.matchAll(pattern)) {
        result.push(text.slice(last, m.index));
        const key = m.index;
        if (m[1]) result.push(<code key={key}>{m[2]}</code>);
        else if (m[3]) result.push(<strong key={key}>{m[3]}</strong>);
        else if (m[4]) result.push(safeLink(m[5]) ? <a key={key} href={m[5]} onClick={event => { if (navigate?.(m[5])) event.preventDefault(); }} {...(/^https?:\/\//i.test(m[5]) ? { target: '_blank', rel: 'noreferrer noopener' } : {})}>{m[4]}</a> : <Fragment key={key}>{m[0]}</Fragment>);
        else result.push(<em key={key}>{m[6]}</em>);
        last = m.index + m[0].length;
    }
    result.push(text.slice(last)); return result;
}
function cells(line: string): string[] {
    const value = line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '');
    const output: string[] = []; let cell = '', code = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === '\\' && value[i + 1] === '|') { cell += '|'; i++; continue; }
        if (value[i] === '`') { let end = i + 1; while (value[end] === '`') end++; const count = end - i; if (!code) code = count; else if (code === count) code = 0; cell += value.slice(i, end); i = end - 1; continue; }
        if (value[i] === '|' && !code) { output.push(cell.trim()); cell = ''; } else cell += value[i];
    }
    output.push(cell.trim()); return output;
}
const separator = (line: string) => cells(line).every(cell => /^:?-{3,}:?$/.test(cell));
function blocks(source: string, navigate?: (href: string) => boolean, depth = 0): ReactNode[] {
    if (depth > 16) return [<pre key="bounded-quote" className="markdown-code"><code>{source}</code></pre>];
    const decoded = source.replace(/&(?:gt|lt|amp|quot|#39);/g, entity => ({ '&gt;': '>', '&lt;': '<', '&amp;': '&', '&quot;': '"', '&#39;': "'" })[entity] ?? entity);
    const lines = decoded.split(/\r?\n/), output: ReactNode[] = [];
    const special = (i: number) => !lines[i]?.trim() || /^ {0,3}(?:#{1,6}\s|>|`{3,}|~{3,}|[-*+]\s|\d+\.\s)/.test(lines[i]) || (i + 1 < lines.length && lines[i].includes('|') && separator(lines[i + 1]));
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i], key = i;
        if (!line.trim()) continue;
        const fence = /^ {0,3}(`{3,}|~{3,})([^\r\n]*)$/.exec(line);
        if (fence) {
            const body: string[] = []; i++;
            while (i < lines.length) { const close = /^ {0,3}(`{3,}|~{3,})\s*$/.exec(lines[i]); if (close && close[1][0] === fence[1][0] && close[1].length >= fence[1].length) break; body.push(lines[i++]); }
            output.push(<pre key={key} className="markdown-code"><code>{body.join('\n')}</code></pre>); continue;
        }
        const heading = /^ {0,3}(#{1,6})\s+(.+?)(?:\s+#+)?$/.exec(line);
        if (heading) { const Tag = `h${heading[1].length}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; output.push(<Tag key={key}>{inline(heading[2], navigate)}</Tag>); continue; }
        if (/^ {0,3}>/.test(line)) {
            const quote: string[] = [];
            while (i < lines.length && /^ {0,3}>/.test(lines[i])) quote.push(lines[i++].replace(/^ {0,3}> ?/, ''));
            i--;
            const marker = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(.*))?$/.exec(quote[0]);
            if (marker) {
                const kind = marker[1] as keyof typeof alerts, { title, Icon } = alerts[kind];
                output.push(<aside key={key} role="note" aria-label={title} className={`markdown-alert alert-${kind.toLowerCase()}`}><div className="markdown-alert-title"><Icon size={19} aria-hidden="true"/><strong>{title}</strong></div>{blocks([marker[2] ?? '', ...quote.slice(1)].join('\n'), navigate)}</aside>);
            } else output.push(<blockquote key={key}>{blocks(quote.join('\n'), navigate)}</blockquote>);
            continue;
        }
        if (i + 1 < lines.length && line.includes('|') && separator(lines[i + 1])) {
            const headers = cells(line), align = cells(lines[i + 1]); const rows: string[][] = []; i += 2;
            while (i < lines.length && lines[i].trim() && lines[i].includes('|')) rows.push(cells(lines[i++])); i--;
            const columnCount = Math.max(headers.length, ...rows.map(row => row.length));
            while (headers.length < columnCount) headers.push(`Columna sin encabezado ${headers.length + 1}`);
            output.push(<div key={key} className="markdown-table-scroll" tabIndex={0} role="region" aria-label={`Tabla: ${headers.join(', ')}. Desplazamiento horizontal y vertical disponible.`}><table><thead><tr>{headers.map((header, n) => <th scope="col" key={n} style={{ textAlign: align[n]?.startsWith(':') && align[n]?.endsWith(':') ? 'center' : align[n]?.endsWith(':') ? 'right' : 'left' }}>{inline(header, navigate)}</th>)}</tr></thead><tbody>{rows.map((row, n) => <tr key={n}>{headers.map((_, column) => <td key={column}>{inline(row[column] ?? '', navigate)}</td>)}</tr>)}</tbody></table></div>); continue;
        }
        const list = /^ {0,3}([-*+] |\d+\. )(.+)$/.exec(line);
        if (list) {
            const ordered = /^\d/.test(list[1]), items: ReactNode[] = [];
            while (i < lines.length) { const item = /^ {0,3}([-*+] |\d+\. )(.+)$/.exec(lines[i]); if (!item || /^\d/.test(item[1]) !== ordered) break; items.push(<li key={i}>{inline(item[2], navigate)}</li>); i++; }
            i--; output.push(ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>); continue;
        }
        if (/^ {0,3}(?:---+|\*\*\*+|___+)\s*$/.test(line)) { output.push(<hr key={key}/>); continue; }
        const paragraph = [line];
        while (i + 1 < lines.length && !special(i + 1)) paragraph.push(lines[++i]);
        output.push(<p key={key}>{inline(paragraph.join('\n'), navigate)}</p>);
    }
    return output;
}
export const MarkdownText = memo(function MarkdownText({ source, navigate }: { source: string; navigate?: (href: string) => boolean }) { return <div className="markdown-pro">{blocks(source, navigate)}</div>; });
