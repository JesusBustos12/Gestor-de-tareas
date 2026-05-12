export type Screen = 'login' | 'dashboard' | 'profile';

export type TaskStatus = 'overdue' | 'today' | 'upcoming';
export type TagType = 'urgent' | 'work' | 'personal' | 'finance';
export type Language = 'es' | 'en';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    tags: TagType[];
    date?: string;
    time?: string;
    completed: boolean;
    createdAt: string;

    urgency?: 'normal' | 'high' | 'critical';
}

export type UrgencyLevel = 'normal' | 'high' | 'critical';

export interface User {
    name: string;
    email: string;
    avatar: string;
    role: string;
}

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}