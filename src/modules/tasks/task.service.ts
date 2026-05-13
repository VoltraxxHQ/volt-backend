/**
 * Imports for TaskService
 */
import { taskRepository } from './task.repository.js';
import { ApiError } from '../../errors/ApiError.js';
import { TaskStatus } from '@prisma/client';

/**
 * TaskService Class
 * Handles business logic for task management
 */
export class TaskService {
  /**
   * Create a new task
   * @param data Task creation data
   * @returns Created task object
   * @throws ApiError if task already exists
   */
  async createTask(data: any) {
    // Check if task already exists on-chain
    const existing = await taskRepository.findByOnchainRef(
      data.chainId,
      data.contractAddress,
      data.onchainTaskId
    );
    
    // If it exists, throw an error to prevent duplicates
    if (existing) {
      throw ApiError.badRequest('Task already exists with this on-chain reference');
    }
    
    // Persist the new task to the database
    return taskRepository.create(data);
  }

  /**
   * Retrieve a task by its internal ID
   * @param id The internal task ID
   * @returns The found task
   * @throws ApiError if not found
   */
  async getTaskById(id: string) {
    // Fetch task from repository
    const task = await taskRepository.findById(id);
    
    // Ensure task exists
    if (!task) throw ApiError.notFound('Task not found');
    
    // Return the task record
    return task;
  }

  /**
   * Find a task by its on-chain reference
   * @param chainId Chain ID where the contract lives
   * @param contractAddress Address of the task contract
   * @param taskId Unique task ID on that contract
   * @returns The found task
   * @throws ApiError if not found
   */
  async getTaskByOnchainRef(chainId: number, contractAddress: string, taskId: string) {
    // Search for the task using unique on-chain identifiers
    const task = await taskRepository.findByOnchainRef(chainId, contractAddress, taskId);
    
    // Validate existence
    if (!task) throw ApiError.notFound('Task not found');
    
    // Return found record
    return task;
  }

  /**
   * List tasks with pagination and filtering
   * @param query Query parameters containing page, limit, and filters
   * @returns Paginated task list
   */
  async listTasks(query: any) {
    // Destructure pagination parameters
    const { page, limit, ...filters } = query;
    
    // Calculate skip for database query
    const skip = (page - 1) * limit;
    
    // Fetch data and total count from repository
    const { tasks, total } = await taskRepository.list(filters, skip, limit);
    
    // Construct and return paginated response
    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update the status of an existing task
   * @param id Task ID to update
   * @param status New status to apply
   * @returns Updated task record
   */
  async updateStatus(id: string, status: TaskStatus) {
    // Verify task exists before updating
    const task = await taskRepository.findById(id);
    
    // If task doesn't exist, we can't update it
    if (!task) throw ApiError.notFound('Task not found');
    
    // Execute the status update
    return taskRepository.updateStatus(id, status);
  }
}

/**
 * Export a singleton instance of TaskService
 */
export const taskService = new TaskService();
