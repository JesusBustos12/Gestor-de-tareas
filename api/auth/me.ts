import mysql from 'mysql2/promise';
import { verifyVercelToken } from '../utils/auth.js';

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

export default async function handler(req: any, res: any) {
    const allowedOrigin = process.env.FRONTEND_URL || 'https://gestor-de-tareas-henna.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

    const decoded = verifyVercelToken(req, res);
    if (!decoded) return; // verifyVercelToken already sends the 401 response

    const pool = getPool();
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, avatar, theme, language FROM users WHERE id = ?',
            [decoded.id]
        ) as any[];

        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        return res.status(200).json({
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                avatar: user.avatar, 
                theme: user.theme || 'light', 
                language: user.language || 'es' 
            }
        });
    } catch (error: any) {
        console.error('Me error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
