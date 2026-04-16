import pino from 'pino';

const isServer = typeof window === 'undefined';

/**
 * Robust Logger Utility
 * Handles isomorphic logging (Browser vs Node/Server)
 * Captured logs are output to stdout and separate files on the server.
 */

// Basic configuration
const config = {
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  base: {
    env: process.env.NODE_ENV,
    process: isServer ? 'server' : 'client',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

let logger: pino.Logger;

if (isServer) {
  // Server-side logging configurations
  // In a real production server, we might use pino-pretty for stdout
  // and direct streams to files for errors and combined logs.
  
  const transport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        level: config.level,
        options: {
          colorize: true,
          ignore: 'pid,hostname,env,process',
        },
      },
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: './logs/combined.log', mkdir: true },
      },
      {
        target: 'pino/file',
        level: 'error',
        options: { destination: './logs/error.log', mkdir: true },
      },
    ],
  });

  logger = pino(config, transport);
} else {
  // Client-side logging (Browser)
  // Pino automatically falls back to console in the browser
  logger = pino({
    ...config,
    browser: {
      asObject: true,
    },
  });
}

export { logger };
