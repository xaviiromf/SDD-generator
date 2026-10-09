import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { Layers, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { presets, resolvePreset, type Preset } from '../../catalog/presets';
import { technologyById } from '../../catalog/technologies';
import { useEditorStore } from '../../store/editorStore';
import { useUIStore } from '../../store/uiStore';

export function PresetSelector() {
    const { t } = useTranslation();
    const [preset, setPreset] = useState<Preset | null>(null);
    const [choices, setChoices] = useState<Record<string, string>>({});
    const dialog = useRef<HTMLDialogElement>(null);
    const selector = useRef<HTMLSelectElement>(null);
    const titleId = useId();
    const descriptionId = useId();
    const apply = useEditorStore(s => s.applyPreset);
    const requested = useUIStore(s => s.requestedPreset);

    useEffect(() => {
        if (!requested) return;
        setChoices({});
        setPreset(presets.find(p => p.id === requested) ?? null);
        useUIStore.setState({ requestedPreset: '' });
    }, [requested]);
    useLayoutEffect(() => {
        const element = dialog.current;
        if (!element) return;
        if (!preset) {
            if (element.open) {
                element.close();
                selector.current?.focus({ preventScroll: true });
            }
            return;
        }
        if (!element.open) element.show();
        const application = document.getElementById('root');
        const previousHidden = application?.getAttribute('aria-hidden');
        const previousOverflow = document.body.style.getPropertyValue('overflow');
        const previousPriority = document.body.style.getPropertyPriority('overflow');
        document.body.style.setProperty('overflow', 'hidden');
        application?.setAttribute('aria-hidden', 'true');
        const controls = () => Array.from(element.querySelectorAll<HTMLElement>('button:not([disabled]),select:not([disabled]),input:not([disabled]),textarea:not([disabled]),a[href],[tabindex="0"]'));
        const keepFocus = (event: FocusEvent) => {
            if (event.target instanceof Node && !element.contains(event.target)) controls()[0]?.focus({ preventScroll: true });
        };
        const keys = (event: KeyboardEvent) => {
            event.stopPropagation();
            if (event.key === 'Escape') {
                event.preventDefault();
                flushSync(() => setPreset(null));
            } else if (event.key === 'Tab') {
                const items = controls();
                const index = items.indexOf(document.activeElement as HTMLElement);
                const next = event.shiftKey ? (index <= 0 ? items.length - 1 : index - 1) : (index + 1) % items.length;
                event.preventDefault();
                items[next]?.focus({ preventScroll: true });
            }
        };
        const blockOutsideScroll = (event: WheelEvent) => {
            if (event.target instanceof Node && !element.contains(event.target)) event.preventDefault();
        };
        document.addEventListener('focusin', keepFocus, true);
        document.addEventListener('wheel', blockOutsideScroll, { capture: true, passive: false });
        element.addEventListener('keydown', keys);
        return () => {
            document.removeEventListener('focusin', keepFocus, true);
            document.removeEventListener('wheel', blockOutsideScroll, true);
            element.removeEventListener('keydown', keys);
            if (previousOverflow) document.body.style.setProperty('overflow', previousOverflow, previousPriority);
            else document.body.style.removeProperty('overflow');
            if (application) {
                if (previousHidden == null) application.removeAttribute('aria-hidden');
                else application.setAttribute('aria-hidden', previousHidden);
            }
        };
    }, [preset]);

    function closePreset() {
        flushSync(() => setPreset(null));
    }

    return <>
        <label className="field preset-field"><span><Layers size={14}/> {t('Punto de partida')}</span>
            <select ref={selector} data-preset-selector aria-label={t('Conjunto predefinido')} value="" onChange={event => {
                setChoices({});
                setPreset(presets.find(p => p.id === event.target.value) ?? null);
            }}>
                <option value="">{t('Elegir una arquitectura')}</option>
                {presets.map(p => <option key={p.id} value={p.id}>{t(p.label)}</option>)}
            </select>
        </label>
        {createPortal(<>{preset&&<div className="overlay" aria-hidden="true" onClick={closePreset}/> }
        <dialog ref={dialog} className="dialog preset-dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}
            onCancel={event => { event.preventDefault(); closePreset(); }}
            >
            <h2 id={titleId}>{t('Aplicar')} {t(preset?.label)}</h2>
            <p id={descriptionId}>{t('Se sustituirán las decisiones técnicas actuales. Tu idea, alcance y arquetipo se conservan.')}</p>
            {preset?.variants?.map(v => <label className="field" key={v.field}><span>{t(v.label)}</span>
                <select aria-label={t(v.label)} value={choices[v.field] ?? ''} onChange={event => setChoices({ ...choices, [v.field]: event.target.value })}>
                    <option value="">{t('Elige una opción')}</option>
                    {v.options.map(id => <option key={id} value={id}>{t(technologyById.get(id)?.label)}</option>)}
                </select>
            </label>)}
            <div className="dialog-actions">
                <button onClick={closePreset}>{t('Cancelar')}</button>
                <button className="primary" disabled={preset?.variants?.some(v => !choices[v.field])} onClick={() => {
                    if (!preset) return;
                    const selection = resolvePreset(preset, choices);
                    flushSync(() => {
                        apply(selection);
                        setPreset(null);
                        useUIStore.setState({ notice: 'Conjunto aplicado. Revisa los pilares pendientes.' });
                    });
                }}>{t('Aplicar conjunto')}</button>
            </div>
            <button className="close-icon" aria-label={t('Cerrar')} onClick={closePreset}><X size={18}/></button>
        </dialog></>, document.body)}
    </>;
}
