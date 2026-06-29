import { serialize } from 'cookie';

export default async function handler(req: any, res: any) {
    const allowedOrigin = process.env.FRONTEND_URL || 'https://gestor-de-tareas-henna.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

    // Clear the cookie by setting an expired date
    const cookieStr = serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || process.env.VERCEL === '1',
        sameSite: (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') ? 'none' : 'lax',
        maxAge: -1, // Expire immediately
        path: '/'
    });
    
    res.setHeader('Set-Cookie', cookieStr);
    return res.status(200).json({ message: 'Sesión cerrada exitosamente' });
}
