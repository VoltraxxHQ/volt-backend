/**
 * External dependencies
 */
import fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';

/**
 * Internal configuration and utilities
 */
import { env } from './config/env.js';
import { errorHandler } from './errors/errorHandler.js';

/**
 * Route handlers
 */
import { healthRoutes } from './modules/health/health.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

/**
 * buildApp factory function
 * Initializes and configures the Fastify server instance
 */
export const buildApp = async () => {
  // Initialize fastify instance with logger configuration
  const app = fastify({
    logger: {
      // Set log level from environment variables
      level: env.LOG_LEVEL,
      // Use pino-pretty for better readability in development
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  });

  /**
   * Register Plugins
   */
  
  // Configure CORS with allowed origins
  await app.register(cors, { origin: env.CORS_ORIGIN });
  
  // Register sensible plugin for HTTP error utilities
  await app.register(sensible);

  /**
   * Error Handling
   */
  
  // Set the global error handler for the application
  app.setErrorHandler(errorHandler);

  /**
   * Route Registration
   */
  
  // Register health check routes
  await app.register(healthRoutes);
  
  // Register task-related routes with v1 prefix
  await app.register(taskRoutes, { prefix: `/v1/tasks` });

  // Return the configured app instance
  return app;
};
