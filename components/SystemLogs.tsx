import React, { useEffect, useRef } from 'react';
import { LogEntry, Submission } from '../types';

interface SystemLogsProps {
  logs: LogEntry[];
  submissions: Submission[];
  onRemove: (id: string) => void;
  disabled: boolean;
}

const SystemLogs: React.FC<SystemLogsProps> = ({ logs, submissions, onRemove, disabled }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Visual Queue of Submissions */}
      <section className="border border-green-900 bg-black/50 p-4 relative border-glow flex flex-col h-64">
        <div className="absolute -top-3 left-4 bg-black px-2 text-green-600 text-xs font-bold uppercase">
          Staging_Buffer ({submissions.length})
        </div>
        <div className="overflow-y-auto flex-1 space-y-2 pr-2">
          {submissions.length === 0 ? (
            <div className="text-green-900 italic text-sm mt-4 text-center">Buffer Empty. Waiting for input...</div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} className="flex justify-between items-start border-l-2 border-green-800 pl-3 py-1 bg-green-900/5 hover:bg-green-900/10 transition-colors group">
                <div>
                  <div className="text-xs text-green-600 font-bold">{sub.timestamp} // {sub.id.slice(0, 8)}</div>
                  <div className="text-sm font-bold text-[#0f0]">{sub.candidateName}</div>
                  <div className="text-xs text-green-500 truncate w-48 opacity-70">"{sub.poem.slice(0, 30)}..."</div>
                </div>
                {!disabled && (
                  <button
                    onClick={() => onRemove(sub.id)}
                    className="text-red-900 hover:text-red-500 text-xs border border-red-900 hover:border-red-500 px-2 py-1 opacity-0 group-hover:opacity-100 transition-all uppercase"
                  >
                    Purge
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* System Logs */}
      <section className="border border-green-900 bg-black/50 p-4 relative border-glow flex flex-col h-64">
        <div className="absolute -top-3 left-4 bg-black px-2 text-green-600 text-xs font-bold uppercase">
          System_Logs
        </div>
        <div ref={scrollRef} className="overflow-y-auto flex-1 font-mono text-xs space-y-1">
          {logs.map((log) => (
            <div key={log.id} className={`
              ${log.type === 'ERROR' ? 'text-red-500' : ''}
              ${log.type === 'SUCCESS' ? 'text-yellow-400' : ''}
              ${log.type === 'INFO' ? 'text-green-700' : ''}
              ${log.type === 'WARNING' ? 'text-orange-500' : ''}
            `}>
              <span className="opacity-50">[{log.timestamp}]</span>
              <span className="mx-2">::</span>
              <span>{log.message}</span>
            </div>
          ))}
          <div className="animate-blink-cursor text-[#0f0] mt-2">_</div>
        </div>
      </section>
    </div>
  );
};

export default SystemLogs;