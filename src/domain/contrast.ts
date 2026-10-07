type RGB = [
    number,
    number,
    number
];
function color(value: string, background: RGB): RGB {
    if (value.startsWith('#'))
        return [1, 3, 5].map(i => parseInt(value.slice(i, i + 2), 16) / 255) as RGB;
    const numbers = value.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1];
    const alpha = numbers[3] ?? 1;
    return numbers.slice(0, 3).map((v, i) => v / 255 * alpha + background[i] * (1 - alpha)) as RGB;
}
function luminance(rgb: RGB) { return rgb.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0); }
export function contrastRatio(foreground: string, surface: string, background = '#FFFFFF'): number {
    const bg = color(surface, color(background, [1, 1, 1]));
    const fg = color(foreground, bg);
    const a = luminance(fg), b = luminance(bg);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}
export function contrastLabel(ratio: number): string { return ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA solo texto grande' : 'No cumple AA'; }
export function buttonText(accent: string): string { return contrastRatio('#FFFFFF', accent) >= contrastRatio('#000000', accent) ? '#FFFFFF' : '#000000'; }
