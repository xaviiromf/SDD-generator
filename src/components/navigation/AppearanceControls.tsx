import { useEffect, useState } from 'react';
import { ALargeSmall, Moon, Sun } from 'lucide-react';
export const themeKey = 'sdd-studio:tema:v1';
export const textSizeKey = 'sdd-studio:texto:v1';
type Theme = 'light' | 'dark';
const read = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* La preferencia dura solo esta sesión. */
  }
};
/** Aplica las preferencias guardadas antes del primer render para evitar un destello de tema. */
export function applyAppearance(): void {
  const theme = read(themeKey);
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
  if (read(textSizeKey) === 'grande') document.documentElement.dataset.textSize = 'grande';
}
function effectiveTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
/** Tema claro u oscuro y texto grande. */
export function AppearanceControls() {
  const [theme, setTheme] = useState<Theme>(effectiveTheme);
  const [large, setLarge] = useState(() => document.documentElement.dataset.textSize === 'grande');
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: light)');
    const follow = () => setTheme(effectiveTheme());
    media?.addEventListener('change', follow);
    return () => media?.removeEventListener('change', follow);
  }, []);
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <>
      <button
        className="appearance-toggle"
        aria-label={next === 'light' ? 'Usar tema claro' : 'Usar tema oscuro'}
        title={next === 'light' ? 'Tema claro' : 'Tema oscuro'}
        onClick={() => {
          document.documentElement.dataset.theme = next;
          write(themeKey, next);
          setTheme(next);
        }}
      >
        {next === 'light' ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
      </button>
      <button
        className="appearance-toggle text-size-toggle"
        aria-label="Texto grande"
        aria-pressed={large}
        title="Texto grande"
        onClick={() => {
          const value = !large;
          if (value) document.documentElement.dataset.textSize = 'grande';
          else delete document.documentElement.dataset.textSize;
          write(textSizeKey, value ? 'grande' : 'normal');
          setLarge(value);
        }}
      >
        <ALargeSmall size={18} aria-hidden />
      </button>
    </>
  );
}
