import React from 'react';
import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { logger } from '../lib/logger';

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ({ error, info, reset }) => {
    // Log the error captured by the root error boundary
    logger.error({ error, info }, 'Root Route Error Boundary');
    
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-red-500/50">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
          <p className="text-zinc-400 mb-6">
            An unexpected error occurred. This has been logged for investigative purposes.
          </p>
          <pre className="p-4 bg-black rounded-lg overflow-auto text-xs text-red-300 font-mono mb-6">
            {error instanceof Error ? error.message : String(error)}
          </pre>
          <button
            onClick={() => reset()}
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
