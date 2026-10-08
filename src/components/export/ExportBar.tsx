import { useTranslation } from '../../i18n/useTranslation';
import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Copy, Download, Terminal, Palette, X } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useEditorStore } from '../../store/editorStore';
import { useUIStore } from '../../store/uiStore';
import { resolveDesign } from '../../domain/design';
import { styleApplies } from '../../domain/compatibility';
import { copyText } from '../../services/clipboard';
import { packageKit, saveDownload } from '../../services/zipExport';
import { exportTokens, type TokenFormat } from '../../services/tokenExport';
import { setupCommands } from '../../services/setupCommands';
export function ExportBar() { const { t } = useTranslation();
    const compilation = useDocumentStore(s => s.compilation);
    const pending = useDocumentStore(s => s.pending);
    const config = useEditorStore(s => s.config);
    const active = useUIStore(s => s.activeDocument);
    const [draftMode, setDraftMode] = useState(false);
    const structured = !!config.project && (config.project.requirements.length > 0 || Object.values(config.project.context).some(items=>items.length > 0) || !config.project.implementationRequired || config.project.mode !== 'nuevo');
    const [busy, setBusy] = useState(false);
    const [manual, setManual] = useState('');
    const [format, setFormat] = useState<TokenFormat>('css');
    const invoker = useRef<HTMLElement | null>(null);
    const openManual = (text: string) => { invoker.current = document.activeElement as HTMLElement; setManual(text); };
    const strictBlocked = pending || busy || !compilation || compilation.revision !== config.revision || compilation.diagnostics.some(d => d.blocking);
    const blocked = pending || busy || !compilation || compilation.revision !== config.revision || compilation.diagnostics.some(d => d.blocking && !(structured && draftMode && d.kind === 'compatibility'));
    const a = styleApplies(config) ? resolveDesign(config) : undefined;
    const notify = (notice: string) => useUIStore.setState({ notice });
    async function copy(text: string) { if (await copyText(text))
        notify('Copiado al portapapeles.');
    else {
        openManual(text);
        notify('Selecciona el texto para copiarlo manualmente.');
    } }
    async function download() { if (blocked || !compilation)
        return; setBusy(true); try {
        const bytes = await packageKit(compilation.documents, { slug: compilation.slug });
        await saveDownload(new Blob([new Uint8Array(bytes)], { type: 'application/zip' }), `${config.slug}-sdd.zip`);
        notify(structured ? 'Borrador documental descargado. Revisión y autorización de implementación pendientes.' : 'Kit SDD descargado. Revisa sus decisiones antes de implementar.');
    }
    catch (error) {
        notify(error instanceof Error ? error.message : 'No se pudo descargar el kit. Vuelve a intentarlo.');
    }
    finally {
        setBusy(false);
    } }
    return <div className="export-bar">{structured&&<div className="draft-export-note"><p>Exportación de un borrador documental. No autoriza implementación ni acredita pruebas.</p><label className="context-reference"><input type="checkbox" checked={draftMode} onChange={e=>setDraftMode(e.target.checked)}/><span>Permitir borrador con conflictos tecnológicos para revisión</span></label><p>Los datos inseguros, referencias rotas y revisiones obsoletas permanecen bloqueados.</p></div>}<div className="export-main"><button className="primary" disabled={blocked} onClick={() => void download()}><Download size={16}/>{busy ? t('Preparando archivo…') : t('Descargar Kit SDD (.zip)')}</button><button disabled={blocked} onClick={() => void copy(compilation!.documents.find(d => d.id === 'orchestrator')!.content)}><Copy size={16}/>{t("Copiar Prompt Maestro")}</button></div><div className="export-secondary"><button disabled={blocked} onClick={() => void copy((compilation!.documents.find(d => d.id === active) ?? compilation!.documents.find(d => d.id === 'spec'))!.content)}><Copy size={14}/>{t("Copiar documento")}</button><button disabled={strictBlocked || config.project?.implementationRequired === false} onClick={() => { try {
        openManual(setupCommands(config));
    }
    catch (e) {
        notify(e instanceof Error ? e.message : 'No se pudo preparar el comando.');
    } }}><Terminal size={14}/>{t("Comando de preparación rápida")}</button></div><details><summary><Palette size={14}/>  {t("Exportar tokens de diseño")}</summary><label className="field"><span>{t("Formato y perfil del destino")}</span><select aria-label={t("Formato de tokens")} value={format} onChange={e => setFormat(e.target.value as TokenFormat)}><option value="css">CSS / Tailwind 4</option><option value="json">JSON</option>{config.selections.styling?.includes('tailwind') && <option value="tailwind">{t("Configuración Tailwind 3 (perfil explícito)")}</option>}</select></label><button disabled={strictBlocked || !a || config.project?.implementationRequired === false} onClick={() => { if (!a)
        return; const result = exportTokens(a, format, config.sddLanguage); void saveDownload(new Blob([result.content], { type: 'text/plain;charset=utf-8' }), result.filename).then(() => notify('Tokens descargados.')); }}>{t("Descargar tokens")}</button>{!a && <p>{t("Selecciona un estilo o personaliza el diseño para exportar tokens.")}</p>}</details><Dialog.Root open={!!manual} onOpenChange={open => { if (!open)
        setManual(''); }}><Dialog.Portal><Dialog.Overlay className="overlay"/><Dialog.Content className="dialog" onCloseAutoFocus={event => { event.preventDefault(); invoker.current?.focus(); }}><Dialog.Title>{t("Texto para copiar")}</Dialog.Title><Dialog.Description>{t("Selecciona el contenido y cópialo. Los comandos se muestran; no se ejecutan.")}</Dialog.Description><textarea lang={config.sddLanguage ?? 'es'} aria-label={t("Contenido para copiar")} className="copy-area" value={manual} readOnly onFocus={e => e.target.select()}/><button onClick={() => void copy(manual)}>{t("Copiar contenido")}</button><Dialog.Close className="close-icon" aria-label={t("Cerrar")}><X size={18}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root></div>;
}
