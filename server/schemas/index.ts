import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Formato de correo electrónico inválido').max(255),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(128),
    avatar: z.string().url('URL de avatar inválida').optional().or(z.literal('')),
});

export const loginSchema = z.object({
    email: z.string().email('Formato de correo electrónico inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
});

export const taskSchema = z.object({
    title: z.string().min(1, 'El título es requerido').max(255),
    description: z.string().max(1000, 'La descripción es demasiado larga').optional().nullable(),
    status: z.enum(['overdue', 'today', 'upcoming']).default('today'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)').optional().nullable().or(z.literal('')),
    time: z.string().optional().nullable().or(z.literal('')),
    urgency: z.enum(['normal', 'high', 'critical']).default('normal'),
    tags: z.array(z.enum(['urgent', 'work', 'personal', 'finance'])).optional(),
});

export const taskUpdateSchema = taskSchema.partial();

export const profileUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().optional().or(z.literal('')),
});
