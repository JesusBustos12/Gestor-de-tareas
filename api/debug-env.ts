import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const envCheck = {
    DB_HOST: process.env.DB_HOST ? '✅ Configurado' : '❌ NO encontrado',
    DB_PORT: process.env.DB_PORT || '❌ NO encontrado',
    DB_USER: process.env.DB_USER ? '✅ Configurado' : '❌ NO encontrado',
    DB_PASS: process.env.DB_PASS ? '✅ Configurado' : '❌ NO encontrado',
    DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Configurado' : '❌ NO encontrado',
    DB_NAME: process.env.DB_NAME || '❌ NO encontrado',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO encontrado',
    VITE_API_URL: process.env.VITE_API_URL || '❌ NO encontrado',
    NODE_ENV: process.env.NODE_ENV || 'no definido',
  };

  // Probar si la app de Express se puede importar
  let expressStatus = '❌ Fallo';
  let expressError = '';
  try {
    const app = await import('../server/server');
    expressStatus = app.default ? '✅ Importación exitosa' : '⚠️ Importado pero sin export default';
  } catch (error: any) {
    expressError = error.message;
  }

  return res.status(200).json({
    variables: envCheck,
    expressImport: expressStatus,
    expressError: expressError || undefined,
    timestamp: new Date().toISOString()
  });
}
