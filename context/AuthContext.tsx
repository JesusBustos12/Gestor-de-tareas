import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string, avatar?: string) => Promise<boolean>;
    updateUser: (user: Partial<User>) => Promise<boolean>;
    logout: () => void;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const clearError = () => setError(null);

    // Initial load: fetch session from backend cookie
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    credentials: 'include'
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (e) {
                console.error('Error checking session', e);
            } finally {
                setIsLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await res.json();
            
            if (res.ok) {
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
                body: JSON.stringify({ name, email, password, avatar }),
                credentials: 'include'
            });
            const data = await res.json();
            
            if (res.ok) {
                // Return true to trigger the success modal in Login.tsx
                // The user will then manually log in, which sets the user state.
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

    const updateUser = async (updatedUser: Partial<User>): Promise<boolean> => {
        if (!user) return false;
        
        try {
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser),
                credentials: 'include'
            });

            if (res.ok) {
                const newUserData = { ...user, ...updatedUser } as User;
                setUser(newUserData);
                setError(null);
                return true;
            } else if (res.status === 401) {
                logout();
                return false;
            } else {
                const data = await res.json();
                setError(data.message || 'Error actualizando perfil');
                return false;
            }
        } catch (error) {
            console.error('Update user error:', error);
            setError('Error de conexión con el servidor');
            return false;
        }
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser, error, clearError }}>
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
