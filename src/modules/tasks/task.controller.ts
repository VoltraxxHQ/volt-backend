import { FastifyReply, FastifyRequest } from 'fastify';
import { taskService } from './task.service.js';
import { 
  createTaskSchema, 
  listTasksQuerySchema, 
  taskParamsSchema, 
  onchainTaskParamsSchema,
  updateTaskStatusSchema 
} from './task.schema.js';

export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = createTaskSchema.parse(request.body);
  const task = await taskService.createTask(data);
  return reply.status(201).send({ success: true, data: task });
};

export const getTask = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = taskParamsSchema.parse(request.params);
  const task = await taskService.getTaskById(id);
  return reply.send({ success: true, data: task });
};

export const getTaskByOnchainRef = async (request: FastifyRequest, reply: FastifyReply) => {
  const { chainId, contractAddress, taskId } = onchainTaskParamsSchema.parse(request.params);
  const task = await taskService.getTaskByOnchainRef(chainId, contractAddress, taskId);
  return reply.send({ success: true, data: task });
};

export const listTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = listTasksQuerySchema.parse(request.query);
  const result = await taskService.listTasks(query);
  return reply.send({ 
    success: true, 
    data: result.tasks, 
    pagination: result.pagination 
  });
};

export const updateTaskStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  const { id } = taskParamsSchema.parse(request.params);
  const { status } = updateTaskStatusSchema.parse(request.body);
  const task = await taskService.updateStatus(id, status);
  return reply.send({ success: true, data: task });
};
