# Dossier — Enterprise Task Management System

![Dossier Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

Dossier es una plataforma de gestión de tareas de nivel empresarial diseñada con un enfoque en la seguridad, la robustez y una estética "vintage premium". Este proyecto ha sido sometido a una auditoría de preparación para producción para garantizar los más altos estándares de calidad.

## 🚀 Características Principales

- **Gestión Completa de Tareas**: Crear, editar, eliminar y marcar tareas con persistencia real en base de datos.
- **Seguridad End-to-End**: Autenticación JWT protegida, hashing de contraseñas con bcrypt, protección contra ataques de fuerza bruta (Rate Limiting) y cabeceras de seguridad Helmet.
- **Validación de Datos**: Integración total con **Zod** para asegurar la integridad de la información en cada transacción.
- **Diseño Responsive & UX**: Sidebar tipo "Drawer" en móviles, buscador global, y una interfaz que se adapta a cualquier dispositivo.
- **Internacionalización (i18n)**: Soporte completo para Español e Inglés.
- **Modo Oscuro/Claro**: Sistema de temas con transiciones suaves y estética cohesiva.
- **Accesibilidad (a11y)**: Focus trapping en modales, soporte de tecla Escape y navegación optimizada para teclado.

## 🛠️ Stack Tecnológico

- **Frontend**: React, TypeScript, Tailwind CSS, Context API.
- **Backend**: Node.js, Express, TypeScript.
- **Base de Datos**: MySQL (Pool de conexiones optimizado).
- **Seguridad**: JWT, Bcrypt, Helmet, Rate Limit.
- **Validación**: Zod.

## ⚙️ Configuración del Entorno

### Requisitos Previos
- Node.js (v18+)
- Servidor MySQL

### Configuración del Servidor (.env)
Crea un archivo `server/.env` con las siguientes variables:
```env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_password
DB_NAME=dossier_db
JWT_SECRET=tu_secreto_super_seguro
FRONTEND_URL=http://localhost:5173
```

### Configuración del Cliente (.env.local)
Crea un archivo `.env.local` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
```

## 📦 Instalación y Uso

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Configurar la Base de Datos**:
   Ejecuta el script `database.sql` en tu servidor MySQL para crear las tablas necesarias.

3. **Ejecutar el Proyecto**:
   ```bash
   npm run dev:full
   ```
   *Este comando inicia tanto el servidor backend como el cliente frontend de forma simultánea.*

## 🔒 Auditoría de Seguridad y Calidad

Este proyecto implementa:
- ✅ **Sanitización de Entradas**: Validación estricta con esquemas Zod.
- ✅ **Manejo de Errores Global**: Respuestas estructuradas sin fuga de información sensible.
- ✅ **Protección CSRF/XSS**: Configuración avanzada de Helmet.
- ✅ **Persistencia Confiable**: Sincronización constante entre frontend, localStorage y DB.

---

Desarrollado como parte del Portafolio de Desarrollo Web Senior.
© 2026 Dossier Archive Systems.
