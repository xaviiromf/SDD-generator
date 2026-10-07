import * as Accordion from '@radix-ui/react-accordion';
import { useEffect } from 'react';
import { phaseLabels, technologies } from '../../catalog/technologies';
import { useUIStore } from '../../store/uiStore';
import { PhaseSection } from './PhaseSection';
import { TechnologyField } from './TechnologyField';
import { PresetSelector } from './PresetSelector';
import { AestheticStudio } from '../aesthetics/AestheticStudio';
export function Configurator() {
    const phase = useUIStore(s => s.phase);
    useEffect(() => { const key = (event: KeyboardEvent) => { if (!(event.ctrlKey || event.metaKey) || !/^[1-7]$/.test(event.key) || useUIStore.getState().panel !== 'config' || (event.target as HTMLElement)?.closest('input,textarea,select'))
        return; event.preventDefault(); useUIStore.setState({ phase: event.key }); }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key); }, []);
    return <><PresetSelector /><Accordion.Root type="single" collapsible value={phase} onValueChange={phase => useUIStore.setState({ phase })}>{phaseLabels.map((title, index) => <PhaseSection key={title} number={index + 1} title={title}>{index === 2 && <p className="panel-footnote">Los frameworks de servidor, incluido Django, se muestran según el lenguaje y la arquitectura. Para Django elige Python y una arquitectura con servidor, como Monolito o Cliente y API desacoplados. Sus APIs y complementos aparecen en Persistencia y comunicación.</p>}{[...new Set(technologies.filter(t => t.phase === index + 1).map(t => t.field))].filter(field => field !== 'archetype').map(field => <TechnologyField key={field} field={field}/>)}{index === 4 && <AestheticStudio />}</PhaseSection>)}</Accordion.Root><p className="panel-footnote">Decisiones explícitas, documentos coherentes.<br />Cmd / Ctrl + 1…7 para recorrer las fases.</p></>;
}
