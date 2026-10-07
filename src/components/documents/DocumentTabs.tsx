import type { Locale } from '../../i18n/translate';
import { useTranslation } from '../../i18n/useTranslation';
import * as Tabs from '@radix-ui/react-tabs';
import { memo, useMemo, type ReactNode } from 'react';
import Prism from 'prismjs';
import { quickDocumentIds } from '../../engine/kitManifest';
import { useUIStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
const markdownGrammar = { title: /^#{1,6} .+/m, bold: /\*\*[^*\n]+\*\*/, code: /```[\s\S]*?```|`[^`\n]+`/, punctuation: /^[ \t]*(?:[-*]|\d+\.) (?=\S)/m };
function tokensToNodes(tokens: (string | Prism.Token)[]): ReactNode { return tokens.map((token, index) => typeof token === 'string' ? token : <span className={`token ${token.type}`} key={index}>{typeof token.content === 'string' ? token.content : tokensToNodes(Array.isArray(token.content) ? token.content : [token.content])}</span>); }
const Highlight = memo(function Highlight({ content, plain, language }: { content: string; plain: boolean; language: Locale }) {
    const tokens = useMemo(() => plain ? content : tokensToNodes(Prism.tokenize(content, markdownGrammar)), [content, plain]);
    return <pre lang={language} className="markdown"><code>{tokens}</code></pre>;
});
export function DocumentTabs() { const { t } = useTranslation();
    const selected = useUIStore(s => s.activeDocument);
    const compilation = useDocumentStore(s => s.compilation);
    const documents = compilation?.documents ?? [];
    const active = documents.find(d => d.id === selected) ?? documents.find(d => d.id === 'spec');
    const quick = documents.filter(d => quickDocumentIds.includes(d.id)).sort((a, b) => quickDocumentIds.indexOf(a.id) - quickDocumentIds.indexOf(b.id));
    const shownTabs = active && !quick.some(d => d.id === active.id) ? [...quick, active] : quick;
    return <Tabs.Root className="document-tabs" value={active?.id ?? 'spec'} onValueChange={activeDocument => useUIStore.setState({ activeDocument })}><label className="field document-selector"><span>{t("Documento del kit")}</span><select aria-label={t("Documento del kit")} value={active?.id ?? ''} onChange={event => useUIStore.setState({ activeDocument: event.target.value })}>{documents.map(d => <option key={d.id} value={d.id}>{d.path}</option>)}</select></label><Tabs.List aria-label={t("Documentos generados")} className="document-tab-list">{shownTabs.map(d => <Tabs.Trigger key={d.id} value={d.id}>{d.id === 'orchestrator' ? '00-orchestrator' : quickDocumentIds.includes(d.id) ? d.id : d.path.split('/').pop()}</Tabs.Trigger>)}</Tabs.List>{shownTabs.map(d => <Tabs.Content key={d.id} value={d.id} className="document-view"><div className="document-path"><span>{d.path}</span><span>{d.format}</span></div><Highlight content={d.content} plain={d.format === 'TXT'} language={compilation?.sddLanguage ?? 'es'}/></Tabs.Content>)}</Tabs.Root>;
}
