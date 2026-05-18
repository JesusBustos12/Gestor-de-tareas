import { useState, useEffect } from 'react';
import { Task, TaskStatus, TagType } from '../types';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { logout, user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchTasks();
        } else {
            setTasks([]);
        }
    }, [isAuthenticated, user]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
                setError(null);
            } else if (res.status === 401) {
                logout();
            } else {
                const data = await res.json();
                setError(data.message || 'Error cargando tareas');
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Error de conexión con el servidor');
        }
    };

    const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        try {
            const res = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task)
            });
            if (res.ok) {
                await fetchTasks(); // Refresh to get the properly formatted task from backend
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        // Optimistic UI Update
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));

        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
        } catch (error) {
            console.error('Error updating task:', error);
            fetchTasks(); // rollback if error
        }
    };

    const deleteTask = async (id: string) => {
        const token = localStorage.getItem('jwt');
        if (!token) return;

        // Optimistic UI Update
        setTasks(prev => prev.filter(task => task.id !== id));

        try {
            await fetch(`${API_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error('Error deleting task:', error);
            fetchTasks(); // rollback if error
        }
    };

    const toggleTaskComplete = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            updateTask(id, { completed: !task.completed });
        }
    };

    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    const getTasksByTag = (tag: TagType) => {
        return tasks.filter(task => task.tags && task.tags.includes(tag));
    };

    const getCompletedTasks = () => {
        return tasks.filter(task => task.completed);
    };

    return {
        tasks,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        getTasksByStatus,
        getTasksByTag,
        getCompletedTasks
    };
}
