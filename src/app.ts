import fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { env } from './config/env.js';
import { errorHandler } from './errors/errorHandler.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

export const buildApp = async () => {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
    },
  });

  // Plugins
  await app.register(cors, { origin: env.CORS_ORIGIN });
  await app.register(sensible);

  // Global Error Handler
  app.setErrorHandler(errorHandler);

  // Routes
  await app.register(healthRoutes);
  await app.register(taskRoutes, { prefix: `/v1/tasks` });

  return app;
};
