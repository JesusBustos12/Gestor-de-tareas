import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { z } from 'zod';

const taskSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(1000).optional().nullable(),
    status: z.enum(['overdue', 'today', 'upcoming']).default('today'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable().or(z.literal('')),
    time: z.string().optional().nullable().or(z.literal('')),
    urgency: z.enum(['normal', 'high', 'critical']).default('normal'),
    tags: z.array(z.enum(['urgent', 'work', 'personal', 'finance'])).optional(),
});

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const user = verifyVercelToken(req, res);
    if (!user) return; // verifyVercelToken handles the 401 response

    const pool = getPool();
    try {
        // GET: Obtener todas las tareas del usuario
        if (req.method === 'GET') {
            const [tasks] = await pool.query(
                'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
                [user.id]
            ) as any[];

            const [tags] = await pool.query(
                'SELECT task_id, tag FROM task_tags WHERE task_id IN (SELECT id FROM tasks WHERE user_id = ?)',
                [user.id]
            ) as any[];

            const formattedTasks = tasks.map((task: any) => {
                const taskTags = tags.filter((t: any) => t.task_id === task.id).map((t: any) => t.tag);
                return { ...task, tags: taskTags, completed: !!task.completed };
            });

            return res.status(200).json(formattedTasks);
        }

        // POST: Crear una nueva tarea
        if (req.method === 'POST') {
            const parsed = taskSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    message: 'Datos de entrada inválidos',
                    details: parsed.error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
                });
            }

            const { title, description, status, date, time, urgency, tags } = parsed.data;

            const [result] = await pool.query(
                `INSERT INTO tasks (user_id, title, description, status, date, time, urgency) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user.id, title, description || null, status || 'today', date || null, time || null, urgency || 'normal']
            ) as any[];

            const newTaskId = result.insertId;

            if (tags && Array.isArray(tags)) {
                for (const tag of tags) {
                    await pool.query('INSERT INTO task_tags (task_id, tag) VALUES (?, ?)', [newTaskId, tag]);
                }
            }

            return res.status(201).json({ message: 'Tarea creada exitosamente', id: newTaskId });
        }

        return res.status(405).json({ message: 'Method not allowed' });
    } catch (error: any) {
        console.error('Tasks error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
