import { createFileRoute, Link } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';

export const Route = createFileRoute('/system/logs')({
  component: SystemLogs,
});

interface LogEntry {
  time: string;
  level: number;
  msg: string;
  process?: string;
  [key: string]: any;
}

const LEVEL_COLORS: Record<number, string> = {
  60: 'bg-red-900/50 text-red-200 border-red-700', // fatal
  50: 'bg-red-900/40 text-red-300 border-red-800', // error
  40: 'bg-amber-900/40 text-amber-300 border-amber-800', // warn
  30: 'bg-zinc-800/50 text-zinc-300 border-zinc-700', // info
  20: 'bg-zinc-900/50 text-zinc-500 border-zinc-800', // debug
};

const LEVEL_NAMES: Record<number, string> = {
  60: 'FATAL',
  50: 'ERROR',
  40: 'WARN',
  30: 'INFO',
  20: 'DEBUG',
};

function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      if ((window as any).tempoApi?.listLogs) {
        const data = await (window as any).tempoApi.listLogs();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <Link to="/" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">System Logs</h1>
        </div>
        <button 
          onClick={fetchLogs}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors border border-zinc-700"
        >
          Refresh Now
        </button>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
            <div className="text-xs font-mono text-zinc-500">
              {logs.length} entries captured • Tailging logs/error.log
            </div>
          </div>
          
          <div className="flex flex-col h-[70vh] overflow-y-auto p-4 font-mono text-sm gap-2">
            {loading ? (
              <div className="flex items-center justify-center h-full text-zinc-500 animate-pulse">
                Loading diagnostics data...
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  ✓
                </div>
                <div>No errors logged yet. System is clean!</div>
              </div>
            ) : (
              logs.map((log, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg border flex flex-col gap-1 ${LEVEL_COLORS[log.level] || LEVEL_COLORS[30]}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[10px] px-1.5 py-0.5 rounded bg-black/30">
                        {LEVEL_NAMES[log.level] || 'INFO'}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        {new Date(log.time).toLocaleTimeString()}
                      </span>
                      {log.process && (
                        <span className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                          [{log.process}]
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap break-all leading-relaxed">
                    {log.msg}
                  </div>
                  {Object.keys(log).some(k => !['time', 'level', 'msg', 'process', 'v'].includes(k)) && (
                    <pre className="mt-2 p-2 bg-black/20 rounded text-[10px] text-zinc-500 overflow-x-auto">
                      {JSON.stringify(
                        Object.fromEntries(Object.entries(log).filter(([k]) => !['time', 'level', 'msg', 'process', 'v'].includes(k))), 
                        null, 
                        2
                      )}
                    </pre>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      
      <footer className="max-w-6xl mx-auto mt-8 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        Diagnostics Mode • Root Boundary Captured
      </footer>
    </div>
  );
}
