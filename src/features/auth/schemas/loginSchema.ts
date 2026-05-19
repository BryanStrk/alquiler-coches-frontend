import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(50, 'Máximo 50 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
