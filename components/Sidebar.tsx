import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Screen, User, Task } from '../types';

interface SidebarProps {
    currentScreen: Screen;
    onNavigate: (screen: Screen) => void;
    user: User;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tasks: Task[];
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    currentScreen, 
    onNavigate, 
    user, 
    activeTab, 
    setActiveTab, 
    tasks,
    isOpen,
    onClose
}) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const { logout } = useAuth();

    // Calculate today's date string in local YYYY-MM-DD
    const now = new Date();
    const todayStr = useMemo(() => new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0], []);

    const inboxCount = useMemo(() => tasks.filter(t => !t.completed).length, [tasks]);
    const todayCount = useMemo(() => tasks.filter(t => !t.completed && t.date === todayStr).length, [tasks, todayStr]);
    const upcomingCount = useMemo(() => tasks.filter(t => !t.completed && t.date && t.date > todayStr).length, [tasks, todayStr]);
    const completedCount = useMemo(() => tasks.filter(t => t.completed).length, [tasks]);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed md:relative inset-y-0 left-0 w-64 flex-shrink-0 border-r flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${theme === 'dark' ? 'bg-sidebar-dark border-stone-700' : 'bg-sidebar-light border-stone-300/60'}`}>
                <div className={`h-16 flex items-center px-6 border-b ${theme === 'dark' ? 'border-stone-700' : 'border-stone-300/60'}`}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')} role="button" aria-label="Go to Dashboard">
                        <div className={`w-8 h-8 rounded flex items-center justify-center border ${theme === 'dark' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-primary/10 text-primary border-primary/20'}`}>
                            <span className="material-icons text-xl" aria-hidden="true">fact_check</span>
                        </div>
                        <span className={`font-bold text-lg tracking-tight font-serif ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}`}>Dossier</span>
                    </div>
                    {/* Close button for mobile */}
                    <button onClick={onClose} className="ml-auto md:hidden p-1 text-stone-500 hover:text-stone-700">
                        <span className="material-icons">close</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('inbox'); }}
                        aria-label={`${t('sidebar.inbox')}${inboxCount > 0 ? `, ${inboxCount} tasks` : ''}`}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group ${currentScreen === 'dashboard' && activeTab === 'inbox'
                            ? (theme === 'dark' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className={`material-icons mr-3 text-[20px] transition-colors ${currentScreen === 'dashboard' && activeTab === 'inbox' ? 'text-primary' : (theme === 'dark' ? 'text-stone-500 group-hover:text-primary' : 'text-stone-400 group-hover:text-primary')
                            }`} aria-hidden="true">inbox</span>
                        {t('sidebar.inbox')}
                        {inboxCount > 0 && (
                            <span className="ml-auto bg-primary text-white py-0.5 px-2 rounded-full text-xs font-semibold shadow-sm animate-in fade-in zoom-in duration-300">
                                {inboxCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('today'); }}
                        aria-label={`${t('sidebar.today')}${todayCount > 0 ? `, ${todayCount} tasks` : ''}`}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group ${currentScreen === 'dashboard' && activeTab === 'today'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200/80 text-ink')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className={`material-icons mr-3 text-[20px] transition-colors ${theme === 'dark' ? 'text-stone-500 group-hover:text-primary' : 'text-stone-400 group-hover:text-primary'}`} aria-hidden="true">today</span>
                        {t('sidebar.today')}
                        {todayCount > 0 && (
                            <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-semibold shadow-sm transition-colors animate-in fade-in zoom-in duration-300 ${currentScreen === 'dashboard' && activeTab === 'today'
                                ? (theme === 'dark' ? 'bg-stone-600 text-stone-200' : 'bg-stone-300 text-ink')
                                : (theme === 'dark' ? 'bg-stone-800 text-stone-500 group-hover:bg-stone-700' : 'bg-stone-200/50 text-stone-500 group-hover:bg-stone-200')
                                }`}>
                                {todayCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('upcoming'); }}
                        aria-label={`${t('sidebar.upcoming')}${upcomingCount > 0 ? `, ${upcomingCount} tasks` : ''}`}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group ${currentScreen === 'dashboard' && activeTab === 'upcoming'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200/80 text-ink')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className={`material-icons mr-3 text-[20px] transition-colors ${theme === 'dark' ? 'text-stone-500 group-hover:text-primary' : 'text-stone-400 group-hover:text-primary'}`} aria-hidden="true">calendar_month</span>
                        {t('sidebar.upcoming')}
                        {upcomingCount > 0 && (
                            <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-semibold shadow-sm transition-colors animate-in fade-in zoom-in duration-300 ${currentScreen === 'dashboard' && activeTab === 'upcoming'
                                ? (theme === 'dark' ? 'bg-stone-600 text-stone-200' : 'bg-stone-300 text-ink')
                                : (theme === 'dark' ? 'bg-stone-800 text-stone-500 group-hover:bg-stone-700' : 'bg-stone-200/50 text-stone-500 group-hover:bg-stone-200')
                                }`}>
                                {upcomingCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('completed'); }}
                        aria-label={`${t('sidebar.completed')}${completedCount > 0 ? `, ${completedCount} tasks` : ''}`}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all group ${currentScreen === 'dashboard' && activeTab === 'completed'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200/80 text-ink')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className={`material-icons mr-3 text-[20px] transition-colors ${theme === 'dark' ? 'text-stone-500 group-hover:text-primary' : 'text-stone-400 group-hover:text-primary'}`} aria-hidden="true">done_all</span>
                        {t('sidebar.completed')}
                        {completedCount > 0 && (
                            <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-semibold shadow-sm transition-colors animate-in fade-in zoom-in duration-300 ${currentScreen === 'dashboard' && activeTab === 'completed'
                                ? (theme === 'dark' ? 'bg-stone-600 text-stone-200' : 'bg-stone-300 text-ink')
                                : (theme === 'dark' ? 'bg-stone-800 text-stone-500 group-hover:bg-stone-700' : 'bg-stone-200/50 text-stone-500 group-hover:bg-stone-200')
                                }`}>
                                {completedCount}
                            </span>
                        )}
                    </button>

                    <div className="pt-4 pb-2 px-3">
                        <p className={`text-xs font-semibold uppercase tracking-wider font-serif ${theme === 'dark' ? 'text-stone-500' : 'text-stone-500'}`}>{t('sidebar.tags')}</p>
                    </div>

                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('urgent'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'urgent'
                            ? (theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-red-700 mr-4 shadow-sm border border-red-800/20"></span>
                        {t('tag.urgent')}
                    </button>
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('work'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'work'
                            ? (theme === 'dark' ? 'bg-sky-900/20 text-sky-300' : 'bg-sky-50 text-sky-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-700 mr-4 shadow-sm border border-sky-800/20"></span>
                        {t('tag.work')}
                    </button>
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('personal'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'personal'
                            ? (theme === 'dark' ? 'bg-emerald-900/20 text-emerald-300' : 'bg-emerald-50 text-emerald-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 mr-4 shadow-sm border border-emerald-800/20"></span>
                        {t('tag.personal')}
                    </button>
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('finance'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'finance'
                            ? (theme === 'dark' ? 'bg-amber-900/20 text-amber-300' : 'bg-amber-50 text-amber-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-700 mr-4 shadow-sm border border-amber-800/20"></span>
                        {t('tag.finance')}
                    </button>

                    <div className="pt-4 pb-2 px-3">
                        <p className={`text-xs font-semibold uppercase tracking-wider font-serif ${theme === 'dark' ? 'text-stone-500' : 'text-stone-500'}`}>{t('sidebar.urgency')}</p>
                    </div>

                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('urgency-normal'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'urgency-normal'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-stone-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600 mr-4 shadow-sm border border-green-800/20"></span>
                        {t('urgency.normal')}
                    </button>
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('urgency-high'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'urgency-high'
                            ? (theme === 'dark' ? 'bg-orange-900/20 text-orange-300' : 'bg-orange-50 text-orange-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-600 mr-4 shadow-sm border border-yellow-800/20"></span>
                        {t('urgency.high')}
                    </button>
                    <button
                        onClick={() => { onNavigate('dashboard'); setActiveTab('urgency-critical'); }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${currentScreen === 'dashboard' && activeTab === 'urgency-critical'
                            ? (theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-900')
                            : (theme === 'dark' ? 'text-stone-400 hover:bg-stone-800 hover:text-stone-200' : 'text-ink-light hover:bg-stone-200/50 hover:text-ink')
                            }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-red-600 mr-4 shadow-sm border border-red-800/20"></span>
                        {t('urgency.critical')}
                    </button>
                </nav>

                <div className={`p-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-stone-700' : 'border-stone-300/60'}`}>
                    <div
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors flex-1 min-w-0 ${theme === 'dark' ? 'hover:bg-stone-800' : 'hover:bg-stone-200/50'}`}
                        onClick={() => onNavigate('profile')}
                    >
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className={`h-9 w-9 rounded-full object-cover border shadow-sm sepia-[.2] flex-shrink-0 ${theme === 'dark' ? 'border-stone-600' : 'border-stone-400'}`}
                        />
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className={`text-sm font-bold truncate font-serif ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}`}>{user.name}</p>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-stone-500' : 'text-stone-600'}`}>{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className={`ml-2 p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-stone-500 hover:text-red-400 hover:bg-stone-800' : 'text-stone-400 hover:text-red-600 hover:bg-stone-200/50'}`}
                        title={t('sidebar.logout')}
                        aria-label={t('sidebar.logout')}
                    >
                        <span className="material-icons" aria-hidden="true">logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;