/**
 * Fastify types and dependencies
 */
import { FastifyReply, FastifyRequest } from 'fastify';
import { taskService } from './task.service.js';

/**
 * Validation schemas
 */
import { 
  createTaskSchema, 
  listTasksQuerySchema, 
  taskParamsSchema, 
  onchainTaskParamsSchema,
  updateTaskStatusSchema 
} from './task.schema.js';

/**
 * Controller to handle task creation
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export const createTask = async (request: FastifyRequest, reply: FastifyReply) => {
  // Parse and validate request body
  const data = createTaskSchema.parse(request.body);
  
  // Call service to create task
  const task = await taskService.createTask(data);
  
  // Send 201 Created response
  return reply.status(201).send({ success: true, data: task });
};

/**
 * Controller to retrieve a single task by ID
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export const getTask = async (request: FastifyRequest, reply: FastifyReply) => {
  // Parse task ID from parameters
  const { id } = taskParamsSchema.parse(request.params);
  
  // Fetch task via service
  const task = await taskService.getTaskById(id);
  
  // Return found task
  return reply.send({ success: true, data: task });
};

/**
 * Controller to find a task by its on-chain reference
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export const getTaskByOnchainRef = async (request: FastifyRequest, reply: FastifyReply) => {
  // Extract on-chain identifiers from params
  const { chainId, contractAddress, taskId } = onchainTaskParamsSchema.parse(request.params);
  
  // Fetch task via service
  const task = await taskService.getTaskByOnchainRef(chainId, contractAddress, taskId);
  
  // Return found task
  return reply.send({ success: true, data: task });
};

/**
 * Controller to list tasks with pagination
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export const listTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  // Parse and validate query parameters
  const query = listTasksQuerySchema.parse(request.query);
  
  // Get paginated results from service
  const result = await taskService.listTasks(query);
  
  // Return data and pagination metadata
  return reply.send({ 
    success: true, 
    data: result.tasks, 
    pagination: result.pagination 
  });
};

/**
 * Controller to update a task's status
 * @param request Fastify request object
 * @param reply Fastify reply object
 */
export const updateTaskStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  // Parse ID from params and status from body
  const { id } = taskParamsSchema.parse(request.params);
  const { status } = updateTaskStatusSchema.parse(request.body);
  
  // Update task status via service
  const task = await taskService.updateStatus(id, status);
  
  // Return updated task
  return reply.send({ success: true, data: task });
};
