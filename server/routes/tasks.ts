import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { verifyToken } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { taskSchema, taskUpdateSchema } from '../schemas';
import { AuthRequest } from '../types';

const router = Router();

// Apply auth middleware to all task routes
router.use(verifyToken);

// GET: All tasks for the current user
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        
        // Obtenemos tareas
        const [tasks] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', 
            [userId]
        );

        // Obtenemos tags (Para simplicidad, hacemos otra consula o agrupamos. Aquí agruparemos por query)
        const [tags] = await pool.query<RowDataPacket[]>(
            'SELECT task_id, tag FROM task_tags WHERE task_id IN (SELECT id FROM tasks WHERE user_id = ?)', 
            [userId]
        );

        // Formatear la respuesta para coincidir con la interfaz de Frontend
        const formattedTasks = tasks.map((task: any) => {
            const taskTags = tags.filter((t: any) => t.task_id === task.id).map((t: any) => t.tag);
            return {
                ...task,
                tags: taskTags,
                completed: !!task.completed // Convierte a boolean
            };
        });

        res.json(formattedTasks);
    } catch (error) {
        next(error);
    }
});

// POST: Create a new task
router.post('/', validate(taskSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const { title, description, status, date, time, urgency, tags } = req.body;

        const [result] = await pool.query<ResultSetHeader>(
            `INSERT INTO tasks (user_id, title, description, status, date, time, urgency) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userId, title, description || null, status || 'today', date || null, time || null, urgency || 'normal']
        );

        const newTaskId = result.insertId;

        // Si mandamos tags, las insertamos
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                await pool.query('INSERT INTO task_tags (task_id, tag) VALUES (?, ?)', [newTaskId, tag]);
            }
        }

        res.status(201).json({ 
            message: 'Tarea creada exitosamente', 
            id: newTaskId 
        });
    } catch (error) {
        next(error);
    }
});

// PUT: Update a task
router.put('/:id', validate(taskUpdateSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const taskId = parseInt(req.params.id as string, 10);
        if (isNaN(taskId)) {
            res.status(400).json({ message: 'ID de tarea inválido' });
            return;
        }
        const updates = req.body;

        // Check ownership
        const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
        if (existing.length === 0) {
            res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
            return;
        }

        // Simplificación: Para no hacer un query dinamico muy complejo rápido, 
        // actualizamos campo por campo presente en updates
        const fields: string[] = [];
        const values: any[] = [];
        
        const ALLOWED_FIELDS = new Set(['title', 'description', 'status', 'date', 'time', 'completed', 'urgency']);
        Object.keys(updates).forEach(field => {
            if (ALLOWED_FIELDS.has(field)) {
                fields.push(`\`${field}\` = ?`);
                values.push(field === 'completed' ? (updates[field] ? 1 : 0) : updates[field]); // handle boolean
            }
        });

        if (fields.length > 0) {
            values.push(taskId); // for WHERE id = ?
            values.push(userId); // for AND user_id = ?
            await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`, values);
        }

        // Si se actualizan tags
        if (updates.tags && Array.isArray(updates.tags)) {
            await pool.query('DELETE FROM task_tags WHERE task_id = ?', [taskId]);
            for (const tag of updates.tags) {
                await pool.query('INSERT INTO task_tags (task_id, tag) VALUES (?, ?)', [taskId, tag]);
            }
        }

        res.json({ message: 'Tarea actualizada exitosamente' });
    } catch (error) {
        next(error);
    }
});

// DELETE: Remove a task
router.delete('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const taskId = parseInt(req.params.id as string, 10);
        if (isNaN(taskId)) {
            res.status(400).json({ message: 'ID de tarea inválido' });
            return;
        }

        const [result] = await pool.query<ResultSetHeader>('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Tarea no encontrada' });
            return;
        }

        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        next(error);
    }
});

export default router;
