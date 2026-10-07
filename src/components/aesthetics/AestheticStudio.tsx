import { archetypes } from '../../catalog/archetypes';
import { useEditorStore } from '../../store/editorStore';
import { styleApplies } from '../../domain/compatibility';
import { ArchetypeCard } from './ArchetypeCard';
export function AestheticStudio() { const selected = useEditorStore(s => s.config.selections.archetype?.[0]); const platform = useEditorStore(s => s.config.selections.platform?.[0]); const select = useEditorStore(s => s.select); if (!styleApplies({ ...useEditorStore.getState().config, selections: { platform: platform ? [platform] : [] } }))
    return <p>El diseño visual no aplica a esta plataforma. Tu elección anterior se conserva para volver a un destino visual.</p>; return <div className="archetype-list">{archetypes.map(a => <ArchetypeCard key={a.id} a={a} selected={selected === a.id} onSelect={() => select('archetype', a.id)}/>)}</div>; }
