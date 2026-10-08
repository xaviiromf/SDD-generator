import { uiText } from './translate';
const t = (text: string | undefined) => uiText(text, 'es');
export function useTranslation() { return { locale: 'es' as const, t }; }
