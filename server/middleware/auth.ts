import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { AuthRequest } from '../types';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proveído.' });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: 'Error de configuración del servidor: Clave de seguridad no encontrada.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    (req as any).user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Sesión expirada o token inválido. Por favor, inicie sesión de nuevo.' });
  }
};
