import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ApiError } from './ApiError.js';
import { ZodError } from 'zod';

export const errorHandler = (
  error: FastifyError | ApiError | ZodError,
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.errors,
      },
    });
  }

  // Default error
  _request.log.error(error);
  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
