import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import SuccessModal from '../components/SuccessModal';

interface LoginProps {
    onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const { language, setLanguage, t } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { login, register, error: authError, clearError } = useAuth();

    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [inputAvatarUrl, setInputAvatarUrl] = useState('');

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_DIM = 300; // Optimal size for avatar

                    if (width > height) {
                        if (width > MAX_DIM) {
                            height *= MAX_DIM / width;
                            width = MAX_DIM;
                        }
                    } else {
                        if (height > MAX_DIM) {
                            width *= MAX_DIM / height;
                            height = MAX_DIM;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Compress and convert to webp format
                        const webpBase64 = canvas.toDataURL('image/webp', 0.8);
                        setAvatarUrl(webpBase64);
                        setInputAvatarUrl(''); // Clear URL input if file is selected
                    }
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        clearError();
        setIsLoading(true);

        try {
            if (isRegistering) {
                if (!name || !email || !password) {
                    setError(t('login.error.allFieldsRequired'));
                    return;
                }
                const success = await register(name, email, password, avatarUrl);
                if (success) {
                    setIsSuccessModalOpen(true);
                } else {
                    // Usar el error específico del API (authError) si existe
                    setError(authError || t('login.error.emailRegistered'));
                }
            } else {
                if (!email || !password) {
                    setError(t('login.error.enterCredentials'));
                    return;
                }
                const success = await login(email, password);
                if (success) {
                    if(onLogin) onLogin();
                } else {
                    setError(authError || t('login.error.invalidCredentials'));
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-y-auto transition-colors duration-500 ${theme === 'dark' ? 'bg-background-dark' : 'bg-stone-100'}`}>
            <div className={`fixed inset-0 ${theme === 'dark' ? 'opacity-[0.03]' : 'opacity-40'} bg-paper-texture pointer-events-none z-0 mix-blend-multiply`}></div>

            {/* Context Controls (Language & Theme) */}
            <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none shadow-inner border border-stone-300/30 ${theme === 'dark' ? 'bg-stone-700' : 'bg-stone-200'}`}
                >
                    <div
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full shadow-sm transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7 bg-stone-900' : 'translate-x-0 bg-white'}`}
                    >
                        <span className={`material-icons text-[12px] ${theme === 'dark' ? 'text-yellow-500' : 'text-orange-400'}`}>
                            {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                        </span>
                    </div>
                </button>

                {/* Language Switcher */}
                <div className={`flex p-1 rounded-lg border gap-1 ${theme === 'dark' ? 'bg-stone-800/60 border-stone-700' : 'bg-stone-200/60 border-stone-300/30'}`}>
                    <button
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all flex items-center gap-1 ${language === 'es'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200 shadow-sm' : 'bg-white shadow-sm text-stone-900 border border-stone-200')
                            : (theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800')
                            }`}
                        onClick={() => setLanguage('es')}
                    >
                        ES
                    </button>
                    <button
                        className={`px-3 py-1.5 text-xs font-bold rounded transition-all flex items-center gap-1 ${language === 'en'
                            ? (theme === 'dark' ? 'bg-stone-700 text-stone-200 shadow-sm' : 'bg-white shadow-sm text-stone-900 border border-stone-200')
                            : (theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-800')
                            }`}
                        onClick={() => setLanguage('en')}
                    >
                        EN
                    </button>
                </div>
            </div>

            <main className="relative z-10 w-full max-w-md perspective-1000">
                <div className={`shadow-2xl rounded-xl overflow-hidden border relative transition-colors duration-500 ${theme === 'dark' ? 'bg-card-dark border-stone-700' : 'bg-[#fdf8ec] border-border-vintage'}`}>
                    <div className="h-2 bg-gradient-to-r from-primary to-primary-hover w-full relative"></div>

                    <div className="p-8 md:p-10 relative">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <img src="/lista-de-tareas.png" alt="Logo Dossier" className="w-16 h-16 object-contain mb-4" />
                            <h1 className={`text-2xl font-bold tracking-tight uppercase font-sans mb-1 transition-colors ${theme === 'dark' ? 'text-stone-200' : 'text-ink'}`}>
                                {isRegistering ? t('login.createAccount') : t('login.title')}
                            </h1>
                            <p className={`text-sm font-mono tracking-tight transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-gray-500'}`}>
                                {isRegistering ? t('login.joinTeam') : t('login.subtitle')}
                            </p>
                        </div>

                        {/* Feedback Messages */}
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

                        <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                            {isRegistering && (
                                <>
                                    <div className="group">
                                        <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-gray-500'}`}>
                                            {t('login.fullName')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                className={`w-full border rounded-md px-4 py-3 pl-10 text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500' : 'bg-white border-border-vintage text-ink placeholder-gray-400'}`}
                                                type="text"
                                                placeholder={t('login.fullNamePlaceholder')}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <span className="material-icons absolute left-3 top-3.5 text-gray-400 text-lg">badge</span>
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-gray-500'}`}>
                                            {t('login.profilePhoto')}
                                        </label>

                                        <div className="flex gap-4 items-start">
                                            {/* Preview */}
                                            <div className={`w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden border-2 border-dashed flex items-center justify-center ${theme === 'dark' ? 'border-stone-600 bg-stone-900/30' : 'border-stone-300 bg-stone-50'}`}>
                                                {avatarUrl ? (
                                                    <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex flex-col items-center text-center p-1">
                                                        <span className={`material-icons text-3xl mb-1 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-300'}`}>face</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                {/* URL Input */}
                                                <div className="relative">
                                                    <input
                                                        className={`w-full border rounded-md px-3 py-2 pl-9 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500' : 'bg-white border-border-vintage text-ink placeholder-gray-400'}`}
                                                        type="text"
                                                        placeholder={t('login.imageUrl')}
                                                        value={inputAvatarUrl}
                                                        onChange={(e) => {
                                                            setInputAvatarUrl(e.target.value);
                                                            setAvatarUrl(e.target.value);
                                                        }}
                                                    />
                                                    <span className="material-icons absolute left-2.5 top-2 text-gray-400 text-lg">link</span>
                                                </div>



                                                {/* File Upload */}
                                                <label className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-colors ${theme === 'dark' ? 'border-stone-700 hover:bg-stone-800 text-stone-300' : 'border-stone-300 hover:bg-stone-50 text-gray-600'}`}>
                                                    <span className="material-icons text-lg">upload_file</span>
                                                    <span className="text-sm font-medium">{t('login.uploadFile')}</span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="group">
                                <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-gray-500'}`}>
                                    {t('login.username')}
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full border rounded-md px-4 py-3 pl-10 text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500' : 'bg-white border-border-vintage text-ink placeholder-gray-400'}`}
                                        type="email"
                                        placeholder={t('login.usernamePlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <span className="material-icons absolute left-3 top-3.5 text-gray-400 text-lg">mail</span>
                                </div>
                            </div>

                            <div className="group">
                                <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wide transition-colors ${theme === 'dark' ? 'text-stone-400' : 'text-gray-500'}`}>
                                    {t('login.password')}
                                </label>
                                <div className="relative">
                                    <input
                                        className={`w-full border rounded-md px-4 py-3 pl-10 text-base font-medium focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-sm ${theme === 'dark' ? 'bg-stone-800 border-stone-700 text-stone-200 placeholder-stone-500' : 'bg-white border-border-vintage text-ink placeholder-gray-400'}`}
                                        type="password"
                                        placeholder={t('login.passwordPlaceholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span className="material-icons absolute left-3 top-3.5 text-gray-400 text-lg">key</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold px-4 py-3 rounded-md shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                            {isRegistering ? 'Registrando...' : 'Autenticando...'}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-icons text-sm">{isRegistering ? 'person_add' : 'login'}</span>
                                            {isRegistering ? t('login.register') : t('login.authenticate')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Toggle Login/Register */}
                        <div className="mt-6 pt-6 border-t border-dashed border-stone-300/30 text-center">
                            <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-stone-400' : 'text-gray-600'}`}>
                                {isRegistering
                                    ? t('login.alreadyHaveAccount')
                                    : t('login.noAccount')
                                }
                            </p>
                            <button
                                onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMessage(''); }}
                                className="text-primary hover:text-primary-hover font-bold text-sm uppercase tracking-wider hover:underline transition-all"
                            >
                                {isRegistering
                                    ? t('login.loginHere')
                                    : t('login.registerNow')
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <footer className={`absolute bottom-6 text-center text-[10px] font-mono tracking-widest transition-colors duration-500 z-10 ${theme === 'dark' ? 'text-stone-600' : 'text-stone-400'}`}>
                <p>© {new Date().getFullYear()} DOSSIER ARCHIVE SYSTEMS. PROPERTY OF THE BUREAU.</p>
            </footer>

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    // Redirigir al inicio de sesión (no al dashboard)
                    setIsRegistering(false);
                    setName('');
                    setAvatarUrl('');
                    setInputAvatarUrl('');
                    setPassword('');
                    // Mantener el email para que el usuario lo tenga listo
                }}
                title={t('login.success.title')}
                message={t('login.success.message')}
                buttonText={t('login.success.button')}
            />
        </div>
    );
};

export default Login;