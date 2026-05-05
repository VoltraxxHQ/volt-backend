import { FastifyInstance } from 'fastify';
import { 
  createTask, 
  getTask, 
  getTaskByOnchainRef, 
  listTasks, 
  updateTaskStatus 
} from './task.controller.js';

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.post('/', createTask);
  fastify.get('/', listTasks);
  fastify.get('/:id', getTask);
  fastify.get('/onchain/:chainId/:contractAddress/:taskId', getTaskByOnchainRef);
  fastify.patch('/:id/status', updateTaskStatus);
}
