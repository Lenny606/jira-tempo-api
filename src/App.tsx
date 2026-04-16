import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Task Tracker
          </h1>
          <p className="text-zinc-400 mt-2">Jira & Tempo Integration</p>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-zinc-800 text-sm font-medium">
            Project: <span className="text-blue-400">Jira Tempo API</span>
          </div>
        </div>
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

        <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm hover:border-emerald-500/50 transition-all cursor-pointer">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Tempo Integration
          </h2>
          <p className="text-zinc-400 text-sm">
            Check your current tracked time and submit worklogs directly to Tempo.
          </p>
        </section>

        <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 backdrop-blur-sm col-span-full">
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                    {i}
                  </div>
                  <div>
                    <h3 className="font-medium">Task PRJ-{100 + i}</h3>
                    <p className="text-sm text-zinc-500">Initial setup and configuration</p>
                  </div>
                </div>
                <div className="text-sm text-zinc-400 font-mono">
                  2h 30m
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="max-w-4xl mx-auto mt-12 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-xs">
        &copy; 2026 Task Tracker • Powered by TanStack & Gemini
      </footer>
    </div>
  )
}

export default App
