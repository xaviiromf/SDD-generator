import { memo } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { styleApplies } from '../../domain/compatibility';
import { AdvancedDesignPanel } from './AdvancedDesignPanel';
import { ArchetypeCarousel } from './ArchetypeCarousel';
import { DesignSandbox } from './DesignSandbox';
export const AestheticStudio = memo(function AestheticStudio() {
    const platform = useEditorStore(s => s.config.selections.platform?.[0]);
    if (!styleApplies({ ...useEditorStore.getState().config, selections: { platform: platform ? [platform] : [] } })) return <p>El diseño visual no aplica a esta plataforma. Tu elección anterior se conserva para volver a un destino visual.</p>;
    return <><ArchetypeCarousel/><AdvancedDesignPanel/><DesignSandbox/></>;
});
