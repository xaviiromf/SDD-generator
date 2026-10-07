import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';
import { technologies, fieldLabels } from '../../catalog/technologies';
import { optionCompatible } from '../../domain/compatibility';
import { singleFields, type Field } from '../../domain/models';
export function TechnologyField({ field }: {
    field: Field;
}) {
    const data = useEditorStore(useShallow(s => ({ selected: s.config.selections[field], platform: s.config.selections.platform, language: s.config.selections.language, architecture: s.config.selections.architecture, select: s.select })));
    const config = { ...useEditorStore.getState().config, selections: { platform: data.platform, language: data.language, architecture: data.architecture } };
    const entries = technologies.filter(e => e.field === field && (optionCompatible(e, config) || data.selected?.includes(e.id)));
    if (!entries.length)
        return null;
    if (singleFields.has(field))
        return <label className="field"><span>{fieldLabels[field]}</span><select aria-label={fieldLabels[field]} value={data.selected?.[0] ?? ''} onChange={event => { if (event.target.value)
            data.select(field, event.target.value);
        else if (data.selected?.[0])
            data.select(field, data.selected[0]); }}><option value="">Pendiente de definir</option>{entries.map(e => <option key={e.id} value={e.id}>{e.label}{!optionCompatible(e, config) ? ' — revisar compatibilidad' : ''}</option>)}</select></label>;
    return <fieldset className="technology-field"><legend>{fieldLabels[field]}</legend><div className="choices">{entries.map(e => <button type="button" key={e.id} aria-pressed={data.selected?.includes(e.id) ?? false} onClick={() => data.select(field, e.id)}>{e.label}</button>)}</div></fieldset>;
}
