import { useEffect } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { dismissNotice, useUIStore, type Notice } from '../../store/uiStore';
const icons = { info: Info, exito: CheckCircle2, aviso: AlertTriangle, error: AlertCircle };
function NoticeItem({ notice }: { notice: Notice }) {
  const Icon = icons[notice.kind];
  // Información y éxito se retiran solos; avisos y errores esperan a que la persona los cierre.
  useEffect(() => {
    if (notice.kind === 'aviso' || notice.kind === 'error') return;
    const timer = setTimeout(() => dismissNotice(notice.id), 6000);
    return () => clearTimeout(timer);
  }, [notice]);
  return (
    <div
      className={`notice-item notice-${notice.kind}`}
      role={notice.kind === 'error' ? 'alert' : undefined}
    >
      <Icon size={16} aria-hidden />
      <p>{notice.text}</p>
      <button
        className="notice-close"
        aria-label="Cerrar notificación"
        onClick={() => dismissNotice(notice.id)}
      >
        <X size={14} />
      </button>
    </div>
  );
}
export function StatusMessage() {
  const notices = useUIStore(s => s.notices);
  return (
    <section role="status" aria-live="polite" aria-label="Notificaciones" className="notice">
      {notices.map(n => (
        <NoticeItem key={n.id} notice={n} />
      ))}
    </section>
  );
}
