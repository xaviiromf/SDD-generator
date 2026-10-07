import { useEffect, useState } from 'react';
import { useUIStore } from '../../store/uiStore';
export function StatusMessage() { const notice = useUIStore(s => s.notice); const [visible, setVisible] = useState(false); useEffect(() => { setVisible(!!notice); const timer = setTimeout(() => setVisible(false), 6000); return () => clearTimeout(timer); }, [notice]); return <div role="status" aria-live="polite" className={`notice ${visible ? 'visible' : ''}`}>{notice}</div>; }
