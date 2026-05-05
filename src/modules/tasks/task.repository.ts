import { prisma } from '../../db/prisma.js';
import { TaskStatus } from '@prisma/client';

export class TaskRepository {
  async create(data: any) {
    return prisma.taskMetadata.create({ data });
  }

  async findById(id: string) {
    return prisma.taskMetadata.findUnique({ where: { id } });
  }

  async findByOnchainRef(chainId: number, contractAddress: string, onchainTaskId: string) {
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

  async list(filters: any, skip: number, take: number) {
    const [tasks, total] = await Promise.all([
      prisma.taskMetadata.findMany({
        where: filters,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.taskMetadata.count({ where: filters }),
    ]);
    return { tasks, total };
  }

  async updateStatus(id: string, status: TaskStatus) {
    return prisma.taskMetadata.update({
      where: { id },
      data: { status },
    });
  }
}

export const taskRepository = new TaskRepository();
