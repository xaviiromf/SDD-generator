import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Copy, Download, Terminal, Palette, X } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useEditorStore } from '../../store/editorStore';
import { useUIStore } from '../../store/uiStore';
import { archetypeById } from '../../catalog/archetypes';
import { copyText } from '../../services/clipboard';
import { packageKit, saveDownload } from '../../services/zipExport';
import { exportTokens, type TokenFormat } from '../../services/tokenExport';
import { setupCommands } from '../../services/setupCommands';
export function ExportBar() {
    const compilation = useDocumentStore(s => s.compilation);
    const pending = useDocumentStore(s => s.pending);
    const config = useEditorStore(s => s.config);
    const active = useUIStore(s => s.activeDocument);
    const [busy, setBusy] = useState(false);
    const [manual, setManual] = useState('');
    const [format, setFormat] = useState<TokenFormat>('css');
    const invoker = useRef<HTMLElement | null>(null);
    const openManual = (text: string) => { invoker.current = document.activeElement as HTMLElement; setManual(text); };
    const blocked = pending || busy || !compilation || compilation.revision !== config.revision || compilation.diagnostics.some(d => d.blocking);
    const a = archetypeById.get(config.selections.archetype?.[0] ?? '');
    const notify = (notice: string) => useUIStore.setState({ notice });
    async function copy(text: string) { if (await copyText(text))
        notify('Copiado al portapapeles.');
    else {
        openManual(text);
        notify('Selecciona el texto para copiarlo manualmente.');
    } }
    async function download() { if (blocked || !compilation)
        return; setBusy(true); try {
        const bytes = await packageKit(compilation.documents);
        await saveDownload(new Blob([new Uint8Array(bytes)], { type: 'application/zip' }), `${config.slug}-sdd.zip`);
        notify('Kit SDD descargado. Revisa sus decisiones antes de implementar.');
    }
    catch (error) {
        notify(error instanceof Error ? error.message : 'No se pudo descargar el kit. Vuelve a intentarlo.');
    }
    finally {
        setBusy(false);
    } }
    return <div className="export-bar"><div className="export-main"><button className="primary" disabled={blocked} onClick={() => void download()}><Download size={16}/>{busy ? 'Preparando archivo…' : 'Descargar Kit SDD (.zip)'}</button><button disabled={blocked} onClick={() => void copy(compilation!.documents[5].content)}><Copy size={16}/>Copiar Prompt Maestro</button></div><div className="export-secondary"><button disabled={blocked} onClick={() => void copy(compilation!.documents[active].content)}><Copy size={14}/>Copiar documento</button><button disabled={blocked} onClick={() => { try {
        openManual(setupCommands(config));
    }
    catch (e) {
        notify(e instanceof Error ? e.message : 'No se pudo preparar el comando.');
    } }}><Terminal size={14}/>Comando de Setup Rápido</button></div><details><summary><Palette size={14}/> Exportar Design Tokens</summary><label className="field"><span>Formato y perfil del destino</span><select aria-label="Formato de tokens" value={format} onChange={e => setFormat(e.target.value as TokenFormat)}><option value="css">CSS / Tailwind 4</option><option value="json">JSON</option>{config.selections.styling?.includes('tailwind') && <option value="tailwind">Configuración Tailwind 3 (perfil explícito)</option>}</select></label><button disabled={blocked || !a} onClick={() => { if (!a)
        return; const result = exportTokens(a, format); void saveDownload(new Blob([result.content], { type: 'text/plain;charset=utf-8' }), result.filename).then(() => notify('Tokens descargados.')); }}>Descargar tokens</button>{!a && <p>Selecciona un arquetipo visual para exportar tokens.</p>}</details><Dialog.Root open={!!manual} onOpenChange={open => { if (!open)
        setManual(''); }}><Dialog.Portal><Dialog.Overlay className="overlay"/><Dialog.Content className="dialog" onCloseAutoFocus={event => { event.preventDefault(); invoker.current?.focus(); }}><Dialog.Title>Texto para copiar</Dialog.Title><Dialog.Description>Selecciona el contenido y cópialo. Los comandos se muestran; no se ejecutan.</Dialog.Description><textarea aria-label="Contenido para copiar" className="copy-area" value={manual} readOnly onFocus={e => e.target.select()}/><button onClick={() => void copy(manual)}>Copiar contenido</button><Dialog.Close className="close-icon" aria-label="Cerrar"><X size={18}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root></div>;
}
