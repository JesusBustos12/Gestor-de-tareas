import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Language, LanguageContextType } from '../types';
import { getTranslation } from '../i18n/translations';
import { useAuth } from './AuthContext';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [language, setLocalLanguage] = useState<Language>('es');

    useEffect(() => {
        if (user && user.language) {
            setLocalLanguage(user.language as Language);
        }
    }, [user]);

    const setLanguage = async (newLang: Language) => {
        setLocalLanguage(newLang);
        if (user) {
            try {
                await fetch(`${API_URL}/auth/preferences`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ language: newLang }),
                    credentials: 'include'
                });
            } catch(e) {
                console.error('Failed to save language in cloud', e);
            }
        }
    };

    const t = (key: string): string => {
        return getTranslation(key, language);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
