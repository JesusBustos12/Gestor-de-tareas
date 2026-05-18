import React, { useState } from 'react';
import { User } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import SuccessModal from '../components/SuccessModal';

interface ProfileProps {
    user: User;
    onBack: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack }) => {
    const { theme } = useTheme();
    const { t, language } = useLanguage();
    const { updateUser, error: authError, clearError } = useAuth(); // Assuming useAuth is imported

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [avatarUrl, setAvatarUrl] = useState(user.avatar || '');
    const [inputAvatarUrl, setInputAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarUrl(result);
                setInputAvatarUrl('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdate = async () => {
        if (!name.trim()) {
            setError(t('login.error.allFieldsRequired'));
            return;
        }
        setError('');
        clearError();
        setIsLoading(true);

        try {
            const success = await updateUser({ name, avatar: avatarUrl });
            if (success) {
                setIsSuccessModalOpen(true);
            } else {
                setError(authError || 'No se pudo actualizar el perfil corporativo.');
            }
        } catch (err) {
            setError('Error de conexión al servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex-1 overflow-y-auto p-6 sm:p-12 relative overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark' : 'bg-[#F5F1E6]'}`}>
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-20 right-10 w-32 h-32 rounded-full border-[12px] opacity-40 transform rotate-45 blur-[1px] ${theme === 'dark' ? 'border-stone-700 mix-blend-overlay' : 'border-[#8B4513]/5 mix-blend-multiply'}`}></div>
                <div className={`absolute top-24 right-14 w-24 h-24 rounded-full border-[4px] opacity-30 ${theme === 'dark' ? 'border-stone-700 mix-blend-overlay' : 'border-[#8B4513]/5 mix-blend-multiply'}`}></div>
            </div>

            <div className="relative w-full max-w-5xl z-10 mx-auto mt-4">
                <div className={`absolute -top-9 left-4 w-40 h-10 rounded-t shadow-[0_-1px_3px_rgba(0,0,0,0.05)] border-t border-x flex items-center justify-center z-0 ${theme === 'dark' ? 'bg-card-dark border-stone-700' : 'bg-[#F9F7F2] border-border-vintage'}`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-stone-500' : 'text-ink-light'}`}>{t('profile.userLabel')}</span>
                </div>

                <div className={`rounded shadow-folder border p-8 md:p-12 relative overflow-visible ${theme === 'dark' ? 'bg-card-dark border-stone-700' : 'bg-[#F9F7F2] border-border-vintage'}`}>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Photo Section */}
                        <div className={`lg:col-span-4 flex flex-col items-center space-y-6 border-b lg:border-b-0 lg:border-r border-dashed pb-8 lg:pb-0 lg:pr-8 ${theme === 'dark' ? 'border-stone-700' : 'border-border-vintage'}`}>
                            <div className="relative group mt-4 w-full flex flex-col items-center">
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 drop-shadow-sm">
                                    <div className="w-3 h-3 rounded-full bg-[#8B0000] border border-[#660000] shadow-inner"></div>
                                    <div className="w-[1px] h-3 bg-[#9CA3AF] mx-auto opacity-80"></div>
                                </div>

                                {/* Avatar Preview & Upload */}
                                <div className={`relative w-48 h-48 p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] transform rotate-1 transition-transform hover:rotate-0 duration-300 border ${theme === 'dark' ? 'bg-stone-800 border-stone-600' : 'bg-[#F5F1E6] border-white'}`}>
                                    <div className={`w-full h-full border border-dashed flex flex-col items-center justify-center relative overflow-hidden ${theme === 'dark' ? 'border-stone-600 bg-stone-900/30' : 'border-border-vintage bg-[#E8E4D9]/30'}`}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <>
                                                <span className={`material-icons text-6xl mb-2 ${theme === 'dark' ? 'text-stone-600' : 'text-ink-light/20'}`}>face</span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight whitespace-pre-line ${theme === 'dark' ? 'text-stone-600' : 'text-ink-light/40'}`}>
                                                    {t('profile.identificationPhoto')}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-16 h-6 backdrop-blur-[1px] transform rotate-45 border shadow-sm opacity-80 pointer-events-none ${theme === 'dark' ? 'bg-stone-800/60 border-stone-600/40' : 'bg-[#FDFBF7]/60 border-white/40'}`}></div>
                            </div>

                            {/* Upload Controls */}
                            <div className="w-full space-y-3 px-4">
                                <div className="relative">
                                    <input
                                        className={`w-full border rounded-md px-3 py-2 pl-9 text-xs focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500' : 'bg-white border-border-vintage text-ink placeholder-gray-400'}`}
                                        type="text"
                                        placeholder={t('login.imageUrl')}
                                        value={inputAvatarUrl}
                                        onChange={(e) => {
                                            setInputAvatarUrl(e.target.value);
                                            setAvatarUrl(e.target.value);
                                        }}
                                    />
                                    <span className="material-icons absolute left-2.5 top-2.5 text-gray-400 text-sm">link</span>
                                </div>



                                <label className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-colors ${theme === 'dark' ? 'border-stone-700 hover:bg-stone-800 text-stone-300' : 'border-stone-300 hover:bg-stone-50 text-gray-600'}`}>
                                    <span className="material-icons text-sm">upload_file</span>
                                    <span className="text-xs font-medium">{t('login.uploadFile')}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </label>
                            </div>

                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-8 flex flex-col h-full">
                            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-double pb-4 ${theme === 'dark' ? 'border-stone-700' : 'border-border-vintage'}`}>
                                <div>
                                    <h2 className={`text-2xl font-bold uppercase tracking-tight font-serif ${theme === 'dark' ? 'text-stone-200' : 'text-ink'}`}>{t('profile.personnelRecord')}</h2>
                                    <p className={`text-sm italic mt-1 font-serif ${theme === 'dark' ? 'text-stone-400' : 'text-ink-light'}`}>{t('profile.subtitle')}</p>
                                </div>
                                <div className={`mt-2 sm:mt-0 px-3 py-1 border rounded-sm text-xs font-mono ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-400' : 'bg-[#E8E4D9] border-border-vintage text-ink-light'}`}>
                                    REF: #8821-X
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm">
                                    <span className="material-icons text-red-500">error</span>
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-800 text-sm">
                                    <span className="material-icons text-green-500">check_circle</span>
                                    {successMessage}
                                </div>
                            )}

                            <form className="space-y-8 flex-grow" onSubmit={(e) => e.preventDefault()}>
                                <div className="flex flex-col gap-10">
                                    <div className="group relative">
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors ${theme === 'dark' ? 'text-stone-500' : 'text-ink-light'}`} htmlFor="fullname">{t('profile.fullName')}</label>
                                        <input
                                            className={`block w-full border focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 py-3 text-lg font-serif transition-colors rounded-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-600 text-stone-200 placeholder-stone-600' : 'bg-[#F5F1E6] border-border-vintage text-ink placeholder-gray-400'}`}
                                            id="fullname"
                                            placeholder={t('profile.fullNamePlaceholder')}
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="group relative">
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 group-focus-within:text-primary transition-colors ${theme === 'dark' ? 'text-stone-500' : 'text-ink-light'}`} htmlFor="email">{t('profile.email')}</label>
                                        <input
                                            className={`block w-full border focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 py-3 text-lg font-serif transition-colors rounded-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-600 text-stone-200 placeholder-stone-600' : 'bg-[#F5F1E6] border-border-vintage text-ink placeholder-gray-400'}`}
                                            id="email"
                                            placeholder={t('profile.emailPlaceholder')}
                                            type="email"
                                            value={email}
                                            readOnly
                                        />
                                        <p className={`text-[10px] mt-2 italic ${theme === 'dark' ? 'text-stone-500' : 'text-ink-light'}`}>{t('profile.emailNote')}</p>
                                    </div>
                                </div>
                            </form>

                            <div className={`mt-12 pt-6 border-t flex flex-col-reverse sm:flex-row justify-end items-center gap-4 ${theme === 'dark' ? 'border-stone-700' : 'border-border-vintage'}`}>
                                <button onClick={onBack} className={`px-6 py-2.5 rounded text-sm font-bold tracking-wide uppercase border shadow-sm transition-colors ${theme === 'dark' ? 'bg-stone-800 border-stone-600 text-stone-400 hover:bg-stone-700 hover:text-stone-200' : 'text-ink-light bg-[#F5F1E6] border-border-vintage hover:bg-[#E8E4D9] hover:text-ink'}`} type="button">
                                    {t('modal.cancel')}
                                </button>
                                <button 
                                    onClick={handleUpdate} 
                                    disabled={isLoading}
                                    className="relative bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded shadow-sm hover:shadow-md transform active:translate-y-px transition-all group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" 
                                    type="button"
                                >
                                    <span className="relative z-10 flex items-center gap-2 font-bold tracking-wide uppercase text-sm">
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-icons text-sm">save_as</span>
                                                {t('profile.updateRecord')}
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Papers underneath effect */}
                <div className={`absolute top-2 left-2 w-full h-full rounded shadow-sm border -z-10 transform rotate-1 opacity-80 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-[#F5F1E6] border-border-vintage'}`}></div>
                <div className={`absolute top-1 left-3 w-full h-full rounded shadow-sm border -z-20 transform -rotate-1 opacity-60 ${theme === 'dark' ? 'bg-stone-800 border-stone-700' : 'bg-[#E8E4D9] border-border-vintage'}`}></div>
            </div>

            <footer className={`text-center py-8 text-xs font-mono mt-8 ${theme === 'dark' ? 'text-stone-600' : 'text-ink-light/50'}`}>
                <div className="flex justify-center items-center gap-2 mb-2">
                    <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-border-vintage'}`}></span>
                    <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-border-vintage'}`}></span>
                    <span className={`w-1 h-1 rounded-full ${theme === 'dark' ? 'bg-stone-700' : 'bg-border-vintage'}`}></span>
                </div>
                <p>© {new Date().getFullYear()} Dossier Archive Systems. Property of The Bureau.</p>
            </footer>
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title={t('profile.successMessage') || '¡Éxito!'}
                message={t('profile.successMessage') || 'Los cambios se han guardado correctamente.'}
                buttonText={t('profile.success.button')}
            />
        </div>
    );
};

export default Profile;