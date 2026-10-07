import { useTranslation } from '../../i18n/useTranslation';
import { useUIStore } from '../../store/uiStore';
import { useEditorStore } from '../../store/editorStore';
import type { Locale } from '../../i18n/translate';
function LanguageToggle({label, value, onChange}: {label: string; value: Locale; onChange: (locale: Locale) => void}) {
    const {t} = useTranslation();
    return <label className="language-toggle"><span>{label}</span><button type="button" role="switch" aria-label={label} aria-description={t('Desactivado: español. Activado: inglés.')} aria-checked={value === 'en'} onClick={() => onChange(value === 'es' ? 'en' : 'es')}><span lang="es" aria-hidden="true" className={value === 'es' ? 'chosen' : ''}>ES</span><span lang="en" aria-hidden="true" className={value === 'en' ? 'chosen' : ''}>EN</span></button></label>;
}
export function LanguageToggles() {
    const {t, locale} = useTranslation();
    const setLocale = useUIStore(s => s.setLocale);
    const sddLanguage = useEditorStore(s => s.config.sddLanguage ?? 'es');
    const setSDDLanguage = useEditorStore(s => s.setSDDLanguage);
    return <div className="language-toggles"><LanguageToggle label={t('Idioma de la UI')} value={locale} onChange={setLocale}/><LanguageToggle label={t('Idioma del SDD')} value={sddLanguage} onChange={setSDDLanguage}/></div>;
}
