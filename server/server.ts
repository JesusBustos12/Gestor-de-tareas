import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { authLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:3000', 
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
            callback(null, true);
        } else {
            callback(new Error('CORS origin not allowed'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Dossier API running smoothly' });
});

// Centralized Error Handler (debe ser el último middleware)
app.use(errorHandler);

// Database Initialization
const initDB = async () => {
    try {
        const pool = (await import('./db')).default;
        
        try {
            await pool.query('ALTER TABLE users MODIFY COLUMN avatar LONGTEXT;');
            console.log('✅ Base de datos verificada: Columna avatar optimizada para imágenes.');
        } catch (e) {}

        try {
            await pool.query("ALTER TABLE users ADD COLUMN theme VARCHAR(20) DEFAULT 'light';");
            await pool.query("ALTER TABLE users ADD COLUMN language VARCHAR(20) DEFAULT 'es';");
            console.log('✅ Base de datos verificada: Columnas theme y language añadidas a users.');
        } catch (e) {
            // Ignorar el error si las columnas ya existen
        }
    } catch (error) {
        console.error('⚠️ Error general inicializando la base de datos:', error);
    }
};

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, async () => {
        console.log(`✅ Servidor backend ejecutándose en http://localhost:${PORT}`);
        await initDB();
    });
}

export default app;
