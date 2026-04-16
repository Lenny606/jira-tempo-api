import { createFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tempoClient } from '../lib/api';
import { Clock, ArrowLeft, Calendar, FileText, ChevronRight, Hash } from 'lucide-react';

export const Route = createFileRoute('/worklogs')({
  component: WorklogsPage,
});

function WorklogsPage() {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const { data: worklogs, isLoading, error } = useQuery({
    queryKey: ['worklogs', firstDay, lastDay],
    queryFn: () => tempoClient.getWorklogs({ from: firstDay, to: lastDay }),
    retry: false,
  });

  const totalSeconds = worklogs?.results.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0) || 0;
  const totalHours = Math.round((totalSeconds / 3600) * 10) / 10;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <Link 
            to="/" 
            className="group flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm mb-4"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Timesheet: {monthName}
          </h1>
          <p className="text-zinc-400 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            {firstDay} — {lastDay}
          </p>
        </div>

        <div className="flex bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm min-w-[200px]">
          <div>
            <div className="text-zinc-500 text-xs uppercase tracking-wider font-semibold mb-1">
              Monthly Total
            </div>
            <div className="text-3xl font-bold text-emerald-400 flex items-baseline gap-1">
              {isLoading ? '...' : totalHours}
              <span className="text-sm font-medium text-zinc-500 uppercase">hours</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 bg-zinc-900/50 text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            <div className="col-span-1">Issue</div>
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Start Time</div>
            <div className="col-span-2 text-right">Duration</div>
          </div>

          <div className="divide-y divide-zinc-800/30 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center text-zinc-500 gap-4">
                <div className="w-12 h-12 border-2 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="animate-pulse">Loading work logs...</p>
              </div>
            ) : error ? (
              <div className="p-20 text-center">
                <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-400 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-200">Failed to load logs</h3>
                <p className="text-zinc-400 text-sm mt-1 max-w-md mx-auto">
                  {(error as Error).message}
                </p>
              </div>
            ) : worklogs?.results.length === 0 ? (
              <div className="p-20 text-center text-zinc-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>No work logs found for this period.</p>
              </div>
            ) : (
              worklogs?.results.map((w) => (
                <div 
                  key={w.tempoWorklogId} 
                  className="grid grid-cols-12 gap-4 p-5 hover:bg-white/5 transition-colors items-center group"
                >
                  <div className="col-span-1">
                    <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-xs font-mono font-bold group-hover:bg-zinc-700 transition-colors">
                      {w.issue.id}
                    </span>
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-emerald-400 transition-colors">
                      {w.description || 'No description'}
                    </p>
                  </div>
                  <div className="col-span-2 text-sm text-zinc-400">
                    {w.startDate}
                  </div>
                  <div className="col-span-2 text-sm text-zinc-500 font-mono">
                    {w.startTime}
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-bold text-zinc-200">
                      {Math.round(w.timeSpentSeconds / 3600 * 10) / 10}h
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-10 pt-6 border-t border-zinc-900 flex justify-between items-center text-zinc-600 text-[10px] uppercase tracking-widest">
        <div>Tempo Worklogs • {worklogs?.results.length || 0} Entries</div>
        <div>Generated at {new Date().toLocaleTimeString()}</div>
      </footer>
    </div>
  );
}
