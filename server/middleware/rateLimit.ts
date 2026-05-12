import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 20, // Limitar cada IP a 20 peticiones por ventana para auth
    message: {
        message: 'Demasiados intentos de acceso. Por favor, intente de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const taskLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 100, // 100 peticiones por minuto por IP
    message: {
        message: 'Demasiadas peticiones. Por favor, espere un momento.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
