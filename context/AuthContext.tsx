import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, avatar?: string) => Promise<boolean>;
    updateUser: (user: Partial<User>) => void;
    logout: () => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const clearError = () => setError(null);

    // Initial load: check if token exists
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const storedUser = localStorage.getItem('currentUser');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user');
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                setUser(data.user);
                setError(null);
                return true;
            }
            setError(data.message || 'Error en la autenticación');
            return false;
        } catch (error) {
            console.error('Login error:', error);
            setError('No se pudo conectar con el servidor');
            return false;
        }
    };

    const register = async (name: string, email: string, password: string, avatar?: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, avatar })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('jwt', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                setUser(data.user);
                setError(null);
                return true;
            }
            setError(data.message || 'Error en el registro');
            return false;
        } catch (error) {
            console.error('Register error:', error);
            setError('No se pudo conectar con el servidor');
            return false;
        }
    };

    const updateUser = async (updatedUser: Partial<User>) => {
        if (!user) return;
        
        try {
            const token = localStorage.getItem('jwt');
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (res.ok) {
                const newUserData = { ...user, ...updatedUser } as User;
                setUser(newUserData);
                localStorage.setItem('currentUser', JSON.stringify(newUserData));
                setError(null);
            } else if (res.status === 401) {
                logout();
            } else {
                const data = await res.json();
                setError(data.message || 'Error actualizando perfil');
            }
        } catch (error) {
            console.error('Update user error:', error);
            setError('Error de conexión con el servidor');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwt');
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser, error, clearError }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};
