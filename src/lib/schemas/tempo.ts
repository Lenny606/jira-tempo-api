import { z } from 'zod';

/**
 * Tempo v4 Worklog Schema
 * Based on https://apidocs.tempo.io/
 */
export const WorklogSchema = z.object({
  self: z.string().url(),
  tempoWorklogId: z.number(),
  jiraWorklogId: z.number().optional(),
  issue: z.object({
    self: z.string().url(),
    id: z.number(),
  }),
  timeSpentSeconds: z.number().int().positive(),
  billableSeconds: z.number().int().nonnegative(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, 'Time must be in HH:mm:ss format'),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  author: z.object({
    self: z.string().url(),
    accountId: z.string(),
    displayName: z.string().optional(),
  }),
  attributes: z.object({
    self: z.string().url(),
    values: z.array(z.any()),
  }).optional(),
});

export const CreateWorklogSchema = z.object({
  issueId: z.number().int().positive(),
  timeSpentSeconds: z.number().int().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  description: z.string().min(1),
  authorAccountId: z.string(),
  remainingEstimateSeconds: z.number().int().nonnegative().optional(),
  billableSeconds: z.number().int().nonnegative().optional(),
});

export const UpdateWorklogSchema = CreateWorklogSchema.partial();

export const WorklogListResponseSchema = z.object({
  metadata: z.object({
    count: z.number(),
    offset: z.number(),
    limit: z.number(),
    next: z.string().url().optional(),
    previous: z.string().url().optional(),
  }),
  results: z.array(WorklogSchema),
});

export type Worklog = z.infer<typeof WorklogSchema>;
export type CreateWorklogPayload = z.infer<typeof CreateWorklogSchema>;
export type UpdateWorklogPayload = z.infer<typeof UpdateWorklogSchema>;
export type WorklogListResponse = z.infer<typeof WorklogListResponseSchema>;
