import { Language } from '../types';

interface Translations {
    [key: string]: {
        es: string;
        en: string;
    };
}

export const translations: Translations = {
    // Header
    'header.myTasks': { es: 'Mis Tareas', en: 'My Tasks' },
    'header.search': { es: 'Buscar...', en: 'Search...' },
    'header.newTask': { es: 'Nueva Tarea', en: 'New Task' },
    'header.logout': { es: 'Cerrar Sesión', en: 'Log Out' },
    'header.toggleTheme': { es: 'Cambiar Tema', en: 'Toggle Theme' },

    // Sidebar
    'sidebar.inbox': { es: 'Bandeja de Entrada', en: 'Inbox' },
    'sidebar.logout': { es: 'Cerrar Sesión', en: 'Log Out' },

    'sidebar.today': { es: 'Hoy', en: 'Today' },
    'sidebar.upcoming': { es: 'Próximo', en: 'Upcoming' },
    'sidebar.completed': { es: 'Completados', en: 'Completed' },
    'sidebar.tags': { es: 'Etiquetas', en: 'Tags' },

    // Task sections
    'tasks.overdue': { es: 'Atrasadas', en: 'Overdue' },
    'tasks.today': { es: 'Hoy', en: 'Today' },
    'tasks.upcoming': { es: 'Próximo', en: 'Upcoming' },
    'tasks.count': { es: 'tareas', en: 'tasks' },
    'tasks.markAsPending': { es: 'Marcar como pendiente', en: 'Mark as pending' },
    'tasks.markAsCompleted': { es: 'Marcar como completada', en: 'Mark as completed' },
    'tasks.hideDetails': { es: 'Ocultar detalles', en: 'Hide details' },
    'tasks.showDetails': { es: 'Mostrar detalles', en: 'Show details' },
    'tasks.edit': { es: 'Editar tarea', en: 'Edit task' },
    'tasks.delete': { es: 'Eliminar tarea', en: 'Delete task' },

    // Tags
    'tag.urgent': { es: 'Urgente', en: 'Urgent' },
    'tag.work': { es: 'Trabajo', en: 'Work' },
    'tag.personal': { es: 'Personal', en: 'Personal' },
    'tag.finance': { es: 'Finanzas', en: 'Finance' },

    // Sidebar - Urgency
    'sidebar.urgency': { es: 'Nivel de Urgencia', en: 'Urgency Level' },
    'urgency.normal': { es: 'Normal', en: 'Normal' },
    'urgency.high': { es: 'Alta', en: 'High' },
    'urgency.critical': { es: 'Crítica', en: 'Critical' },

    // Login Screen
    'login.title': { es: 'Portal de Espacio de Trabajo', en: 'Workspace Portal' },
    'login.subtitle': { es: 'ACCESO CORPORATIVO', en: 'CORPORATE LOGIN' },
    'login.username': { es: 'Correo electrónico corporativo', en: 'Corporate Email' },
    'login.usernamePlaceholder': { es: 'tu@empresa.com', en: 'you@company.com' },
    'login.password': { es: 'Contraseña de Acceso', en: 'Password' },
    'login.passwordPlaceholder': { es: '••••••••', en: '••••••••' },
    'login.authenticate': { es: 'Autenticar', en: 'Authenticate' },
    'login.rememberMe': { es: 'Mantener sesión activa', en: 'Keep session active' },
    'login.forgotPassword': { es: '¿Olvidaste tus credenciales?', en: 'Lost credentials?' },
    'login.confidential': { es: 'Datos Encriptados de Nivel Empresarial', en: 'Enterprise-Grade Encrypted Data' },
    'login.authorizedOnly': { es: 'Herramienta exclusiva para equipos de alto rendimiento', en: 'Exclusive tool for high-performance teams' },
    'login.systemVersion': { es: 'Dossier OS v2.4', en: 'Dossier OS v2.4' },
    'login.stampText': { es: 'Acceso\nSeguro\nB2B', en: 'Secure\nB2B\nAccess' },
    'login.profilePhoto': { es: 'Foto de Perfil Profesional', en: 'Professional Profile Photo' },
    'login.imageUrl': { es: 'URL de imagen', en: 'Image URL' },
    'login.uploadFile': { es: 'Subir archivo', en: 'Upload File' },
    'login.or': { es: 'o', en: 'or' },

    // Modal - Create/Edit Task
    'modal.createTask': { es: 'Crear Nueva Tarea', en: 'Create New Task' },
    'modal.editTask': { es: 'Editar Tarea', en: 'Edit Task' },
    'modal.fillDetails': { es: 'Completa los detalles a continuación para asignar una nueva tarea al equipo.', en: 'Fill in the details below to assign a new task.' },
    'modal.editDetails': { es: 'Modifica los detalles de la tarea.', en: 'Modify the task details.' },
    'modal.taskTitle': { es: 'TÍTULO DE LA TAREA', en: 'TASK TITLE' },
    'modal.taskTitlePlaceholder': { es: 'ej., Análisis de Informe Financiero Q4', en: 'e.g., Q4 Financial Report Analysis' },
    'modal.classification': { es: 'CLASIFICACIÓN', en: 'CLASSIFICATION' },
    'modal.deadline': { es: 'FECHA LÍMITE', en: 'DEADLINE' },
    'modal.description': { es: 'DESCRIPCIÓN / NOTAS', en: 'BRIEF / DESCRIPTION' },
    'modal.descriptionPlaceholder': { es: 'Ingresa especificaciones detalladas aquí...', en: 'Enter detailed specifications here...' },
    'modal.urgencyLevel': { es: 'NIVEL DE URGENCIA', en: 'URGENCY LEVEL' },
    'modal.urgencyNormal': { es: 'Normal', en: 'Normal' },
    'modal.urgencyHigh': { es: 'Alta', en: 'High' },
    'modal.urgencyCritical': { es: 'Crítica', en: 'Critical' },
    'modal.cancel': { es: 'Cancelar', en: 'Cancel' },
    'modal.confirm': { es: 'CONFIRMAR', en: 'CONFIRM' },
    'modal.save': { es: 'GUARDAR', en: 'SAVE' },
    'modal.project': { es: 'Proyecto: Alpha', en: 'Project: Alpha' },
    'modal.currentStatus': { es: 'Estado Actual', en: 'Current Status' },
    'modal.draftMode': { es: 'Modo Borrador', en: 'Draft Mode' },
    'modal.editMode': { es: 'Modo Edición', en: 'Edit Mode' },
    'modal.createdBy': { es: 'Creado por', en: 'Created by' },
    'modal.date': { es: 'Fecha', en: 'Date' },
    'modal.language': { es: 'Idioma', en: 'Language' },
    'modal.approvedStamp': { es: 'Aprobado\nPara\nDev', en: 'Approved\nFor\nDev' },

    // Categories
    'category.internalOps': { es: 'Operaciones Internas', en: 'Internal Operations' },
    'category.clientRequest': { es: 'Solicitud de Cliente', en: 'Client Request' },
    'category.highPriority': { es: 'Alta Prioridad', en: 'High Priority' },
    'category.research': { es: 'Investigación', en: 'Research' },

    // Delete Modal
    'delete.title': { es: '¿Eliminar Tarea?', en: 'Delete Task?' },
    'delete.message': { es: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.', en: 'Are you sure you want to delete this task? This action cannot be undone.' },
    'delete.taskName': { es: 'Tarea', en: 'Task' },
    'delete.confirm': { es: 'ELIMINAR', en: 'DELETE' },
    'delete.cancel': { es: 'Cancelar', en: 'Cancel' },

    // Profile Screen
    'profile.userLabel': { es: 'Usuario', en: 'User' },
    'profile.identificationPhoto': { es: 'Foto de\nPerfil', en: 'Profile\nPhoto' },
    'profile.personnelRecord': { es: 'Ficha de Colaborador', en: 'Team Member Profile' },
    'profile.subtitle': { es: 'Por favor, asegúrese de que sus datos corporativos estén actualizados.', en: 'Please ensure all corporate data is current.' },
    'profile.fullName': { es: 'Nombre Completo', en: 'Full Name' },
    'profile.fullNamePlaceholder': { es: 'Ingrese su nombre completo', en: 'Enter your full name' },
    'profile.email': { es: 'Correo Electrónico', en: 'Email Address' },
    'profile.emailPlaceholder': { es: 'Ingrese su correo corporativo', en: 'Enter your corporate email' },
    'profile.biographicalNotes': { es: 'Rol / Cargo Profesional', en: 'Role / Job Title' },
    'profile.biographicalNotesPlaceholder': { es: 'Ej. Operations Manager...', en: 'e.g. Operations Manager...' },
    'profile.confidentialityLevel': { es: 'CONTROL DE ACCESO Y AUDITORÍA ACTIVOS', en: 'WORKSPACE ACCESS CONTROL AUDIT ACTIVE' },
    'profile.updateRecord': { es: 'Actualizar Registro', en: 'Update Record' },
    'profile.successMessage': { es: 'Perfil actualizado con éxito', en: 'Profile updated successfully' },
    'profile.emailNote': { es: '* El correo electrónico es un identificador único y no puede ser modificado.', en: '* Email address is a unique identifier and cannot be modified.' },

    // Quote
    'quote.text': { es: '"La eficiencia no es hacer las cosas bien, es hacer las cosas correctas."', en: '"Efficiency is doing things right; effectiveness is doing the right things."' },
    'quote.author': { es: 'Peter Drucker', en: 'Peter Drucker' },

    // Empty States
    'empty.noResults': { es: 'No se encontraron tareas que coincidan con la búsqueda', en: 'No tasks found matching your search' },
    'empty.noTasks': { es: 'No hay tareas aún', en: 'No tasks yet' },
    'empty.inbox': { es: 'No tienes tareas pendientes en tu bandeja', en: 'You have no pending tasks in your inbox' },
    'empty.today': { es: 'No hay tareas programadas para hoy', en: 'No tasks scheduled for today' },
    'empty.upcoming': { es: 'No tienes tareas próximas programadas', en: 'You have no upcoming tasks scheduled' },
    'empty.completed': { es: 'Aún no has completado ninguna tarea', en: 'You haven\'t completed any tasks yet' },
    'empty.urgent': { es: 'No hay tareas marcadas como urgentes', en: 'No tasks marked as urgent' },
    'empty.work': { es: 'No hay tareas en la categoría de trabajo', en: 'No tasks in the work category' },
    'empty.personal': { es: 'No hay tareas personales registradas', en: 'No personal tasks recorded' },
    'empty.finance': { es: 'No hay tareas de finanzas pendientes', en: 'No pending finance tasks' },
    'empty.urgency-normal': { es: 'No hay tareas de prioridad normal', en: 'No normal priority tasks' },
    'empty.urgency-high': { es: 'No hay tareas de alta prioridad', en: 'No high priority tasks' },
    'empty.urgency-critical': { es: 'No hay tareas críticas pendientes', en: 'No critical tasks pending' },

    // Login - Registration
    'login.createAccount': { es: 'Crear Cuenta', en: 'Create Account' },
    'login.joinTeam': { es: 'Únete al equipo', en: 'Join the team' },
    'login.fullName': { es: 'Nombre Completo', en: 'Full Name' },
    'login.fullNamePlaceholder': { es: 'Tu nombre', en: 'Your name' },
    'login.register': { es: 'Registrarse', en: 'Register' },
    'login.alreadyHaveAccount': { es: '¿Ya tienes cuenta?', en: 'Already have an account?' },
    'login.noAccount': { es: '¿No tienes cuenta?', en: "Don't have an account?" },
    'login.loginHere': { es: 'Iniciar Sesión', en: 'Login Here' },
    'login.registerNow': { es: 'Registrarse Ahora', en: 'Register Now' },

    // Login - Error messages
    'login.error.allFieldsRequired': { es: 'Todos los campos son obligatorios', en: 'All fields are required' },
    'login.error.emailRegistered': { es: 'El correo ya está registrado o hubo un error', en: 'Email already registered or error occurred' },
    'login.error.enterCredentials': { es: 'Ingrese correo y contraseña', en: 'Enter email and password' },
    'login.error.invalidCredentials': { es: 'Credenciales inválidas', en: 'Invalid credentials' },

    // Login - Success modal
    'login.success.title': { es: '¡Registro Exitoso!', en: 'Registration Successful!' },
    'login.success.message': { es: 'Tu cuenta ha sido creada correctamente.', en: 'Your account has been created successfully.' },
    'login.success.button': { es: 'Ir al Dashboard', en: 'Go to Dashboard' },

    // Profile - Success modal
    'profile.success.button': { es: 'Entendido', en: 'Got it' }
};

export function getTranslation(key: string, language: Language): string {
    const translation = translations[key];
    if (!translation) {
        console.warn(`Translation key "${key}" not found`);
        return key;
    }
    return translation[language] || key;
}
