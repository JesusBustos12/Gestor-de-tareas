import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { verifyToken } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { registerSchema, loginSchema, profileUpdateSchema } from '../schemas';

import { AuthRequest } from '../types';

const router = Router();

// Registro de Sesión
router.post('/register', authLimiter, validate(registerSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado en las variables de entorno');
        }

        // Generate token immediately after register to log in
        const token = jwt.sign(
            { id: result.insertId, email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).json({ 
            message: 'Usuario registrado exitosamente',
            user: { id: result.insertId, name, email, theme: 'light', language: 'es' }
        });
    } catch (error) {
        next(error);
    }
});

// Inicio de Sesión
router.post('/login', authLimiter, validate(loginSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            res.status(400).json({ message: 'Credenciales inválidas' });
            return;
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Credenciales inválidas' });
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no está configurado en las variables de entorno');
        }

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 });
        res.json({
            message: 'Autenticación exitosa',
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, theme: user.theme || 'light', language: user.language || 'es' }
        });

    } catch (error) {
        next(error);
    }
});

// Actualizar Perfil
router.put('/profile', verifyToken, validate(profileUpdateSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const { name, avatar } = req.body;

        const fields: string[] = [];
        const values: any[] = [];

        if (name) {
            fields.push('name = ?');
            values.push(name);
        }
        if (avatar !== undefined) {
            fields.push('avatar = ?');
            values.push(avatar || 'https://ui-avatars.com/api/?name=' + (name || 'User'));
        }

        if (fields.length === 0) {
            res.status(400).json({ message: 'No se enviaron campos para actualizar' });
            return;
        }

        values.push(userId);
        await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);

        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        next(error);
    }
});

// Obtener sesión actual
router.get('/me', verifyToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const [users] = await pool.query<RowDataPacket[]>('SELECT id, name, email, avatar, theme, language FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        
        const user = users[0];
        res.json({
            user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, theme: user.theme || 'light', language: user.language || 'es' }
        });
    } catch (error) {
        next(error);
    }
});

// Cerrar sesión
router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada exitosamente' });
});

// Actualizar preferencias (tema e idioma)
router.put('/preferences', verifyToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = (req as AuthRequest).user.id;
        const { theme, language } = req.body;
        
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
        
        if (fields.length > 0) {
            values.push(userId);
            await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        }
        
        res.json({ message: 'Preferencias actualizadas' });
    } catch (error) {
        next(error);
    }
});

export default router;
