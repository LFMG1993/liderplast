import React, {Fragment, useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {Mail, KeyRound, X, LoaderCircle} from 'lucide-react';
import {authService} from '../../services/authService.ts';
import {useUserAuth} from "../../context/UserAuthContext.tsx";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback opcional para ejecutar después de un login exitoso
}

export function AuthModal({isOpen, onClose, onSuccess}: AuthModalProps) {
    const {login} = useUserAuth();
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await authService.requestLoginCode(email);
            if (response.success) {
                setStep('code');
            } else {
                setError(response.message || 'No se pudo enviar el código. Inténtalo de nuevo.');
            }
        } catch (err) {
            setError('Ocurrió un error de red. Por favor, revisa tu conexión.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await authService.verifyLoginCode(email, code);
            if (response.success && response.token) {
                login(response.token);
                onSuccess?.(); // Ejecuta el callback si existe
                onClose(); // Cierra el modal
            } else {
                setError(response.error || 'Código incorrecto o expirado.');
            }
        } catch (err) {
            setError('Ocurrió un error al verificar el código.');
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setStep('email');
        setEmail('');
        setCode('');
        setError(null);
        setIsLoading(false);
    };

    return (
        <Transition appear show={isOpen} as={Fragment} afterLeave={resetState}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} {...{
                    enter: "ease-out duration-300",
                    enterFrom: "opacity-0",
                    enterTo: "opacity-100",
                    leave: "ease-in duration-200",
                    leaveFrom: "opacity-100",
                    leaveTo: "opacity-0"
                }}>
                    <div className="fixed inset-0 bg-black bg-opacity-40"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={Fragment} {...{
                            enter: "ease-out duration-300",
                            enterFrom: "opacity-0 scale-95",
                            enterTo: "opacity-100 scale-100",
                            leave: "ease-in duration-200",
                            leaveFrom: "opacity-100 scale-100",
                            leaveTo: "opacity-0 scale-95"
                        }}>
                            <Dialog.Panel
                                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 text-center">
                                    {step === 'email' ? 'Continuar con tu correo' : 'Ingresa tu código'}
                                </Dialog.Title>
                                <button onClick={onClose}
                                        className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100">
                                    <X className="h-5 w-5 text-gray-500"/>
                                </button>

                                {step === 'email' ? (
                                    <form onSubmit={handleRequestCode} className="mt-4 space-y-4">
                                        <p className="text-sm text-gray-500 text-center">Te enviaremos un código de
                                            acceso a tu correo para continuar.</p>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                   placeholder="tu@correo.com" required
                                                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-liderplast-primary focus:border-liderplast-primary"/>
                                        </div>
                                        <button type="submit" disabled={isLoading}
                                                className="w-full flex justify-center items-center gap-2 background-lider text-white font-bold py-2 px-4 rounded-md hover:bg-liderplast-hover disabled:bg-gray-400">
                                            {isLoading && <LoaderCircle className="animate-spin h-5 w-5"/>}
                                            Enviar Código
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyCode} className="mt-4 space-y-4">
                                        <p className="text-sm text-gray-500 text-center">
                                            Enviamos un código a <span className="font-bold">{email}</span>.
                                            <button onClick={() => setStep('email')}
                                                    className="text-xs text-liderplast-primary hover:underline ml-1">Cambiar
                                                correo</button>
                                        </p>
                                        <div className="relative">
                                            <KeyRound
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"/>
                                            <input type="text" value={code} onChange={(e) => setCode(e.target.value)}
                                                   placeholder="123456" required inputMode="numeric" pattern="\d{6}"
                                                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-liderplast-primary focus:border-liderplast-primary"/>
                                        </div>
                                        <button type="submit" disabled={isLoading}
                                                className="w-full flex justify-center items-center gap-2 background-lider text-white font-bold py-2 px-4 rounded-md hover:bg-liderplast-hover disabled:bg-gray-400">
                                            {isLoading && <LoaderCircle className="animate-spin h-5 w-5"/>}
                                            Verificar e Ingresar
                                        </button>
                                    </form>
                                )}

                                {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}