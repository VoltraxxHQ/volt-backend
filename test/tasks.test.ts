import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '../src/modules/tasks/task.service.js';
import { taskRepository } from '../src/modules/tasks/task.repository.js';
import { TaskStatus } from '@prisma/client';

vi.mock('../src/modules/tasks/task.repository.js', () => ({
  taskRepository: {
    findByOnchainRef: vi.fn(),
    create: vi.fn(),
    findById: vi.fn(),
    list: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

describe('TaskService', () => {
  const mockTask = {
    id: 'uuid-1',
    title: 'Test Task',
    status: TaskStatus.CREATED,
    chainId: 1,
    contractAddress: '0x123...',
    onchainTaskId: '1',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a task when it does not exist', async () => {
    vi.mocked(taskRepository.findByOnchainRef).mockResolvedValue(null);
    vi.mocked(taskRepository.create).mockResolvedValue(mockTask as any);

    const result = await taskService.createTask(mockTask);
    expect(result).toEqual(mockTask);
    expect(taskRepository.create).toHaveBeenCalled();
  });

  it('should throw error if task already exists', async () => {
    vi.mocked(taskRepository.findByOnchainRef).mockResolvedValue(mockTask as any);

    await expect(taskService.createTask(mockTask)).rejects.toThrow('Task already exists');
  });

  it('should list tasks with pagination', async () => {
    vi.mocked(taskRepository.list).mockResolvedValue({ tasks: [mockTask], total: 1 } as any);

    const result = await taskService.listTasks({ page: 1, limit: 10 });
    expect(result.tasks).toHaveLength(1);
    expect(result.pagination.totalPages).toBe(1);
  });
});
