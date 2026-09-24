import { z } from 'zod';

export const createProxySchema = z.object({
  namespace: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Namespace can only contain letters, numbers, hyphens and underscores'),
  target: z.string().url(),
});

export const updateProxySchema = z.object({
  namespace: z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Namespace can only contain letters, numbers, hyphens and underscores').optional(),
  target: z.string().url().optional(),
});

export type CreateProxyInput = z.infer<typeof createProxySchema>;
export type UpdateProxyInput = z.infer<typeof updateProxySchema>;
