/**
 * Imports for TaskRepository
 */
import { prisma } from '../../db/prisma.js';
import { TaskStatus } from '@prisma/client';

/**
 * TaskRepository Class
 * Handles direct database operations for tasks
 */
export class TaskRepository {
  /**
   * Create a new task record in the database
   * @param data The task data to persist
   * @returns The created task metadata
   */
  async create(data: any) {
    // Perform creation using Prisma client
    return prisma.taskMetadata.create({ data });
  }

  /**
   * Find a single task by its unique database ID
   * @param id The UUID of the task
   * @returns The task record or null
   */
  async findById(id: string) {
    // Query by unique internal ID
    return prisma.taskMetadata.findUnique({ where: { id } });
  }

  /**
   * Find a task by its unique on-chain identifiers
   * @param chainId The blockchain network ID
   * @param contractAddress The contract address
   * @param onchainTaskId The task ID within the contract
   * @returns The task record or null
   */
  async findByOnchainRef(chainId: string, contractAddress: string, onchainTaskId: string) {
    // Query using the composite unique key
    return prisma.taskMetadata.findUnique({
      where: {
        chainId_contractAddress_onchainTaskId: {
          chainId,
          contractAddress,
          onchainTaskId,
        },
      },
    });
  }

  /**
   * Retrieve a paginated list of tasks based on filters
   * @param filters Filtering criteria
   * @param skip Number of records to skip
   * @param take Number of records to take
   * @returns Object containing tasks and total count
   */
  async list(filters: any, skip: number, take: number) {
    // Execute both queries in parallel for efficiency
    const [tasks, total] = await Promise.all([
      // Fetch the subset of tasks
      prisma.taskMetadata.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      // Count total matching records for pagination
      prisma.taskMetadata.count({ where: filters }),
    ]);
    
    // Return aggregated results
    return { tasks, total };
  }

  /**
   * Update the status field of a task
   * @param id The task ID to update
   * @param status The new status value
   * @returns The updated task record
   */
  async updateStatus(id: string, status: TaskStatus) {
    // Execute partial update on the record
    return prisma.taskMetadata.update({
      where: { id },
      data: { status },
    });
  }
}

/**
 * Export a singleton instance of TaskRepository
 */
export const taskRepository = new TaskRepository();
