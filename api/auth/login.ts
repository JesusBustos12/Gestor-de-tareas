import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
import cookiePkg from 'cookie';
const serialize = cookiePkg.serialize;

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
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    const pool = getPool();
    try {
        // Validación con Zod
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: 'Datos de entrada inválidos' });
        }

        const { email, password } = parsed.data;

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as any[];
        if (users.length === 0) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        const cookieStr = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
            sameSite: (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') ? 'none' : 'lax',
            maxAge: 24 * 60 * 60,
            path: '/'
        });
        res.setHeader('Set-Cookie', cookieStr);

        return res.status(200).json({
            message: 'Autenticación exitosa',
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, theme: user.theme || 'light', language: user.language || 'es' }
        });
    } catch (error: any) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
