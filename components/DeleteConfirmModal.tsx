import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, taskTitle }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const modalRef = useFocusTrap(isOpen, onClose);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <main 
                ref={modalRef}
                className={`relative z-10 w-full max-w-md shadow-2xl rounded-xl overflow-hidden border transform transition-all scale-100 opacity-100 ${theme === 'dark' ? 'bg-background-dark border-stone-700' : 'bg-[#fdf8ec] border-[#e3dac6]'}`}
            >
                {/* Top red bar */}
                <div className="h-2 bg-[#d93025] w-full"></div>

                <div className="p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100'}`}>
                            <span className="material-icons text-4xl text-[#d93025]">warning</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-[#3c3836]'}`}>
                        {t('delete.title')}
                    </h2>

                    {/* Message */}
                    <p className={`text-center mb-4 ${theme === 'dark' ? 'text-stone-400' : 'text-gray-600'}`}>
                        {t('delete.message')}
                    </p>

                    {/* Task name */}
                    <div className={`p-3 rounded-lg border mb-6 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-white/60 border-[#e3dac6]'}`}>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            {t('delete.taskName')}
                        </p>
                        <p className={`font-medium truncate ${theme === 'dark' ? 'text-stone-300' : 'text-[#3c3836]'}`}>{taskTitle}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className={`flex-1 px-6 py-2.5 rounded-lg font-medium transition-colors border ${theme === 'dark' ? 'border-stone-700 text-stone-400 hover:bg-stone-800' : 'border-[#e3dac6] text-gray-500 hover:text-gray-800 hover:bg-stone-100'}`}
                        >
                            {t('delete.cancel')}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-[#d93025] hover:bg-[#b0241b] text-white font-bold px-6 py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(217,48,37,0.39)] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all uppercase tracking-wide text-sm"
                        >
                            {t('delete.confirm')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DeleteConfirmModal;
