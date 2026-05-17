import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Cargar variables de entorno del archivo .env local en server/
dotenv.config();

async function run() {
  console.log('🚀 Iniciando inicialización de la base de datos en la nube...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Usuario: ${process.env.DB_USER}`);
  console.log(`Base de datos: ${process.env.DB_NAME || 'gestor_tareas'}`);

  // 1. Conexión inicial sin base de datos específica para asegurar su creación
  let initialConnection;
  try {
    initialConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DB_PASS || '',
      ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
        ? { rejectUnauthorized: false }
        : undefined
    });

    console.log('📡 Conexión temporal establecida con el servidor MySQL.');
    await initialConnection.query('CREATE DATABASE IF NOT EXISTS gestor_tareas;');
    console.log('✅ Base de datos "gestor_tareas" asegurada.');
  } catch (error: any) {
    console.error('❌ Error asegurando la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (initialConnection) await initialConnection.end();
  }

  // 2. Conexión principal utilizando el pool de db.ts para ejecutar el esquema de tablas
  let pool;
  try {
    const { default: dbPool } = await import('./db');
    pool = dbPool;

    // Leer el archivo database.sql ubicado en la raíz del proyecto
    const sqlPath = path.join(__dirname, '../database.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`No se encontró el archivo SQL en: ${sqlPath}`);
    }

    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Separar consultas por punto y coma
    const rawQueries = sqlContent.split(';');
    const queriesToExecute: string[] = [];

    for (let query of rawQueries) {
      let cleaned = query
        .split('\n')
        // Eliminar comentarios de línea de SQL
        .filter(line => !line.trim().startsWith('--') && !line.trim().startsWith('#'))
        .join('\n')
        .trim();

      if (!cleaned) continue;

      // Filtrar comandos incompatibles con la nube (creación de usuarios locales y privilegios)
      const isForbidden = 
        cleaned.toUpperCase().startsWith('CREATE USER') ||
        cleaned.toUpperCase().startsWith('GRANT') ||
        cleaned.toUpperCase().startsWith('FLUSH');

      if (isForbidden) {
        console.log(`🔍 Saltando consulta local no compatible: ${cleaned.substring(0, 50)}...`);
        continue;
      }

      queriesToExecute.push(cleaned);
    }

    console.log(`📦 Encontradas ${queriesToExecute.length} consultas compatibles para ejecutar.`);

    for (let i = 0; i < queriesToExecute.length; i++) {
      const q = queriesToExecute[i];
      console.log(`⚙️ Ejecutando consulta ${i + 1}/${queriesToExecute.length}...`);
      await pool.query(q);
    }

    console.log('🎉 ¡Base de datos inicializada correctamente en la nube con todas sus tablas!');
  } catch (error: any) {
    console.error('❌ Error ejecutando las consultas del esquema:', error.message);
  } finally {
    if (pool) {
      await pool.end();
      console.log('🔌 Conexión cerrada.');
    }
    process.exit(0);
  }
}

run();
