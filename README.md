# Dossier — Enterprise Task Management System

## Descripción
**Dossier** es una plataforma de gestión de tareas de nivel empresarial diseñada con un enfoque en la seguridad, la robustez y una estética "vintage premium". Este proyecto ha sido sometido a una auditoría de preparación para producción para garantizar los más altos estándares de calidad.

El proyecto cuenta con un sistema completo de autenticación de usuarios y una interfaz moderna y responsiva. Fue diseñado siguiendo un enfoque full-stack, integrando un frontend interactivo en React con un backend seguro en Node.js + Express, y persistencia en una base de datos relacional MySQL.
>>>>>>> edc2a84 (Actualizacion del README)

Perfecto para demostrar habilidades full-stack reales en un portafolio profesional.

## Objetivo
Como desarrollador autodidacta, creé este proyecto para:

- Mostrar dominio completo de **Node.js + Express** en el backend.
- Implementar una base de datos relacional con **MySQL** para el almacenamiento de usuarios e historial de tareas.
- Desarrollar un sistema de autenticación seguro utilizando **JWT (JSON Web Tokens)** y hashing de contraseñas con **bcrypt**.
- Crear una interfaz interactiva y dinámica utilizando **React** y **Tailwind CSS**.
- Aplicar buenas prácticas de seguridad: Headers seguros con **Helmet**, limitación de peticiones con **Rate Limiting** y gestión de variables de entorno.
- Validar la integridad de los datos utilizando **Zod**.
- Demostrar habilidades de internacionalización (i18n) y accesibilidad (a11y).

## Características
- **Gestión Completa de Tareas**: Crear, editar, eliminar y marcar tareas con persistencia real en base de datos.
- **Autenticación Segura**: Registro e inicio de sesión de usuarios con tokens JWT.
- **Diseño Moderno y Responsive**: Sidebar tipo "Drawer" en móviles, buscador global, y una interfaz que se adapta a cualquier dispositivo.
- **Internacionalización (i18n)**: Soporte completo para Español e Inglés.
- **Modo Oscuro/Claro**: Sistema de temas con transiciones suaves y estética cohesiva.
- **Seguridad Robusta**: Implementación de Helmet, Rate Limiting para evitar ataques de fuerza bruta y CORS restringido.
- **Validación de Datos**: Integración total con **Zod** para asegurar la integridad de la información en cada transacción.
- **Accesibilidad (a11y)**: Focus trapping en modales, soporte de tecla Escape y navegación optimizada para teclado.

## Tecnologías utilizadas
- **Backend**: Node.js + Express (con TypeScript).
- **Base de Datos**: MySQL (manejado con pool de conexiones optimizado).
- **Frontend**: React, TypeScript, Tailwind CSS, Context API.
- **Seguridad**: JWT, bcrypt, Helmet, Express-rate-limit.
- **Validación**: Zod.
- **Vercel**: Configuración lista para despliegue en Vercel.

## Estructura del proyecto
```text
Gestor de tareas/
├── App.tsx                   # Componente principal de React
├── index.html                # Punto de entrada HTML
├── index.tsx                 # Punto de entrada de React
├── package.json              # Scripts y dependencias del proyecto
├── database.sql              # Script de inicialización de la base de datos
├── vercel.json               # Configuración para despliegue en Vercel
├── api/                      # Funciones serverless para Vercel
│   └── index.ts              # Punto de entrada de la API en Vercel
├── components/               # Componentes reutilizables de React
├── context/                  # Contextos de React (Estado global)
├── hooks/                    # Hooks personalizados
├── i18n/                     # Configuración de internacionalización
├── screens/                  # Pantallas/Vistas de la aplicación
└── server/                   # Código del servidor (Backend local)
    ├── server.ts             # Punto de entrada del servidor Express
    ├── db.ts                 # Conexión a la base de datos
    ├── routes/               # Endpoints de API
    ├── middleware/          # Middlewares de seguridad y validación
    └── schemas/             # Esquemas de validación Zod
```

## Auditoría de Seguridad y Calidad
Este proyecto implementa:
- ✅ **Sanitización de Entradas**: Validación estricta con esquemas Zod.
- ✅ **Manejo de Errores Global**: Respuestas estructuradas sin fuga de información sensible.
- ✅ **Protección CSRF/XSS**: Configuración avanzada de Helmet.
- ✅ **Persistencia Confiable**: Sincronización constante entre frontend, localStorage y DB.

## Habilidades demostradas
Este proyecto refleja competencias reales de un Junior Full-Stack listo para aportar valor:

- **Backend sólido**: Rutas seguras, manejo de errores estructurado, conexión a base de datos y validación estricta con Zod.
- **Seguridad y buenas prácticas**: Uso de JWT, hashing de contraseñas, protección contra ataques comunes y cabeceras seguras.
- **Frontend limpio y avanzado**: Gestión de estado con Context API, diseño responsivo con Tailwind CSS, soporte para múltiples idiomas y temas, y accesibilidad.
- **DevOps Inicial**: Configuración para despliegue en Vercel.

## Demo en vivo
*(Próximamente disponible / Enlace a desplegar)*

## Notas para empleadores y Clientes
Este proyecto demuestra mi capacidad para construir una aplicación completa desde cero, preocupándome tanto por la seguridad y la infraestructura en el backend como por la usabilidad, el diseño y la accesibilidad en el frontend.

Estoy 100% listo para aportar valor real en un equipo como **Junior Full-Stack Developer**.

---

## Contacto
- **GitHub**: [github.com/JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn**: [linkedin.com/in/jesus-bustos-arizmendi-325329283](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo**: jesusbustosarizmendi0@gmail.com
- **Celular/WhatsApp**: +52 762 119 2732

¡Gracias por revisar mi trabajo! 🚀
