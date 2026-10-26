import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Copy, Download, FileDown, Printer, Terminal, Palette, X, ChevronDown } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useEditorStore } from '../../store/editorStore';
import { notify, useUIStore } from '../../store/uiStore';
import { resolveDesign } from '../../domain/design';
import { styleApplies } from '../../domain/compatibility';
import { copyText } from '../../services/clipboard';
import { packageChange, packageKit, saveDownload } from '../../services/zipExport';
import { firstMessage } from '../../engine/templates/governance';
import { exportTokens, type TokenFormat } from '../../services/tokenExport';
import { setupCommands } from '../../services/setupCommands';
export function ExportBar() {
  const compilation = useDocumentStore(s => s.compilation);
  const pending = useDocumentStore(s => s.pending);
  const config = useEditorStore(s => s.config);
  const active = useUIStore(s => s.activeDocument);
  const [draftMode, setDraftMode] = useState(false);
  const structured =
    !!config.project &&
    (config.project.requirements.length > 0 ||
      Object.values(config.project.context).some(items => items.length > 0) ||
      !config.project.implementationRequired ||
      config.project.mode !== 'nuevo');
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState('');
  const [format, setFormat] = useState<TokenFormat>('css');
  // Número de la última carpeta de cambio exportada por proyecto: solo una ayuda local.
  const lastChangeKey = `sdd-studio:ultimo-cambio:${config.slug}`;
  const [changeNumber, setChangeNumber] = useState(0);
  const proposeChange = () => {
    let last = 1;
    try {
      last = Number(localStorage.getItem(lastChangeKey)) || 1;
    } catch {
      /* Sin almacenamiento: se propone 002. */
    }
    setChangeNumber(Math.min(last + 1, 999));
  };
  const invoker = useRef<HTMLElement | null>(null);
  const openManual = (text: string) => {
    invoker.current = document.activeElement as HTMLElement;
    setManual(text);
  };
  const strictBlocked =
    pending ||
    busy ||
    !compilation ||
    compilation.revision !== config.revision ||
    compilation.diagnostics.some(d => d.blocking);
  const blocked =
    pending ||
    busy ||
    !compilation ||
    compilation.revision !== config.revision ||
    compilation.diagnostics.some(
      d => d.blocking && !(structured && draftMode && d.kind === 'compatibility'),
    );
  const conflicts = useDocumentStore(s => s.manualConflicts.length);
  const reasons = [
    ...(conflicts
      ? ['Hay aportaciones manuales por reconciliar en «Aportaciones manuales por sección».']
      : []),
    ...(compilation?.diagnostics
      .filter(d => d.blocking && !(structured && draftMode && d.kind === 'compatibility'))
      .map(d => d.message) ?? []),
  ];
  const warnings = [
    ...new Set(compilation?.diagnostics.filter(d => d.kind === 'style').map(d => d.message)),
  ];
  const a = styleApplies(config) ? resolveDesign(config) : undefined;
  async function copy(text: string) {
    if (await copyText(text)) notify('Copiado al portapapeles.', 'exito');
    else {
      openManual(text);
      notify('Selecciona el texto para copiarlo manualmente.');
    }
  }
  async function download() {
    if (blocked || !compilation) return;
    setBusy(true);
    try {
      const bytes = changeNumber
        ? await packageChange(compilation.documents, compilation.slug, changeNumber)
        : await packageKit(compilation.documents, { slug: compilation.slug });
      await saveDownload(
        new Blob([new Uint8Array(bytes)], { type: 'application/zip' }),
        changeNumber
          ? `${config.slug}-cambio-${String(changeNumber).padStart(3, '0')}.zip`
          : `${config.slug}-sdd.zip`,
      );
      if (changeNumber)
        try {
          localStorage.setItem(lastChangeKey, String(changeNumber));
        } catch {
          /* La exportación ya se hizo; solo se pierde la sugerencia del siguiente número. */
        }
      notify(
        structured
          ? 'Borrador documental descargado. Revisión y autorización de implementación pendientes.'
          : 'Kit SDD descargado. Revisa sus decisiones antes de implementar.',
        'exito',
      );
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : 'No se pudo descargar el kit. Vuelve a intentarlo.',
        'error',
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="export-bar">
      <div className="export-main">
        <button className="primary" disabled={blocked} onClick={() => void download()}>
          <Download size={16} />
          {busy ? 'Preparando archivo…' : 'Descargar Kit SDD (.zip)'}
        </button>
        <button onClick={() => void copy(firstMessage)}>
          <Copy size={16} />
          Copiar primer mensaje
        </button>
        <label className="kit-profile">
          <span>Contenido del ZIP</span>
          <select
            value={changeNumber ? 'cambio' : 'nuevo'}
            onChange={e => (e.target.value === 'cambio' ? proposeChange() : setChangeNumber(0))}
          >
            <option value="nuevo">Proyecto nuevo (7 documentos)</option>
            <option value="cambio">Cambio en un proyecto existente</option>
          </select>
        </label>
        {changeNumber > 0 && (
          <label className="kit-profile">
            <span>Número de la carpeta nueva</span>
            <input
              type="number"
              min={2}
              max={999}
              value={changeNumber}
              onChange={e =>
                setChangeNumber(Math.max(2, Math.min(999, Number(e.target.value) || 2)))
              }
            />
          </label>
        )}
      </div>
      <p className="export-guide">
        {changeNumber
          ? 'El ZIP trae solo la carpeta specs/ del cambio y dos fragmentos para DECISIONS.md y AGENTS.md. No incluye docs/PROJECT_STATUS.md: tu repositorio conserva el estado y las autorizaciones.'
          : 'Copia los siete archivos en la raíz del repositorio destino (no incluye README). Entrega al agente el primer mensaje, revisa spec, plan y tasks y rellena tú los bloques «Revisión humana» y «Autorización» de docs/PROJECT_STATUS.md.'}
      </p>
      {reasons.length > 0 && (
        <div className="export-blocked" role="alert">
          <p>Exportación bloqueada hasta resolver:</p>
          <ul>
            {reasons.map(reason => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="export-warnings" role="status">
          <p>Avisos antes de exportar (no bloquean):</p>
          <ul>
            {warnings.map(warning => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="export-secondary">
        <button
          disabled={blocked}
          onClick={() =>
            void copy(
              (compilation!.documents.find(d => d.id === active) ??
                compilation!.documents.find(d => d.id === 'spec'))!.content,
            )
          }
        >
          <Copy size={14} />
          Copiar documento
        </button>
        <button
          disabled={strictBlocked || config.project?.implementationRequired === false}
          onClick={() => {
            try {
              openManual(setupCommands(config));
            } catch (e) {
              notify(e instanceof Error ? e.message : 'No se pudo preparar el comando.', 'error');
            }
          }}
        >
          <Terminal size={14} />
          Comando de preparación rápida
        </button>
        <button disabled={blocked} onClick={() => window.print()}>
          <Printer size={14} aria-hidden />
          Imprimir o guardar PDF
        </button>
        <button
          disabled={blocked}
          onClick={() => {
            const doc =
              compilation!.documents.find(d => d.id === active) ??
              compilation!.documents.find(d => d.id === 'spec')!;
            void import('./documentHtml')
              .then(({ documentHtml }) => documentHtml(doc))
              .then(html =>
                saveDownload(
                  new Blob([html], { type: 'text/html;charset=utf-8' }),
                  `${doc.path
                    .split('/')
                    .pop()!
                    .replace(/\.(md|txt)$/i, '')}.html`,
                ),
              )
              .then(() => notify('Documento descargado como HTML.', 'exito'))
              .catch(() => notify('No se pudo preparar el HTML del documento.', 'error'));
          }}
        >
          <FileDown size={14} aria-hidden />
          Descargar HTML
        </button>
      </div>
      {structured && (
        <div className="draft-export-note">
          <p>
            Exportación de un borrador documental. No autoriza implementación ni acredita pruebas.
          </p>
          <label className="context-reference">
            <input
              type="checkbox"
              checked={draftMode}
              onChange={e => setDraftMode(e.target.checked)}
            />
            <span>Permitir borrador con conflictos tecnológicos para revisión</span>
          </label>
          <p>
            Los datos inseguros, referencias rotas y revisiones obsoletas permanecen bloqueados.
          </p>
        </div>
      )}
      <details>
        <summary>
          <Palette size={14} /> Exportar tokens de diseño
          <ChevronDown className="summary-chevron" size={16} aria-hidden />
        </summary>
        <label className="field">
          <span>Formato y perfil del destino</span>
          <select
            aria-label="Formato de tokens"
            value={format}
            onChange={e => setFormat(e.target.value as TokenFormat)}
          >
            <option value="css">CSS / Tailwind 4</option>
            <option value="json">JSON</option>
            {config.selections.styling?.includes('tailwind') && (
              <option value="tailwind">Configuración Tailwind 3 (perfil explícito)</option>
            )}
          </select>
        </label>
        <button
          disabled={strictBlocked || !a || config.project?.implementationRequired === false}
          onClick={() => {
            if (!a) return;
            const result = exportTokens(a, format, config.sddLanguage);
            void saveDownload(
              new Blob([result.content], { type: 'text/plain;charset=utf-8' }),
              result.filename,
            ).then(() => notify('Tokens descargados.', 'exito'));
          }}
        >
          Descargar tokens
        </button>
        {!a && <p>Selecciona un estilo o personaliza el diseño para exportar tokens.</p>}
      </details>
      <Dialog.Root
        open={!!manual}
        onOpenChange={open => {
          if (!open) setManual('');
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="overlay" />
          <Dialog.Content
            className="dialog"
            onCloseAutoFocus={event => {
              event.preventDefault();
              invoker.current?.focus();
            }}
          >
            <Dialog.Title>Texto para copiar</Dialog.Title>
            <Dialog.Description>
              Selecciona el contenido y cópialo. Los comandos se muestran; no se ejecutan.
            </Dialog.Description>
            <textarea
              lang={config.sddLanguage ?? 'es'}
              aria-label="Contenido para copiar"
              className="copy-area"
              value={manual}
              readOnly
              onFocus={e => e.target.select()}
            />
            <button onClick={() => void copy(manual)}>Copiar contenido</button>
            <Dialog.Close className="close-icon" aria-label="Cerrar">
              <X size={18} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
