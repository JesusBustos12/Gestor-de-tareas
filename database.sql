-- Script para MySQL Workbench
-- Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS gestor_tareas;

-- Creación de un usuario dedicado para este proyecto
-- Por seguridad, es mejor usar este usuario en lugar de root
-- NOTA: Reemplazar 'TU_CONTRASENA_SEGURA' con una contraseña real y segura antes de ejecutar este script.
CREATE USER IF NOT EXISTS 'dossier_admin'@'localhost' IDENTIFIED BY 'TU_CONTRASENA_SEGURA';
GRANT ALL PRIVILEGES ON gestor_tareas.* TO 'dossier_admin'@'localhost';
FLUSH PRIVILEGES;

USE gestor_tareas;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'https://ui-avatars.com/api/?name=User',
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tareas
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('overdue', 'today', 'upcoming') DEFAULT 'today',
    date VARCHAR(255),
    time VARCHAR(255),
    completed BOOLEAN DEFAULT false,
    urgency ENUM('normal', 'high', 'critical') DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para etiquetas de Tareas (Relación Muchos a Muchos o 1 a N si guardamos nombres de tags por tarea)
-- Para simplicidad de este sistema migrado, la tabla task_tags relacionara un string tag con el task_id
CREATE TABLE IF NOT EXISTS task_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    tag ENUM('urgent', 'work', 'personal', 'finance') NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
