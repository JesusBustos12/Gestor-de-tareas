import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';


interface DashboardProps {
    tasks: Task[];
    onOpenNewTask: () => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (task: Task) => void;
    onToggleComplete: (id: string) => void;
    activeTab: string;
    onToggleSidebar: () => void;
}

const TagBadge = React.memo(({ type }: { type: string }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    const styles: Record<string, string> = {
        urgent: theme === 'dark' ? 'bg-red-900/30 text-red-200 border-red-800/50' : 'bg-red-100/50 text-red-800 border-red-200',
        work: theme === 'dark' ? 'bg-sky-900/30 text-sky-200 border-sky-800/50' : 'bg-sky-100/50 text-sky-800 border-sky-200',
        personal: theme === 'dark' ? 'bg-emerald-900/30 text-emerald-200 border-emerald-800/50' : 'bg-emerald-100/50 text-emerald-800 border-emerald-200',
        finance: theme === 'dark' ? 'bg-amber-900/30 text-amber-200 border-amber-800/50' : 'bg-amber-100/50 text-amber-800 border-amber-200'
    };

    const labelKey = `tag.${type}`;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${styles[type] || styles.personal}`}>
            {t(labelKey)}
        </span>
    );
});

interface TaskItemProps {
    task: Task;
    todayStr: string;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onToggleComplete: (id: string) => void;
}

const TaskItem = React.memo(({ task, todayStr, onEdit, onDelete, onToggleComplete }: TaskItemProps) => {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(task);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(task);
    };

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onToggleComplete(task.id);
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`group flex flex-col p-4 transition-all border-b ${theme === 'dark' ? 'bg-card-dark hover:bg-stone-800 border-stone-700' : 'bg-card-light hover:bg-[#f7f2e4] border-stone-200/60'}`} role="listitem">
            <div className="flex items-center">
                <div className="flex items-center h-5">
                    <input
                        type="checkbox"
                        className={`h-5 w-5 rounded focus:ring-primary/20 cursor-pointer ${theme === 'dark' ? 'bg-stone-700 border-stone-600 text-primary' : 'bg-stone-50 border-stone-400 text-primary'}`}
                        checked={task.completed}
                        onChange={handleToggle}
                        onClick={handleCheckboxClick}
                        aria-label={task.completed ? t('tasks.markAsPending') : t('tasks.markAsCompleted')}
                    />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-semibold truncate font-serif ${task.completed ? 'line-through decoration-stone-400 text-stone-500' : (theme === 'dark' ? 'text-stone-200' : 'text-stone-900')}`}>
                            {task.title}
                        </p>
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            {task.description && (
                                <button
                                    className={`p-1 rounded transition-colors ${isExpanded ? 'text-primary bg-primary/5' : (theme === 'dark' ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-700' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200')}`}
                                    onClick={toggleExpand}
                                    type="button"
                                    aria-label={isExpanded ? t('tasks.hideDetails') : t('tasks.showDetails')}
                                    title={isExpanded ? t('tasks.hideDetails') : t('tasks.showDetails')}
                                >
                                    <span className="material-icons text-[18px]">{isExpanded ? 'speaker_notes_off' : 'description'}</span>
                                </button>
                            )}
                            <button
                                className={`p-1 rounded ${theme === 'dark' ? 'text-stone-400 hover:text-stone-200 hover:bg-stone-700' : 'text-stone-500 hover:text-stone-700 hover:bg-stone-200'}`}
                                onClick={handleEdit}
                                type="button"
                                aria-label={t('tasks.edit')}
                                title={t('tasks.edit')}
                            >
                                <span className="material-icons text-[18px]">edit</span>
                            </button>
                            <button
                                className={`p-1 rounded ${theme === 'dark' ? 'text-stone-400 hover:text-primary hover:bg-stone-700' : 'text-stone-500 hover:text-primary hover:bg-red-50'}`}
                                onClick={handleDelete}
                                type="button"
                                aria-label={t('tasks.delete')}
                                title={t('tasks.delete')}
                            >
                                <span className="material-icons text-[18px]">delete</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {task.tags.map(tag => <TagBadge key={tag} type={tag} />)}
                        {(task.date || task.time) && (
                            <div className={`flex items-center text-xs font-bold ${(!task.completed && task.date && task.date < todayStr) ? 'text-primary' : (theme === 'dark' ? 'text-stone-400' : 'text-stone-600')}`}>
                                <span className="material-icons text-[14px] mr-1">
                                    {task.time ? 'schedule' : 'event'}
                                </span>
                                {task.date || task.time}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isExpanded && task.description && (
                <div className={`mt-3 ml-9 p-3 rounded-lg border-l-2 font-serif text-sm leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200 ${theme === 'dark' ? 'bg-stone-900/50 border-primary/30 text-stone-400' : 'bg-[#F9F7F2] border-primary/20 text-stone-600 italic shadow-inner'}`}>
                    {task.description}
                </div>
            )}
        </div>
    );
});

const Dashboard: React.FC<DashboardProps> = ({ 
    tasks, 
    onOpenNewTask, 
    onEditTask, 
    onDeleteTask, 
    onToggleComplete, 
    activeTab, 
    onToggleSidebar 
}) => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();

    const [searchQuery, setSearchQuery] = useState('');

    // Calculate today's date string in local YYYY-MM-DD
    const now = new Date();
    const todayStr = useMemo(() => new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0], []);

    // Filter tasks based on search
    const filteredTasks = useMemo(() => tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ), [tasks, searchQuery]);

    // Filter tasks based on activeTab
    const displayTasks = useMemo(() => {
        let results = filteredTasks;

        if (activeTab === 'completed') {
            results = filteredTasks.filter(t => t.completed);
        } else if (activeTab === 'today') {
            results = filteredTasks.filter(t => t.date === todayStr);
        } else if (activeTab === 'upcoming') {
            results = filteredTasks.filter(t => !t.date || t.date > todayStr);
        } else if (activeTab === 'urgent' || activeTab === 'work' || activeTab === 'personal' || activeTab === 'finance') {
            results = filteredTasks.filter(t => t.tags.includes(activeTab as any));
        } else if (activeTab.startsWith('urgency-')) {
            const level = activeTab.replace('urgency-', '');
            results = filteredTasks.filter(t => {
                if (t.urgency) return t.urgency === level;
                if (level === 'critical') return t.tags.includes('urgent');
                if (level === 'high') return t.tags.includes('work');
                if (level === 'normal') return !t.tags.includes('urgent') && !t.tags.includes('work');
                return false;
            });
        }
        return results;
    }, [filteredTasks, activeTab, todayStr]);

    // Get tasks by status dynamically calculated from date
    const overdueTasks = useMemo(() => displayTasks.filter(t => t.date && t.date < todayStr), [displayTasks, todayStr]);
    const todayTasks = useMemo(() => displayTasks.filter(t => t.date === todayStr), [displayTasks, todayStr]);
    const upcomingTasks = useMemo(() => displayTasks.filter(t => !t.date || t.date > todayStr), [displayTasks, todayStr]);

    return (
        <div className={`flex-1 flex flex-col min-w-0 overflow-hidden h-full transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark' : 'bg-transparent'}`}>
            <header className={`h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b backdrop-blur-sm z-20 transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark/90 border-stone-700' : 'border-stone-300/60 bg-background-light/80'}`}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onToggleSidebar}
                        className={`md:hidden p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-stone-400 hover:bg-stone-800' : 'text-stone-600 hover:bg-stone-200/50'}`}
                    >
                        <span className="material-icons">menu</span>
                    </button>
                    <h1 className={`text-xl font-bold tracking-tight font-serif ${theme === 'dark' ? 'text-stone-200' : 'text-stone-900'}`}>{t('header.myTasks')}</h1>
                </div>
                <div className="flex items-center gap-3">

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shadow-inner border border-stone-300/30 mr-2 ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'}`}
                        role="switch"
                        aria-checked={theme === 'dark'}
                        aria-label={t('header.toggleTheme')}
                        title={t('header.toggleTheme')}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-6 bg-stone-900' : 'translate-x-0 bg-white'}`}
                        >
                            <span className={`material-icons text-[10px] ${theme === 'dark' ? 'text-yellow-500' : 'text-orange-400'}`}>
                                {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                            </span>
                        </div>
                    </button>

                    {/* Language Switcher */}
                    <div className={`flex p-1 rounded-lg border hidden sm:flex ${theme === 'dark' ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-200/60 border-stone-300/30'}`}>
                        <button
                            className={`px-2 py-1 text-xs font-bold rounded transition-all ${language === 'es'
                                ? (theme === 'dark' ? 'bg-stone-700 text-stone-200 shadow-sm' : 'bg-card-light shadow-sm text-stone-900 border border-stone-200')
                                : (theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800')
                                }`}
                            onClick={() => setLanguage('es')}
                        >
                            ES
                        </button>
                        <button
                            className={`px-2 py-1 text-xs font-bold rounded transition-all ${language === 'en'
                                ? (theme === 'dark' ? 'bg-stone-700 text-stone-200 shadow-sm' : 'bg-card-light shadow-sm text-stone-900 border border-stone-200')
                                : (theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800')
                                }`}
                            onClick={() => setLanguage('en')}
                        >
                            EN
                        </button>
                    </div>



                    <div className="relative hidden lg:block">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                            <span className="material-icons text-[20px]">search</span>
                        </span>
                        <input
                            type="text"
                            className={`w-64 pl-10 pr-4 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-stone-400 shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-card-light border-stone-300 text-ink'}`}
                            placeholder={t('header.search')}
                            aria-label={t('header.search')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onOpenNewTask}
                        className="flex items-center justify-center sm:w-[150px] gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all group border border-red-900/20"
                    >
                        <span className="material-icons text-[20px] group-hover:rotate-90 transition-transform">add</span>
                        <span className="text-sm font-semibold hidden sm:inline">{t('header.newTask')}</span>
                    </button>
                </div>
            </header>

            {/* Mobile Search - Visible only on mobile/tablet */}
            <div className={`p-4 lg:hidden border-b transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark/50 border-stone-800' : 'bg-stone-50/50 border-stone-200/60'}`}>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-stone-500">
                        <span className="material-icons text-[20px]">search</span>
                    </span>
                    <input
                        type="text"
                        className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-stone-400 shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-stone-300 text-ink'}`}
                        placeholder={t('header.search')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
                <div className="max-w-4xl mx-auto space-y-8 pb-10">
                    {/* Overdue Tasks */}
                    {overdueTasks.length > 0 && (
                        <section>
                            <h2 className="text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-2 font-serif border-b border-primary/20 pb-1 w-max">
                                <span className="material-icons text-sm">warning</span>
                                {t('tasks.overdue')}
                            </h2>
                            <div className={`rounded-xl shadow-paper border overflow-hidden divide-y ${theme === 'dark' ? 'bg-card-dark border-stone-700 divide-stone-700' : 'bg-card-light border-stone-300/60 divide-stone-200/60'}`}>
                                {overdueTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        todayStr={todayStr}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                        onToggleComplete={onToggleComplete}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Today Tasks */}
                    {todayTasks.length > 0 && (
                        <section>
                            <div className={`flex items-center justify-between mb-3 border-b pb-1 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-300'}`}>
                                <h2 className={`text-sm font-bold uppercase tracking-wider font-serif ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>{t('tasks.today')}</h2>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${theme === 'dark' ? 'text-stone-400 bg-stone-800 border-stone-700' : 'text-stone-600 bg-stone-200/50 border border-stone-300'}`}>
                                    {todayTasks.length} {t('tasks.count')}
                                </span>
                            </div>
                            <div className={`rounded-xl shadow-paper border overflow-hidden divide-y ${theme === 'dark' ? 'bg-card-dark border-stone-700 divide-stone-700' : 'bg-card-light border-stone-300/60 divide-stone-200/60'}`}>
                                {todayTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        todayStr={todayStr}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                        onToggleComplete={onToggleComplete}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Upcoming Tasks */}
                    {upcomingTasks.length > 0 && (
                        <section>
                            <h2 className={`text-sm font-bold uppercase tracking-wider font-serif border-b pb-1 w-max ${theme === 'dark' ? 'text-stone-400 border-stone-700' : 'text-stone-600 border-stone-300'}`}>
                                {t('tasks.upcoming')}
                            </h2>
                            <div className={`rounded-xl shadow-paper border overflow-hidden divide-y ${theme === 'dark' ? 'bg-card-dark border-stone-700 divide-stone-700' : 'bg-card-light border-stone-300/60 divide-stone-200/60'}`}>
                                {upcomingTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        todayStr={todayStr}
                                        onEdit={onEditTask}
                                        onDelete={onDeleteTask}
                                        onToggleComplete={onToggleComplete}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Empty state */}
                    {displayTasks.length === 0 && (
                        <div className="text-center py-12">
                            <span className={`material-icons text-6xl mb-4 ${theme === 'dark' ? 'text-stone-700' : 'text-stone-300'}`}>task_alt</span>
                            <p className={`text-lg ${theme === 'dark' ? 'text-stone-500' : 'text-stone-500'}`}>
                                {searchQuery
                                    ? t('empty.noResults')
                                    : t(`empty.${activeTab}`) || t('empty.noTasks')
                                }
                            </p>
                        </div>
                    )}

                    <div className="pt-8 text-center opacity-70">
                        <div className={`inline-block p-2 border-t border-b mb-2 ${theme === 'dark' ? 'border-stone-700' : 'border-stone-400/30'}`}>
                            <span className={`material-icons text-2xl ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>format_quote</span>
                        </div>
                        <p className={`text-sm italic font-serif ${theme === 'dark' ? 'text-stone-500' : 'text-stone-600'}`}>{t('quote.text')}</p>
                        <p className={`text-xs mt-1 uppercase tracking-widest ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>— {t('quote.author')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;