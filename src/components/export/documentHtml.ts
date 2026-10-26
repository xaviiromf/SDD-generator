import { createElement } from 'react';
import type { GeneratedDocument } from '../../domain/models';
import { splitDocument } from '../documents/DocumentContent';
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const styles = `body{margin:0;background:#fff;color:#16181d;font:15px/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:80ch;margin:0 auto;padding:40px 24px}h1,h2,h3{line-height:1.3;margin:1.6em 0 .5em}
h1{font-size:28px}h2{font-size:22px}h3{font-size:18px}a{color:#1d4ed8}
pre{background:#f3f4f6;padding:12px 14px;border-radius:6px;overflow:auto;font:13px/1.6 ui-monospace,monospace}
code{font-family:ui-monospace,monospace}table{border-collapse:collapse;width:100%;margin:12px 0}
th,td{border:1px solid #d1d5db;padding:6px 8px;text-align:left;vertical-align:top}
blockquote,.markdown-alert{border-left:4px solid #6b7280;margin:12px 0;padding:4px 14px;background:#f9fafb}
figure{margin:16px 0;overflow:auto}
.path{color:#4b5563;font:13px ui-monospace,monospace}@media print{main{padding:0}}`;
/**
 * HTML autónomo de un documento del kit: texto con el mismo renderizado seguro del
 * visor, diagramas como SVG saneado y sin scripts. Si un diagrama no se puede renderizar se conserva
 * su fuente Mermaid.
 */
export async function documentHtml(doc: GeneratedDocument): Promise<string> {
  const [{ renderToStaticMarkup }, { MarkdownText }] = await Promise.all([
    import('react-dom/server'),
    import('../documents/MarkdownText'),
  ]);
  const blocks =
    doc.format === 'TXT'
      ? [{ kind: 'text' as const, source: doc.content }]
      : splitDocument(doc.content);
  const parts: string[] = [];
  for (const block of blocks) {
    if (block.kind === 'mermaid') parts.push(`<pre><code>${escapeHtml(block.source)}</code></pre>`);
    else if (doc.format === 'TXT') parts.push(`<pre>${escapeHtml(block.source)}</pre>`);
    else parts.push(renderToStaticMarkup(createElement(MarkdownText, { source: block.source })));
  }
  return `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(doc.path)}</title><style>${styles}</style></head>
<body><main><p class="path">${escapeHtml(doc.path)}</p>
${parts.join('\n')}
</main></body></html>
`;
}
