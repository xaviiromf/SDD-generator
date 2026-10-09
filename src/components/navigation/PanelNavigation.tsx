import { useTranslation } from '../../i18n/useTranslation';
import { SlidersHorizontal, PenLine, Files, LayoutDashboard } from 'lucide-react';
import { useUIStore, type Panel } from '../../store/uiStore';
const panels = [{ id: 'overview', label: 'Portada', icon: LayoutDashboard }, { id: 'config', label: 'Configuración', icon: SlidersHorizontal }, { id: 'idea', label: 'Idea / Prompt', icon: PenLine }, { id: 'docs', label: 'Documentos SDD', icon: Files }] as const;
export function PanelNavigation() { const { t } = useTranslation();
    const panel = useUIStore(s => s.panel);
    const setPanel = useUIStore(s => s.setPanel);
    return <nav className="panel-navigation" aria-label={t("Paneles del estudio")}>{panels.map(({ id, label, icon: Icon }) => <button key={id} aria-pressed={panel === id} onClick={() => setPanel(id as Panel)}><Icon size={18}/><span>{t(label)}</span></button>)}</nav>;
}
