import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

// Stellar addresses (Public Keys G... or Contract IDs C...)
export const addressSchema = z.string().regex(/^[GC][A-Z2-7]{55}$/, 'Invalid Stellar address');
// Stellar transaction hashes are 64 character hex strings
export const txHashSchema = z.string().regex(/^[a-fA-F0-9]{64}$/, 'Invalid transaction hash');

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  metadataUri: z.string().url(),
  creatorAddress: addressSchema,
  tokenAddress: addressSchema,
  bountyAmount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  deadline: z.string().datetime().refine((d) => new Date(d) > new Date(), 'Deadline must be in the future'),
  chainId: z.string().min(1), // Using string for Stellar network identifier (passphrase)
  contractAddress: addressSchema,
  onchainTaskId: z.string().min(1),
  transactionHash: txHashSchema,
});

export const updateTaskStatusSchema = z.object({
  status: z.nativeEnum(TaskStatus),
});

export const taskParamsSchema = z.object({
  id: z.string().uuid(),
});

export const onchainTaskParamsSchema = z.object({
  chainId: z.string().min(1),
  contractAddress: addressSchema,
  taskId: z.string().min(1),
});

export const listTasksQuerySchema = z.object({
  page: z.string().optional().transform((v) => (v ? Number(v) : 1)),
  limit: z.string().optional().transform((v) => (v ? Number(v) : 20)),
  status: z.nativeEnum(TaskStatus).optional(),
  creator: addressSchema.optional(),
  worker: addressSchema.optional(),
  chainId: z.string().optional(),
});
