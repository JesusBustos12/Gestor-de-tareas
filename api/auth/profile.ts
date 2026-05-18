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

function verifyToken(req: any): { id: number; email: string } | null {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token || !process.env.JWT_SECRET) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET) as { id: number; email: string };
    } catch {
        return null;
    }
}

export default async function handler(req: any, res: any) {
    const allowedOrigin = process.env.FRONTEND_URL || 'https://gestor-de-tareas-henna.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    const user = verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Sesión inválida o expirada' });

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
