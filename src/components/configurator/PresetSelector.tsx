import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Layers, X } from 'lucide-react';
import { presets, resolvePreset, type Preset } from '../../catalog/presets';
import { technologyById } from '../../catalog/technologies';
import { useEditorStore } from '../../store/editorStore';
import { useUIStore } from '../../store/uiStore';
export function PresetSelector() {
    const [preset, setPreset] = useState<Preset | null>(null);
    const [choices, setChoices] = useState<Record<string, string>>({});
    const apply = useEditorStore(s => s.applyPreset);
    const requested = useUIStore(s => s.requestedPreset);
    useEffect(() => { if (requested) {
        setChoices({});
        setPreset(presets.find(p => p.id === requested) ?? null);
        useUIStore.setState({ requestedPreset: '' });
    } }, [requested]);
    return <><label className="field preset-field"><span><Layers size={14}/> Punto de partida</span><select aria-label="Conjunto predefinido" value="" onChange={e => { setChoices({}); setPreset(presets.find(p => p.id === e.target.value) ?? null); }}><option value="">Elegir una arquitectura</option>{presets.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select></label><Dialog.Root open={!!preset} onOpenChange={open => { if (!open)
        setPreset(null); }}><Dialog.Portal><div className="overlay" aria-hidden="true"/><Dialog.Content className="dialog" onCloseAutoFocus={event => { event.preventDefault(); document.querySelector<HTMLSelectElement>('select[aria-label="Conjunto predefinido"]')?.focus(); }}><Dialog.Title>Aplicar {preset?.label}</Dialog.Title><Dialog.Description>Se sustituirán las decisiones técnicas actuales. Tu idea, alcance y arquetipo se conservan.</Dialog.Description>{preset?.variants?.map(v => <label className="field" key={v.field}><span>{v.label}</span><select aria-label={v.label} value={choices[v.field] ?? ''} onChange={e => setChoices({ ...choices, [v.field]: e.target.value })}><option value="">Elige una opción</option>{v.options.map(id => <option key={id} value={id}>{technologyById.get(id)?.label}</option>)}</select></label>)}<div className="dialog-actions"><Dialog.Close asChild><button>Cancelar</button></Dialog.Close><button className="primary" disabled={preset?.variants?.some(v => !choices[v.field])} onClick={() => { if (!preset)
        return; apply(resolvePreset(preset, choices)); useUIStore.setState({ notice: 'Conjunto aplicado. Revisa los pilares pendientes.' }); setPreset(null); }}>Aplicar conjunto</button></div><Dialog.Close className="close-icon" aria-label="Cerrar"><X size={18}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root></>;
}
