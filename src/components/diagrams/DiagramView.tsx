export interface MermaidBlockProps {
  source: string;
  revision: number;
  title: string;
  description: string;
}
/** Diagrama como código Mermaid sin renderizar: el kit lo conserva y cualquier visor puede dibujarlo. */
export function DiagramView({
  title,
  description,
  source,
}: MermaidBlockProps & { active?: boolean }) {
  return (
    <figure className="mermaid-block" data-diagram-title={title}>
      <figcaption>
        <strong>{title}</strong>
        <span>{description}</span>
      </figcaption>
      <pre className="mermaid-source" tabIndex={0} aria-label={`Código Mermaid: ${title}`}>
        <code>{source}</code>
      </pre>
    </figure>
  );
}
