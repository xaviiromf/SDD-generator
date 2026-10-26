import * as Accordion from '@radix-ui/react-accordion';
import { phaseLabels, technologies } from '../../catalog/technologies';
import { useUIStore } from '../../store/uiStore';
import { PhaseSection } from './PhaseSection';
import { TechnologyField } from './TechnologyField';
import { PresetSelector } from './PresetSelector';
import { AestheticStudio } from '../aesthetics/AestheticStudio';
export function Configurator() {
  const phase = useUIStore(s => s.phase);
  return (
    <>
      <PresetSelector />
      <Accordion.Root
        type="single"
        collapsible
        value={phase}
        onValueChange={phase => useUIStore.setState({ phase })}
      >
        {phaseLabels.map((title, index) => (
          <PhaseSection key={title} number={index + 1} title={title}>
            {[...new Set(technologies.filter(t => t.phase === index + 1).map(t => t.field))]
              .filter(field => field !== 'archetype')
              .map(field => (
                <TechnologyField key={field} field={field} />
              ))}
            {index === 4 && <AestheticStudio />}
          </PhaseSection>
        ))}
      </Accordion.Root>
      <p className="panel-footnote">
        Decisiones explícitas, documentos coherentes.
        <br />
        Alt + 1…5 recorre los pasos del estudio.
      </p>
    </>
  );
}
