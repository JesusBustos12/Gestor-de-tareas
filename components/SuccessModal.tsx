import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttonText?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, message, buttonText }) => {
    const { t } = useLanguage();
    const { theme } = useTheme();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <main className={`relative z-10 w-full max-w-md shadow-2xl rounded-xl overflow-hidden border transform transition-all scale-100 opacity-100 ${theme === 'dark' ? 'bg-background-dark border-stone-700' : 'bg-[#fdf8ec] border-[#e3dac6]'}`}>
                {/* Top green bar */}
                <div className="h-2 bg-green-600 w-full"></div>

                <div className="p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100'}`}>
                            <span className="material-icons text-4xl text-green-600">check_circle</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-stone-200' : 'text-[#3c3836]'}`}>
                        {title}
                    </h2>

                    {/* Message */}
                    <p className={`text-center mb-6 ${theme === 'dark' ? 'text-stone-400' : 'text-gray-600'}`}>
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-[0_4px_14px_0_rgba(22,163,74,0.39)] transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all uppercase tracking-wide text-sm"
                        >
                            {buttonText || (t('modal.confirm') || 'OK')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SuccessModal;
