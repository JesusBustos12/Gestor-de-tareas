import React, { useState, useEffect } from 'react';
import { Screen, Task } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Profile from './screens/Profile';
import NewTaskModal from './components/NewTaskModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTasks } from './hooks/useTasks';

const AppContent: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('login');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);
    const [activeTab, setActiveTab] = useState('inbox');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
    const { user, isAuthenticated } = useAuth();
    const { theme } = useTheme();
    const { language } = useLanguage();

    useEffect(() => {
        if (isAuthenticated) {
            if (currentScreen === 'login') {
                setCurrentScreen('dashboard');
            }
        } else {
            setCurrentScreen('login');
        }
    }, [isAuthenticated]);

    const handleNavigate = (screen: Screen) => {
        setCurrentScreen(screen);
        setIsSidebarOpen(false); // Cierra el sidebar al navegar en mobile
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenNewTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = (task: Task) => {
        setDeletingTask(task);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingTask) {
            deleteTask(deletingTask.id);
            setDeletingTask(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
        if (editingTask) {
            updateTask(editingTask.id, taskData);
        } else {
            addTask(taskData);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    };

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className={`flex flex-1 h-screen overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark text-stone-200' : 'bg-background-light text-stone-900'}`}>
            {/* Skip Navigation Link for Accessibility */}
            <a 
                href="#main-content" 
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
            >
                {language === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
            </a>

            {/* Global Texture Overlay */}
            <div className={`paper-texture ${theme === 'dark' ? 'opacity-5' : 'opacity-100'}`}></div>
            <div className={`aged-overlay ${theme === 'dark' ? 'opacity-5' : 'opacity-100'}`}></div>

            <Sidebar
                currentScreen={currentScreen}
                onNavigate={handleNavigate}
                user={user!}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tasks={tasks}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main id="main-content" className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10 focus:outline-none" tabIndex={-1}>
                {currentScreen === 'dashboard' && (
                    <Dashboard
                        tasks={tasks}
                        onOpenNewTask={handleOpenNewTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onToggleComplete={toggleTaskComplete}
                        activeTab={activeTab}
                        onToggleSidebar={toggleSidebar}
                    />
                )}
                {currentScreen === 'profile' && (
                    <Profile user={user!} onBack={() => setCurrentScreen('dashboard')} />
                )}
            </main>

            <NewTaskModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
                onSave={handleSaveTask}
                task={editingTask}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => { setIsDeleteModalOpen(false); setDeletingTask(null); }}
                onConfirm={handleConfirmDelete}
                taskTitle={deletingTask?.title || ''}
            />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthProvider>
                <ThemeProvider>
                    <AppContent />
                </ThemeProvider>
            </AuthProvider>
        </LanguageProvider>
    );
};

export default App;