import React, { createContext, useContext, ReactNode } from 'react';
import { Language, LanguageContextType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTranslation } from '../i18n/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useLocalStorage<Language>('language', 'es');

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
