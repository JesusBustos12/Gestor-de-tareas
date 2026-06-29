import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { z } from 'zod';

const profileUpdateSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    avatar: z.string().optional().or(z.literal('')),
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
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    const user = verifyVercelToken(req, res);
    if (!user) return; // verifyVercelToken handles the 401 response

    const pool = getPool();
    try {
        const parsed = profileUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Datos de entrada inválidos' });
        }

        const { name, avatar } = parsed.data;
        const fields: string[] = [];
        const values: any[] = [];

        if (name) {
            fields.push('name = ?');
            values.push(name);
        }
        if (avatar !== undefined) {
            fields.push('avatar = ?');
            values.push(avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}`);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'No se enviaron campos para actualizar' });
        }

        values.push(user.id);
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

        return res.status(200).json({ message: 'Perfil actualizado exitosamente' });
    } catch (error: any) {
        console.error('Profile update error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
