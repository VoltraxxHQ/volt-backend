import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { env } from '../../config/env.js';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return reply.send({
      success: true,
      data: {
        status: 'ok',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        env: env.NODE_ENV,
      },
    });
  });
}
