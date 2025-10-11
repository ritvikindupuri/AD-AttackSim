import React from 'react';
import { PowerShellLog } from '../services/aiService';
import CodeBlock from './CodeBlock';
import { TerminalIcon } from './Icons';

interface PowerShellLogViewerProps {
  logs?: PowerShellLog[];
}

const PowerShellLogViewer: React.FC<PowerShellLogViewerProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-4 h-[264px] flex items-center justify-center text-center text-gray-500">
        <div>
          <p>No enhanced PowerShell logs were generated for this step.</p>
          <p className="text-xs mt-2">(This is expected for non-PowerShell commands.)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 h-[264px] overflow-y-auto space-y-4">
      {logs.map((log, index) => (
        <div key={index} className="bg-zinc-900/50 p-3 rounded-md border border-purple-500/20">
          <div className="flex justify-between items-center mb-2 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-purple-400" />
              <span>Event ID: <span className="font-bold text-white">{log.event_id}</span></span>
            </div>
            <span>User: <span className="font-bold text-white">{log.user}</span> on <span className="font-bold text-white">{log.hostname}</span></span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-300 mb-1">Script Block Text:</p>
            <CodeBlock code={log.script_block_text} language="powershell" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PowerShellLogViewer;
