import { useTranslation } from '../../i18n/useTranslation';
import { Lightbulb, X } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { useEditorStore } from '../../store/editorStore';
import { technologyById } from '../../catalog/technologies';
export function ScopeBadges() { const { t } = useTranslation(); const suggestions = useDocumentStore(s => s.compilation?.suggestions); const dismissed = useUIStore(s => s.dismissed); const select = useEditorStore(s => s.select); return <div>{suggestions?.filter(s => !dismissed.includes(s.id)).map(s => <aside className="scope-badge" key={s.id}><Lightbulb size={18}/><div><p>{t(s.message)}</p><div className="choices">{s.options.map(id => <button key={id} onClick={() => { const e = technologyById.get(id); if (e)
    select(e.field, id); }}>{t(technologyById.get(id)?.label)}</button>)}</div></div><button aria-label={t("Descartar sugerencia")} onClick={() => useUIStore.setState({ dismissed: [...dismissed, s.id] })}><X size={16}/></button></aside>)}</div>; }
