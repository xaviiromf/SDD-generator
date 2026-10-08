import { memo, useState, type CSSProperties } from 'react';
import { Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';
import { resolveDesign } from '../../domain/design';
import { designPresentation } from '../../domain/designRecipes';
import { buttonText, contrastLabel, contrastRatio } from '../../domain/contrast';
export const DesignSandbox = memo(function DesignSandbox() {
    const [archetype, designOverrides] = useEditorStore(useShallow(s => [s.config.selections.archetype, s.config.designOverrides] as const));
    const config = { selections: { archetype }, designOverrides };
    const [state, setState] = useState<'normal' | 'hover' | 'active'>('normal');
    const [count, setCount] = useState(0);
    const d = resolveDesign(config);
    if (!d) return <p className="sandbox-pending">Selecciona un estilo o personaliza un parámetro para activar la muestra.</p>;
    const textRatio = contrastRatio(d.colors.text, d.colors.surface, d.colors.background);
    const buttonRatio = d.buttons.variant === 'solid' ? contrastRatio(buttonText(d.colors.primaryAccent, d.colors.surface, d.colors.background), d.colors.primaryAccent, d.colors.surface, d.colors.background) : textRatio;
    return <section className="sandbox-section" aria-label="Muestra interactiva de diseño"><h3>Muestra interactiva</h3><div className="sandbox-backdrop"><div className="sdd-muestra" data-testid="design-sandbox" style={designPresentation(d) as CSSProperties}><div className="sdd-tarjeta"><span className="sandbox-tag"><Sparkles/> Diseño en tiempo real</span><h2>Una idea con carácter</h2><p>Explora tu identidad visual. Estos controles solo afectan a la muestra y al SDD generado.</p><code>const proyecto = 'Tu próxima idea';</code><div className="sandbox-actions"><button className="sdd-boton" data-state={state} onClick={() => setCount(c => c + 1)}>Probar interacción</button><span>Pruebas: {count}</span></div></div></div></div><label className="field"><span>Estado simulado del botón</span><select value={state} onChange={e => setState(e.target.value as typeof state)}><option value="normal">Normal</option><option value="hover">Al pasar el puntero</option><option value="active">Presionado</option></select></label><p className="contrast-report">Texto normal: {textRatio.toFixed(2)}:1 · {contrastLabel(textRatio)}<br/>Texto grande: {textRatio >= 4.5 ? 'AAA' : textRatio >= 3 ? 'AA' : 'No cumple AA'}<br/>Botón: {buttonRatio.toFixed(2)}:1 · {contrastLabel(buttonRatio)}</p>{(textRatio < 4.5 || buttonRatio < 4.5) && <p role="status">Esta combinación no cumple AA para texto normal. Ajusta los colores para mejorar su legibilidad.</p>}</section>;
});
