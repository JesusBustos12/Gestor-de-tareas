import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Log del error para debugging interno
    console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.path}:`);
    console.error(err);
    if (err.stack) console.error(err.stack);

    // Errores de validación de Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            error: 'VALIDATION_ERROR',
            message: 'Datos de entrada inválidos',
            details: err.issues.map((e: any) => ({
                path: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // Errores de JWT (Token inválido o expirado)
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'AUTH_ERROR',
            message: 'Sesión inválida o expirada. Por favor, inicie sesión de nuevo.'
        });
    }

    // Error por defecto (500)
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Ocurrió un error interno en el servidor' 
        : err.message || 'Error desconocido';

    res.status(status).json({
        error: err.code || 'SERVER_ERROR',
        message
    });
};
