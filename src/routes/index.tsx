import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tempoClient } from '../lib/api';
import { ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: worklogs, isLoading, error } = useQuery({
    queryKey: ['worklogs', firstDay, lastDay],
    queryFn: () => tempoClient.getWorklogs({ from: firstDay, to: lastDay }),
    retry: false,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Tempo API
          </h1>
          <p className="text-zinc-400 mt-2">Jira & Tempo Integration</p>
        </div>
        <Link 
          to="/system/logs"
          className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-xs font-medium border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 bg-zinc-600 rounded-full"></span>
          System Logs
        </Link>
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm hover:border-blue-500/50 transition-all cursor-pointer">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Sync Commits
          </h2>
          <p className="text-zinc-400 text-sm">
            Analyze your git commits and prepare professional summaries for Jira worklogs.
          </p>
        </section>

        <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm hover:border-emerald-500/50 transition-all cursor-pointer group">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Tempo Integration
          </h2>
          <div className="space-y-4">
            <p className="text-zinc-400 text-sm">
              Check your current tracked time and submit worklogs directly to Tempo.
            </p>
            <div className="pt-4 border-t border-zinc-800/50">
              {isLoading ? (
                <div className="text-zinc-500 text-xs animate-pulse">Loading worklogs...</div>
              ) : error ? (
                <div className="text-red-400 text-xs flex flex-col gap-1">
                  <span className="font-bold">Connection Error:</span>
                  <span className="opacity-80 break-words">{(error as Error).message}</span>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">
                        Current Month
                      </div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {worklogs?.results.length || 0} Entries
                      </div>
                    </div>
                    <div className="text-xs text-zinc-500 font-mono">
                      {firstDay} to {lastDay}
                    </div>
                  </div>
                  
                  <Link 
                    to="/worklogs"
                    className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-sm font-semibold transition-all border border-emerald-500/20 flex items-center justify-center gap-2 group"
                  >
                    View Detailed Report
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm col-span-full">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800/50 animate-pulse text-zinc-500 text-center">
                Fetching latest activity...
              </div>
            ) : worklogs?.results.length ? (
              worklogs.results.slice(0, 5).map((w) => (
                <div key={w.tempoWorklogId} className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 text-sm font-bold">
                      {w.issue.id}
                    </div>
                    <div>
                      <h3 className="font-medium">{w.description}</h3>
                      <p className="text-sm text-zinc-500">{w.startDate} at {w.startTime}</p>
                    </div>
                  </div>
                  <div className="text-sm text-emerald-400 font-mono font-bold">
                    {Math.round(w.timeSpentSeconds / 3600 * 10) / 10}h
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
                No recent activity found in Tempo.
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        &copy; 2026 Tempo API • Powered by TanStack & Gemini
      </footer>
    </div>
  );
}
