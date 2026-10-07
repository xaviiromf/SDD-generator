import { test, expect } from '@playwright/test';
test('contraste del estudio y reflujo equivalente a ampliación 200 %', async ({ page }) => {
    await page.goto('./');
    const failures = await page.locator('body').evaluate(() => {
        function parse(value: string) { return (value.match(/[\d.]+/g) ?? []).map(Number); }
        function luminance(color: number[]) { return color.slice(0, 3).map(c => c / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((s, c, i) => s + c * [.2126, .7152, .0722][i], 0); }
        const fail: {
            text: string;
            ratio: number;
        }[] = [];
        for (const e of document.querySelectorAll<HTMLElement>('body *')) {
            if (e.closest('.archetype-sample,svg,script,style') || !e.getClientRects().length || !Array.from(e.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent?.trim()))
                continue;
            if (e instanceof HTMLButtonElement && e.disabled)
                continue;
            const style = getComputedStyle(e);
            let parent: HTMLElement | null = e;
            let background = [17, 18, 21];
            while (parent) {
                const bg = parse(getComputedStyle(parent).backgroundColor);
                if (bg.length === 3 || bg[3] === 1) {
                    background = bg;
                    break;
                }
                parent = parent.parentElement;
            }
            const foreground = parse(style.color);
            const a = luminance(foreground), b = luminance(background);
            const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
            const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && parseInt(style.fontWeight) >= 700);
            if (ratio < (large ? 3 : 4.5))
                fail.push({ text: e.textContent!.slice(0, 45), ratio });
        }
        return fail;
    });
    expect(failures).toEqual([]);
    await page.setViewportSize({ width: 720, height: 500 });
    await page.getByRole('button', { name: 'Documentos SDD', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeVisible();
});
