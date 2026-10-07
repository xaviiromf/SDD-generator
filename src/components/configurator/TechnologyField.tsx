import { useTranslation } from '../../i18n/useTranslation';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';
import { technologies, fieldLabels } from '../../catalog/technologies';
import { optionCompatible } from '../../domain/compatibility';
import { singleFields, type Field } from '../../domain/models';
export function TechnologyField({ field }: {
    field: Field;
}) { const { t } = useTranslation();
    const data = useEditorStore(useShallow(s => ({ selected: s.config.selections[field], platform: s.config.selections.platform, language: s.config.selections.language, architecture: s.config.selections.architecture, backend: s.config.selections.backend, api: s.config.selections.api, select: s.select })));
    const config = { ...useEditorStore.getState().config, selections: { platform: data.platform, language: data.language, architecture: data.architecture, backend: data.backend, api: data.api } };
    const entries = technologies.filter(e => e.field === field && (optionCompatible(e, config) || data.selected?.includes(e.id)));
    if (!entries.length)
        return null;
    if (singleFields.has(field))
        return <label className="field"><span>{t(fieldLabels[field])}</span><select aria-label={t(fieldLabels[field])} value={data.selected?.[0] ?? ''} onChange={event => { if (event.target.value)
            data.select(field, event.target.value);
        else if (data.selected?.[0])
            data.select(field, data.selected[0]); }}><option value="">{t("Pendiente de definir")}</option>{entries.map(e => <option key={e.id} value={e.id}>{t(e.label)}{!optionCompatible(e, config) ? t(' — revisar compatibilidad') : ''}</option>)}</select></label>;
    return <fieldset className="technology-field"><legend>{t(fieldLabels[field])}</legend><div className="choices">{entries.map(e => <button type="button" key={e.id} aria-pressed={data.selected?.includes(e.id) ?? false} onClick={() => data.select(field, e.id)}>{t(e.label)}</button>)}</div></fieldset>;
}
