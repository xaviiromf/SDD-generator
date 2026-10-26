import { expect, it } from 'vitest';
import { diffLineLimit, lineDiff } from '../../src/domain/lineDiff';
const summary = (before: string, after: string) =>
  lineDiff(before, after)!.map(
    l => `${{ igual: ' ', eliminada: '-', añadida: '+' }[l.kind]}${l.text}`,
  );
it('calcula inserciones, borrados y sustituciones conservando el orden', () => {
  expect(summary('a\nb\nc', 'a\nb\nc')).toEqual([' a', ' b', ' c']);
  expect(summary('a\nb\nc', 'a\nx\nc')).toEqual([' a', '-b', '+x', ' c']);
  expect(summary('', 'nueva')).toEqual(['-', '+nueva']);
  expect(summary('a\nb', 'b\na')).toEqual(['-a', ' b', '+a']);
  expect(summary('1\n2\n3\n4', '0\n1\n3\n4\n5')).toEqual(['+0', ' 1', '-2', ' 3', ' 4', '+5']);
});
it('reconstruye ambos textos y rechaza entradas por encima del límite', () => {
  const before = 'uno\ndos\ntres\ncuatro\ncinco',
    after = 'uno\ntres\ncuatro bis\ncinco\nseis';
  const lines = lineDiff(before, after)!;
  expect(
    lines
      .filter(l => l.kind !== 'añadida')
      .map(l => l.text)
      .join('\n'),
  ).toBe(before);
  expect(
    lines
      .filter(l => l.kind !== 'eliminada')
      .map(l => l.text)
      .join('\n'),
  ).toBe(after);
  const big = Array.from({ length: diffLineLimit + 1 }, (_, i) => `l${i}`).join('\n');
  expect(lineDiff(big, 'otra')).toBeNull();
  expect(lineDiff(big, big)).toHaveLength(diffLineLimit + 1);
});
