export interface KitTask {
    id: string;
    title: string;
    rf: string;
    depends: string[];
    files: string[];
    done: string;
}
export function assertTaskGraph(tasks: KitTask[]): void {
    const visited = new Set<string>(), active = new Set<string>();
    const byId = new Map(tasks.map(t => [t.id, t]));
    if (byId.size !== tasks.length)
        throw new Error('Hay identificadores de tarea duplicados.');
    function visit(id: string) { if (active.has(id))
        throw new Error('Las dependencias contienen un ciclo.'); if (visited.has(id))
        return; const task = byId.get(id); if (!task)
        throw new Error('Hay una dependencia desconocida.'); active.add(id); task.depends.forEach(visit); active.delete(id); visited.add(id); }
    tasks.forEach(t => visit(t.id));
}
