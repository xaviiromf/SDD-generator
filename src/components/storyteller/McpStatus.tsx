import { memo } from 'react';
import { Network, Cpu } from 'lucide-react';
import { useMcpStore } from '../../store/mcpStore';
import { McpSettings } from './McpSettings';
export const McpStatus = memo(function McpStatus() {
    const connected = useMcpStore(s => s.connected);
    return <div className="mcp-status"><span role="status">{connected ? <Network size={14}/> : <Cpu size={14}/>} {connected ? 'MCP Conectado' : 'Motor Local Activo'}</span><McpSettings/></div>;
});
