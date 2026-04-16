import { createMiddleware } from '@tanstack/react-start';
import { logger } from '../lib/logger';

/**
 * Server-side Logging Middleware for TanStack Start
 * Captures request details, duration, and errors on the server.
 */
export const loggingMiddleware = createMiddleware().server(async ({ next, request }) => {
  const start = Date.now();
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    const response = await next();
    const duration = Date.now() - start;

    logger.info(
      {
        method: request.method,
        pathname,
        duration: `${duration}ms`,
        type: 'server_request',
      },
      'Request completed'
    );

    return response;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error(
      {
        error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        method: request.method,
        pathname,
        duration: `${duration}ms`,
        type: 'server_error',
      },
      'Request failed'
    );

    throw error;
  }
});
