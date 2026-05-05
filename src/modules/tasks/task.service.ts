import { taskRepository } from './task.repository.js';
import { ApiError } from '../../errors/ApiError.js';
import { TaskStatus } from '@prisma/client';

export class TaskService {
  async createTask(data: any) {
    const existing = await taskRepository.findByOnchainRef(
      data.chainId,
      data.contractAddress,
      data.onchainTaskId
    );
    if (existing) {
      throw ApiError.badRequest('Task already exists with this on-chain reference');
    }
    return taskRepository.create(data);
  }

  async getTaskById(id: string) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  }

  async getTaskByOnchainRef(chainId: number, contractAddress: string, taskId: string) {
    const task = await taskRepository.findByOnchainRef(chainId, contractAddress, taskId);
    if (!task) throw ApiError.notFound('Task not found');
    return task;
  }

  async listTasks(query: any) {
    const { page, limit, ...filters } = query;
    const skip = (page - 1) * limit;
    const { tasks, total } = await taskRepository.list(filters, skip, limit);
    
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

  async updateStatus(id: string, status: TaskStatus) {
    const task = await taskRepository.findById(id);
    if (!task) throw ApiError.notFound('Task not found');
    return taskRepository.updateStatus(id, status);
  }
}

export const taskService = new TaskService();
