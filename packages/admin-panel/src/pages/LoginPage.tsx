import {useState, type FormEvent} from 'react';
import {useAuth} from '../auth/AuthContext.tsx';
import {useNavigate} from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const result = await login(email, password);

        if (result.success) {
            navigate('/'); // Redirige al dashboard después del login
        } else {
            setError(result.error || 'Ocurrió un error inesperado.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen">
            <div
                className="absolute inset-0 bg-cover bg-center bg-[url('/fondoSesion.avif')]"
            />
            <div className="absolute inset-0 bg-black/50" />
            {/* El z-10 asegura que el formulario esté por encima del overlay */}
            <div className="relative z-10 w-full max-w-md bg-gray-100 p-8 space-y-6 bg-surface rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-text">Iniciar Sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                               className="w-full px-3 py-2 mt-1 border rounded-md border-border focus:ring-primary focus:border-primary"
                               required disabled={isSubmitting}/>
                    </div>
                    <div>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-text-secondary">Contraseña</label>
                        <input id="password" type="password" value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="w-full px-3 py-2 mt-1 border rounded-md border-border focus:ring-primary focus:border-primary"
                               required disabled={isSubmitting}/>
                    </div>
                    {error && <p className="text-sm text-danger">{error}</p>}
                    <button type="submit"
                            className="w-full py-2 text-white rounded-md bg-purple-900 hover:bg-primary-hover disabled:bg-gray-400"
                            disabled={isSubmitting}>
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;