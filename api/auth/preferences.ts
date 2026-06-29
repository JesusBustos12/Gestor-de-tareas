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
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

    const decoded = verifyVercelToken(req, res);
    if (!decoded) return;

    const { theme, language } = req.body || {};
    
    const fields: string[] = [];
    const values: any[] = [];
    
    if (theme) {
        fields.push('theme = ?');
        values.push(theme);
    }
    if (language) {
        fields.push('language = ?');
        values.push(language);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No se enviaron preferencias para actualizar' });
    }
    
    values.push(decoded.id);

    const pool = getPool();
    try {
        await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return res.status(200).json({ message: 'Preferencias actualizadas' });
    } catch (error: any) {
        console.error('Preferences error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
