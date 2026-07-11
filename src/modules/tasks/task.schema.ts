/**
 * Validation dependencies
 */
import { z } from 'zod';
import { TaskStatus } from '@prisma/client';

/**
 * Base Validation Schemas
 */

// Stellar addresses (Public Keys G... or Contract IDs C...)
export const addressSchema = z.string().regex(/^[GC][A-Z2-7]{55}$/, 'Invalid Stellar address');

// Stellar transaction hashes are 64 character hex strings
export const txHashSchema = z.string().regex(/^[a-fA-F0-9]{64}$/, 'Invalid transaction hash');

/**
 * Task Creation Schema
 * Used to validate the body of POST /v1/tasks
 */
export const createTaskSchema = z.object({
  // Brief title of the task
  title: z.string().min(1).max(255),
  // Detailed description of the work required
  description: z.string().min(1),
  // URI pointing to additional metadata (e.g., IPFS)
  metadataUri: z.string().url(),
  // Address of the user who created the task
  creatorAddress: addressSchema,
  // Address of the token used for payment
  tokenAddress: addressSchema,
  // Total bounty amount in stroops/units
  bountyAmount: z.string().regex(/^\d+$/, 'Amount must be a positive integer string'),
  // When the task expires
  deadline: z.string().datetime().refine((d) => new Date(d) > new Date(), 'Deadline must be in the future'),
  // Stellar network identifier (passphrase)
  chainId: z.string().min(1),
  // Address of the smart contract handling the task
  contractAddress: addressSchema,
  // Task ID as assigned on-chain
  onchainTaskId: z.string().min(1),
  // Hash of the transaction that created the task
  transactionHash: txHashSchema,
});

/**
 * Task Status Update Schema
 * Used for PATCH /v1/tasks/:id/status
 */
export const updateTaskStatusSchema = z.object({
  // The new status to be assigned
  status: z.nativeEnum(TaskStatus),
});

/**
 * Task Parameters Schema
 * Used for routes identifying a task by its internal UUID
 */
export const taskParamsSchema = z.object({
  // Internal database UUID
  id: z.string().uuid(),
});

/**
 * On-chain Task Parameters Schema
 * Used for routes identifying a task by its on-chain reference
 */
export const onchainTaskParamsSchema = z.object({
  // Network identifier
  chainId: z.string().min(1),
  // Smart contract address
  contractAddress: addressSchema,
  // On-chain assigned ID
  taskId: z.string().min(1),
});

/**
 * Task Listing Query Schema
 * Used for GET /v1/tasks with pagination and filtering
 */
export const listTasksQuerySchema = z.object({
  // Page number for pagination
  page: z.string().optional().transform((v) => (v ? Number(v) : 1)),
  // Number of items per page
  limit: z.string().optional().transform((v) => (v ? Number(v) : 20)),
  // Filter by current status
  status: z.nativeEnum(TaskStatus).optional(),
  // Filter by creator address
  creatorAddress: addressSchema.optional(),
  // Filter by worker address
  workerAddress: addressSchema.optional(),
  // Filter by network
  chainId: z.string().optional(),
});
