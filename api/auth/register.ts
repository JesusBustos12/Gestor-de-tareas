import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(255),
    password: z.string().min(8).max(128),
    avatar: z.string().optional().or(z.literal('')),
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
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: 'Datos de entrada inválidos',
                details: parsed.error.issues.map((e: any) => ({ path: e.path.join('.'), message: e.message }))
            });
        }

        const { name, email, password, avatar } = parsed.data;

        // Verificar si el usuario ya existe
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]) as any[];
        if (existing.length > 0) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determinar avatar: ahora que la columna es LONGTEXT, se puede guardar tanto URL como base64
        let avatarUrl = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, avatarUrl]
        ) as any[];

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado');
        }

        const token = jwt.sign(
            { id: result.insertId, email },
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

        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: { id: result.insertId, name, email, avatar: avatarUrl, theme: 'light', language: 'es' }
        });
    } catch (error: any) {
        console.error('Register error:', error.message);
        return res.status(500).json({ message: 'Error en el servidor', details: error.message });
    } finally {
        await pool.end();
    }
}
