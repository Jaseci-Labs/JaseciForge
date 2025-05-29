import { z } from 'zod';

export const productsSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  status: z.enum(['active', 'inactive']),
});

export type products = z.infer<typeof productsSchema>;
