import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { z } from 'zod';

const taskUpdateSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(1000).optional().nullable(),
    status: z.enum(['overdue', 'today', 'upcoming']).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal('')),
    time: z.string().optional().nullable().or(z.literal('')),
    urgency: z.enum(['normal', 'high', 'critical']).optional(),
    completed: z.boolean().optional(),
    tags: z.array(z.enum(['urgent', 'work', 'personal', 'finance'])).optional(),
}).partial();

function getPool() {
    return mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '4000'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false },
        connectionLimit: 5,
    });
}
import { verifyVercelToken } from '../utils/auth';


export default async function handler(req: any, res: any) {
    const allowedOrigin = process.env.FRONTEND_URL || 'https://gestor-de-tareas-henna.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const user = verifyVercelToken(req, res);
    if (!user) return; // verifyVercelToken handles the 401 response

    // Extraer el ID de la tarea desde la URL: /api/tasks/123
    const { id } = req.query;
    const taskId = parseInt(id as string, 10);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tarea inválido' });
    }

    const pool = getPool();
    try {
        // PUT: Actualizar una tarea
        if (req.method === 'PUT') {
            const parsed = taskUpdateSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ message: 'Datos de entrada inválidos' });
            }

            // Verificar propiedad de la tarea
            const [existing] = await pool.query(
                'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
                [taskId, user.id]
            ) as any[];
            if (existing.length === 0) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }

            const updates = parsed.data;
            const fields: string[] = [];
            const values: any[] = [];

            const ALLOWED_FIELDS = new Set(['title', 'description', 'status', 'date', 'time', 'completed', 'urgency']);
            Object.keys(updates).forEach(field => {
                if (ALLOWED_FIELDS.has(field)) {
                    fields.push(`\`${field}\` = ?`);
                    values.push(field === 'completed' ? ((updates as any)[field] ? 1 : 0) : (updates as any)[field]);
                }
            });

            if (fields.length > 0) {
                values.push(taskId);
                values.push(user.id);
                await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
            }

            // Si se actualizan tags
            if (updates.tags && Array.isArray(updates.tags)) {
                await pool.query('DELETE FROM task_tags WHERE task_id = ?', [taskId]);
                for (const tag of updates.tags) {
                    await pool.query('INSERT INTO task_tags (task_id, tag) VALUES (?, ?)', [taskId, tag]);
                }
            }

            return res.status(200).json({ message: 'Tarea actualizada exitosamente' });
        }

        // DELETE: Eliminar una tarea
        if (req.method === 'DELETE') {
            const [result] = await pool.query(
                'DELETE FROM tasks WHERE id = ? AND user_id = ?',
                [taskId, user.id]
            ) as any[];

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }

            return res.status(200).json({ message: 'Tarea eliminada exitosamente' });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error: any) {
        console.error('Task operation error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
