export interface DiffLine {
  kind: 'igual' | 'eliminada' | 'añadida';
  text: string;
}
/** Límite de líneas por lado; por encima se informa en lugar de calcular (memoria O(n·m)). */
export const diffLineLimit = 4000;
/**
 * Diferencia de líneas por subsecuencia común más larga. Devuelve null si algún
 * lado supera el límite. Los prefijos y sufijos comunes se recortan antes de la tabla.
 */
export function lineDiff(before: string, after: string): DiffLine[] | null {
  const a = before.split('\n'),
    b = after.split('\n');
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length,
    endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const x = a.slice(start, endA),
    y = b.slice(start, endB);
  if (x.length > diffLineLimit || y.length > diffLineLimit) return null;
  const width = y.length + 1;
  const table = new Uint32Array((x.length + 1) * width);
  for (let i = x.length - 1; i >= 0; i--)
    for (let j = y.length - 1; j >= 0; j--)
      table[i * width + j] =
        x[i] === y[j]
          ? table[(i + 1) * width + j + 1] + 1
          : Math.max(table[(i + 1) * width + j], table[i * width + j + 1]);
  const middle: DiffLine[] = [];
  let i = 0,
    j = 0;
  while (i < x.length && j < y.length) {
    if (x[i] === y[j]) {
      middle.push({ kind: 'igual', text: x[i] });
      i++;
      j++;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1])
      middle.push({ kind: 'eliminada', text: x[i++] });
    else middle.push({ kind: 'añadida', text: y[j++] });
  }
  while (i < x.length) middle.push({ kind: 'eliminada', text: x[i++] });
  while (j < y.length) middle.push({ kind: 'añadida', text: y[j++] });
  return [
    ...a.slice(0, start).map(text => ({ kind: 'igual' as const, text })),
    ...middle,
    ...a.slice(endA).map(text => ({ kind: 'igual' as const, text })),
  ];
}
