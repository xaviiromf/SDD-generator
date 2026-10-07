import type { ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
export function PhaseSection({ number, title, children }: {
    number: number;
    title: string;
    children: ReactNode;
}) { return <Accordion.Item value={String(number)} className="phase"><Accordion.Header><Accordion.Trigger className="phase-trigger"><span className="phase-number">{String(number).padStart(2, '0')}</span><span>{title}</span><ChevronDown size={16}/></Accordion.Trigger></Accordion.Header><Accordion.Content className="phase-content">{children}</Accordion.Content></Accordion.Item>; }
