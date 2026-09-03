import { z } from 'zod';

export const leadSchema = z.object({
  lead_type: z.enum(['inquiry','partner','investor','supplier','career']),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(50).optional().nullable(),
  company: z.string().trim().max(160).optional().nullable(),
  country: z.string().trim().max(100).optional().nullable(),
  interest: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().max(5000).optional().nullable(),
  metadata: z.record(z.unknown()).optional().default({})
});

export const statusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['new','contacted','qualified','closed','rejected'])
});
