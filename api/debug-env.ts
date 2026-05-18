export default async function handler(req: any, res: any) {
  const envCheck = {
    DB_HOST: process.env.DB_HOST ? '✅ Configurado' : '❌ NO',
    DB_PORT: process.env.DB_PORT || '❌ NO',
    DB_USER: process.env.DB_USER ? '✅ Configurado' : '❌ NO',
    DB_PASS: process.env.DB_PASS ? '✅ Configurado' : '❌ NO',
    DB_PASSWORD: process.env.DB_PASSWORD ? '✅ Configurado' : '❌ NO',
    DB_NAME: process.env.DB_NAME || '❌ NO',
    JWT_SECRET: process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO',
    VITE_API_URL: process.env.VITE_API_URL || '❌ NO',
    NODE_ENV: process.env.NODE_ENV || 'no definido',
  };

  let expressStatus = '❌ Fallo';
  let expressError = '';
  try {
    const app = await import('../server/server');
    expressStatus = app.default ? '✅ OK' : '⚠️ Sin default';
  } catch (error: any) {
    expressError = error.message + (error.stack ? '\n' + error.stack.split('\n').slice(0, 5).join('\n') : '');
  }

  return res.status(200).json({
    variables: envCheck,
    expressImport: expressStatus,
    expressError: expressError || undefined,
  });
}
