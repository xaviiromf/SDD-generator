import { useCallback } from 'react';
import { useUIStore } from '../store/uiStore';
import { uiText } from './translate';
export function useTranslation() {
    const locale = useUIStore(s => s.locale);
    const t = useCallback((text: string | undefined) => uiText(text, locale), [locale]);
    return { locale, t };
}
