import * as Tabs from '@radix-ui/react-tabs';
import { memo, useMemo, type ReactNode } from 'react';
import Prism from 'prismjs';
const markdownGrammar = { title: /^#{1,6} .+/m, bold: /\*\*[^*\n]+\*\*/, code: /```[\s\S]*?```|`[^`\n]+`/, punctuation: /^[ \t]*(?:[-*]|\d+\.) (?=\S)/m };
import { documentPaths } from '../../domain/models';
import { useUIStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
function tokensToNodes(tokens: (string | Prism.Token)[]): ReactNode { return tokens.map((token, index) => typeof token === 'string' ? token : <span className={`token ${token.type}`} key={index}>{typeof token.content === 'string' ? token.content : tokensToNodes(Array.isArray(token.content) ? token.content : [token.content])}</span>); }
const Highlight = memo(function Highlight({ content }: {
    content: string;
}) { const tokens = useMemo(() => Prism.tokenize(content, markdownGrammar), [content]); return <pre className="markdown"><code>{tokensToNodes(tokens)}</code></pre>; });
export function DocumentTabs() { const active = useUIStore(s => s.activeDocument); const compilation = useDocumentStore(s => s.compilation); return <Tabs.Root className="document-tabs" value={String(active)} onValueChange={value => useUIStore.setState({ activeDocument: Number(value) })}><Tabs.List aria-label="Documentos generados" className="document-tab-list">{documentPaths.map((path, index) => <Tabs.Trigger key={path} value={String(index)}>{path.split('/').pop()?.replace('.md', '')}</Tabs.Trigger>)}</Tabs.List>{documentPaths.map((path, index) => <Tabs.Content key={path} value={String(index)} className="document-view"><div className="document-path"><span>{path}</span><span>MD</span></div><Highlight content={compilation?.documents[index].content ?? '# Preparando documentos\n\nEscribe tu idea o selecciona una arquitectura.'}/></Tabs.Content>)}</Tabs.Root>; }
