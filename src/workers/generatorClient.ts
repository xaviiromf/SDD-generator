import { IntentCoordinator } from '../services/intentCoordinator';
import { useMcpStore } from '../store/mcpStore';
import type { IntentSnapshot } from '../domain/intent';
import { useEditorStore } from '../store/editorStore';
import { useDocumentStore } from '../store/documentStore';
import type { Compilation, Configuration } from '../domain/models';
export class GeneratorClient {
    private worker: Worker;
    private snapshot?: IntentSnapshot;
    private pending: Configuration | null = null;
    private busy = false;
    private requested = 0;
    private sent = 0;
    private timer: ReturnType<typeof setTimeout> | null = null;
    constructor(worker: Worker, private receive: (result: Compilation) => void, private fail: (message: string) => void, private onStart: () => void = () => {}) {
        this.worker = worker;
        worker.onmessage = event => {
            this.busy = false;
            if (this.sent !== this.requested) { this.send(); return; }
            if (event.data.error)
                this.fail(event.data.error);
            else
                this.receive(event.data.result);
            this.send();
        };
        worker.onerror = () => { this.busy = false; this.fail('El motor de generación se detuvo. Reinícialo sin perder tu idea.'); };
    }
    request(config: Configuration, snapshot?: IntentSnapshot) { this.requested++; this.snapshot = snapshot; this.pending = config; if (this.timer)
        clearTimeout(this.timer); this.timer = setTimeout(() => { this.timer = null; this.send(); }, 16); }
    private send() { if (this.busy || !this.pending)
        return; const request = this.pending; this.pending = null; this.busy = true; this.sent = this.requested; this.onStart();
        this.worker.postMessage(this.snapshot ? { config: request, intent: this.snapshot } : request); }
    dispose() { if (this.timer)
        clearTimeout(this.timer); this.worker.terminate(); }
}
export function startGenerator(): () => void {
    let worker: Worker;
    try {worker=new Worker(new URL('./generator.worker.ts', import.meta.url), {type:'module'});} catch {useDocumentStore.getState().fail('No se pudo iniciar el motor local. Tu idea se conserva; revisa los permisos del navegador y vuelve a intentarlo.');return ()=>{};}
    const client = new GeneratorClient(worker, result => {
        const editor = useEditorStore.getState();
        if (result.revision !== editor.config.revision)
            return;
        if (editor.applyInferences(result.inferences))
            return;
        useDocumentStore.getState().publish(result);
    }, error => useDocumentStore.getState().fail(error), () => useDocumentStore.setState({pending:true,error:''}));
    let snapshot: IntentSnapshot | undefined;
    const request = () => client.request(useEditorStore.getState().config, snapshot);
    const coordinator = new IntentCoordinator(() => useEditorStore.getState().config, () => ({ ...useMcpStore.getState().preferences, token: useMcpStore.getState().token }), (next, connected) => { snapshot = next; useMcpStore.setState({ connected }); request(); });
    const unsubscribeMcp = useMcpStore.subscribe((state, previous) => { if (state.preferences !== previous.preferences || state.token !== previous.token) coordinator.observe(true); });
    const unsubscribe = useEditorStore.subscribe((state, previous) => { if (state.config !== previous.config)
        { coordinator.observe(); request(); } });
    const connectionChange = () => coordinator.observe(true);
    window.addEventListener('offline', connectionChange); window.addEventListener('online', connectionChange);
    coordinator.observe(); request();
    return () => { unsubscribe(); unsubscribeMcp(); window.removeEventListener('offline', connectionChange); window.removeEventListener('online', connectionChange); coordinator.dispose(); client.dispose(); };
}
