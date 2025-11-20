import {useState, useEffect, type FormEvent} from 'react';
import {useAuthStore} from "../../store/authStore.ts";
import {useNavigate} from 'react-router-dom';
import {Spinner} from "../../components/general/Spinner.tsx";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const {login, isAuthenticated, isLoading} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/admin/dashboard', {replace: true});
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const result = await login(email, password);

        if (!result.success) {
            setError(result.error || 'Ocurrió un error inesperado.');
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-background)]">
                <Spinner/>
                <p className="mt-4 text-lg text-[var(--color-foreground)]/80">Iniciando sesión...</p>
            </div>
        );
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center bg-[url('/fondoSesion.avif')]"
            />
            <div className="absolute inset-0 bg-black/50"/>
            {/* El z-10 asegura que el formulario esté por encima del overlay */}
            <div className="relative z-10 w-full max-w-md bg-[var(--color-card)] p-8 space-y-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-[var(--color-foreground)]">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground)]/80">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               className="w-full px-3 py-2 mt-1 border rounded-md bg-[var(--color-muted)] border-[var(--color-border)] focus:ring-primary focus:border-primary"
                               required disabled={isSubmitting}/>
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-[var(--color-foreground)]/80">Contraseña</label>
                        <input id="password" type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="w-full px-3 py-2 mt-1 border rounded-md bg-[var(--color-muted)] border-[var(--color-border)] focus:ring-primary focus:border-primary"
                               required disabled={isSubmitting}/>
                    </div>
                    {error && <p className="text-sm text-danger">{error}</p>}
                    <button type="submit"
                            className="w-full py-2 rounded-md bg-[#4a3084] text-white hover:bg-[#3b266a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isSubmitting}>
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;