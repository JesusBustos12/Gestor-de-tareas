import { parse } from 'cookie';
import jwt from 'jsonwebtoken';

export function verifyVercelToken(req: any, res: any): any | null {
    const cookiesHeader = req.headers.cookie;
    if (!cookiesHeader) {
        res.status(401).json({ message: 'Acceso denegado: Token no proveído.' });
        return null;
    }

    const cookies = parse(cookiesHeader);
    const token = cookies.token;

    if (!token) {
        res.status(401).json({ message: 'Acceso denegado: Token no proveído.' });
        return null;
    }

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no configurado');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Acceso denegado: Token expirado.' });
        } else {
            res.status(401).json({ message: 'Acceso denegado: Token inválido.' });
        }
        return null;
    }
}
