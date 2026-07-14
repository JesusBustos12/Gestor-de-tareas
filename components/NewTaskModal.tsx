import React, { useState, useEffect } from 'react';
import { Task, TagType, TaskStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    task?: Task | null;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const { user } = useAuth();
    const isEditing = !!task;
    const modalRef = useFocusTrap(isOpen, onClose);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [dueDate, setDueDate] = useState('');
    const [urgency, setUrgency] = useState<'normal' | 'high' | 'critical'>('normal');
    const [selectedTags, setSelectedTags] = useState<TagType[]>(['personal']);

    // Load task data when editing
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');

            setDueDate(task.date || '');
            setSelectedTags(task.tags);
            // Determine urgency from tags
            if (task.tags.includes('urgent')) {
                setUrgency('critical');
            } else if (task.tags.includes('work')) {
                setUrgency('high');
            } else {
                setUrgency('normal');
            }
        } else {
            // Reset form for new task
            setTitle('');
            setDescription('');

            setDueDate('');
            setUrgency('normal');
            setSelectedTags(['personal']);
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Determine tags based on urgency
        let tags: TagType[] = [...selectedTags];
        if (urgency === 'critical' && !tags.includes('urgent')) {
            tags.push('urgent');
        }

        // Determine status based on date (using local comparison)
        let status: TaskStatus = 'upcoming';
        if (dueDate) {
            const now = new Date();
            // Get local YYYY-MM-DD
            const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

            if (dueDate === todayStr) {
                status = 'today';
            } else if (dueDate < todayStr) {
                status = 'overdue';
            }
        }

        const taskData: Omit<Task, 'id' | 'createdAt'> = {
            title,
            description,

            status,
            tags,
            urgency,
            date: dueDate,
            completed: task?.completed || false
        };

        onSave(taskData);
    };

    const toggleTag = (tag: TagType) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <main 
                ref={modalRef}
                className={`relative z-10 w-full max-w-4xl flex flex-col max-h-[95vh] md:max-h-[90vh] shadow-2xl rounded-xl overflow-hidden border transform transition-all scale-100 opacity-100 ${theme === 'dark' ? 'bg-background-dark border-stone-700' : 'bg-[#fdf8ec] border-[#e3dac6]'}`}
            >
                {/* Top red bar */}
                <div className="shrink-0 h-2 bg-[#d93025] w-full"></div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                    {/* Sidebar of the modal */}
                    <aside className={`shrink-0 w-full md:w-64 border-r p-4 md:p-6 flex flex-col justify-between ${theme === 'dark' ? 'bg-card-dark border-stone-700' : 'bg-[#f7f0e1] border-[#e3dac6]'}`}>
                        <div>
                            <div className="flex items-center gap-2 mb-8 text-[#d93025] font-bold tracking-wider uppercase text-sm">
                                <span className="material-icons text-lg">folder_open</span>
                                <span>{t('modal.project')}</span>
                            </div>
                            <div className="space-y-6">
                                <div className={`p-4 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-white/60 border-orange-100/50'}`}>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('modal.currentStatus')}</label>
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${isEditing ? 'bg-green-600' : 'bg-yellow-600'} animate-pulse`}></span>
                                        <span className={`font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-gray-700'}`}>
                                            {isEditing ? t('modal.editMode') : t('modal.draftMode')}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm group cursor-pointer">
                                        <span className="text-gray-500 group-hover:text-primary transition-colors">{t('modal.createdBy')}</span>
                                        <div className="flex items-center gap-2">
                                            {user?.avatar && <img alt="User Avatar" className="w-6 h-6 rounded-full object-cover" src={user.avatar} />}
                                            <span className={`font-medium ${theme === 'dark' ? 'text-stone-300' : 'text-ink'}`}>{user?.name || 'User'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">{t('modal.date')}</span>
                                        <span className={`font-mono text-xs px-2 py-1 rounded border ${theme === 'dark' ? 'bg-stone-800 text-stone-400 border-stone-700' : 'bg-white/50 text-ink border-[#e3dac6]/50'}`}>
                                            {new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-8 pt-6 border-t flex items-center justify-between ${theme === 'dark' ? 'border-stone-700' : 'border-[#e3dac6]'}`}>
                            <span className="text-xs font-semibold text-gray-400 uppercase">{t('modal.language')}</span>
                            <div className="flex items-center gap-1 text-sm font-bold text-primary">
                                <span>{language.toUpperCase()}</span>
                            </div>
                        </div>
                    </aside>

                    {/* Form Section */}
                    <section className={`flex-1 p-4 md:p-10 relative overflow-y-auto ${theme === 'dark' ? 'bg-background-dark' : 'bg-[#fdf8ec]'}`}>
                        {/* Background Icon Watermark */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
                            <span className="material-icons text-[20rem] text-[#d93025] rotate-[-15deg]">assignment</span>
                        </div>

                        <header className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h1 className={`text-3xl font-bold tracking-tight mb-1 font-sans ${theme === 'dark' ? 'text-stone-200' : 'text-[#3c3836]'}`}>
                                    {isEditing ? t('modal.editTask') : t('modal.createTask')}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {isEditing ? t('modal.editDetails') : t('modal.fillDetails')}
                                </p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5">
                                <span className="material-icons">close</span>
                            </button>
                        </header>

                        <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                            <div className="group">
                                <label className="block text-sm font-bold text-gray-600 mb-1 group-focus-within:text-primary transition-colors" htmlFor="task-title">
                                    {t('modal.taskTitle')} <span className="text-primary">*</span>
                                </label>
                                <input
                                    className={`w-full border rounded-lg px-4 py-3 text-lg font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-400 shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-[#e3dac6] text-[#3c3836]'}`}
                                    id="task-title"
                                    placeholder={t('modal.taskTitlePlaceholder')}
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="group">
                                <label className="block text-sm font-bold text-gray-600 mb-1 group-focus-within:text-primary transition-colors" htmlFor="due-date">
                                    {t('modal.deadline')}
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full border rounded-lg px-4 py-3 font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-[#e3dac6] text-gray-700'}`}
                                        id="due-date"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />
                                    <span className="material-icons absolute right-3 top-3.5 text-gray-400 pointer-events-none group-focus-within:text-primary">event</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-sm font-bold text-gray-600 mb-1 group-focus-within:text-primary transition-colors" htmlFor="description">
                                    {t('modal.description')}
                                </label>
                                <div className="relative">
                                    <textarea
                                        className={`w-full border rounded-lg px-4 py-3 font-normal focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-gray-400 shadow-sm resize-none ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200' : 'bg-white border-[#e3dac6] text-[#3c3836]'}`}
                                        id="description"
                                        placeholder={t('modal.descriptionPlaceholder')}
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        maxLength={500}
                                    ></textarea>
                                    <div className={`absolute bottom-3 right-3 text-xs px-1 rounded ${theme === 'dark' ? 'bg-stone-800 text-stone-500' : 'bg-white text-gray-400'}`}>
                                        {description.length} / 500
                                    </div>
                                </div>
                            </div>

                            {/* Tags Selection */}
                            <div>
                                <span className="block text-sm font-bold text-gray-600 mb-2">{t('sidebar.tags')}</span>
                                <div className="flex flex-wrap gap-2">
                                    {(['urgent', 'work', 'personal', 'finance'] as TagType[]).map(tag => (
                                        <label key={tag} className="cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={selectedTags.includes(tag)}
                                                onChange={() => toggleTag(tag)}
                                            />
                                            <div className={`px-3 py-1.5 rounded-lg border font-medium text-sm transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary ${theme === 'dark' ? 'border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-500' : 'border-[#e3dac6] bg-white text-gray-500 hover:border-gray-400'}`}>
                                                {t(`tag.${tag}`)}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="block text-sm font-bold text-gray-600 mb-2">{t('modal.urgencyLevel')}</span>
                                <div className="flex gap-3">
                                    {(['normal', 'high', 'critical'] as const).map((level) => (
                                        <label key={level} className="cursor-pointer relative">
                                            <input
                                                className="peer sr-only"
                                                name="urgency"
                                                type="radio"
                                                value={level}
                                                checked={urgency === level}
                                                onChange={(e) => setUrgency(e.target.value as any)}
                                            />
                                            <div className={`px-4 py-2 rounded-lg border font-medium text-sm transition-all flex items-center gap-2 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary ${theme === 'dark' ? 'border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-500' : 'border-[#e3dac6] bg-white text-gray-500 hover:border-gray-400'}`}>
                                                <span className={`w-2 h-2 rounded-full ${level === 'normal' ? 'bg-green-600' : level === 'high' ? 'bg-yellow-600' : 'bg-primary'}`}></span>
                                                {t(`modal.urgency${level.charAt(0).toUpperCase() + level.slice(1)}`)}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={`pt-6 mt-2 border-t flex items-center justify-end gap-4 ${theme === 'dark' ? 'border-stone-700' : 'border-[#e3dac6]/50'}`}>
                                <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-500 hover:text-gray-800 font-medium transition-colors" type="button">
                                    {t('modal.cancel')}
                                </button>
                                <button className="bg-[#d93025] hover:bg-[#b0241b] text-white font-bold px-8 py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(217,48,37,0.39)] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center gap-2 uppercase tracking-wide text-sm" type="submit">
                                    <span className="material-icons text-sm">save</span>
                                    {isEditing ? t('modal.save') : t('modal.confirm')}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>


            </main>
        </div>
    );
};

export default NewTaskModal;