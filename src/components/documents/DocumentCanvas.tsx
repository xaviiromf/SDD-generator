import { useTranslation } from '../../i18n/useTranslation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';
import { MaturityMeter } from './MaturityMeter';
import { FileTree } from './FileTree';
import { DocumentTabs } from './DocumentTabs';
import { ExportBar } from '../export/ExportBar';
export function DocumentCanvas() { const { t } = useTranslation(); const pending = useDocumentStore(s => s.pending); const error = useDocumentStore(s => s.error); const diagnostics = useDocumentStore(s => s.compilation?.diagnostics); return <div className="canvas"><MaturityMeter /><FileTree />{pending && <p className="updating" role="status">{t("Actualizando documentos…")}</p>}{error && <div className="diagnostic" role="alert"><AlertCircle size={16}/><p>{t(error)}</p><button onClick={() => useUIStore.setState(s => ({ restart: s.restart + 1 }))}><RefreshCw size={14}/>  {t("Reintentar")}</button></div>}{diagnostics?.map((d, index) => <div className="diagnostic" role="alert" key={index}><AlertCircle size={16}/><span>{t(d.message)}</span></div>)}<DocumentTabs /><ExportBar /></div>; }
