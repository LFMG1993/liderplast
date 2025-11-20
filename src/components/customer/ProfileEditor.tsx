import {useState, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {customerProfileService} from '../../services/customerProfileService';
import type {CustomerProfileUpdateData} from '../../types';
import {useNotification} from '../../context/NotificationContext.tsx';
import {Spinner} from '../general/Spinner';
import {Button} from '../general/Button';
import {useUserAuth} from "../../context/UserAuthContext.tsx";

export const ProfileEditor = () => {
    const {customer} = useUserAuth();
    const queryClient = useQueryClient();
    const [profile, setProfile] = useState<CustomerProfileUpdateData | null>(null);
    const {addNotification} = useNotification();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customerProfile'],
        queryFn: customerProfileService.getProfile,
        enabled: !!customer,
        retry: (failureCount, error: any) => {
            // No reintentar en un 404, ya que es un estado esperado (perfil no creado)
            return error.response?.status !== 404 && failureCount < 2;
        },
    });

    // Reacciona al éxito de la carga de datos
    useEffect(() => {
        if (data) {
            setProfile(data);
        }
    }, [data]);

    // Reacciona a los errores
    useEffect(() => {
        if (isError && error) {
            const anyError = error as any;
            if (anyError.response && anyError.response.status === 404) {
                // Si el perfil no existe, lo inicializamos
                setProfile({
                    fullName: customer?.name || '', phone: '', documentType: 'CC', documentNumber: '',
                    isBusiness: false, businessName: '', businessTaxId: '',
                });
            } else {
                addNotification(`Error al cargar el perfil: ${anyError.message}`, 'error');
            }
        }
    }, [isError, error, customer, addNotification]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target;
        const isCheckbox = type === 'checkbox';

        setProfile(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
            };
        });
    };

    const saveMutation = useMutation({
        mutationFn: (payload: CustomerProfileUpdateData) => customerProfileService.createOrUpdateProfile(payload),
        onSuccess: () => {
            addNotification('Datos guardados con éxito', 'success');
            queryClient.invalidateQueries({queryKey: ['customerProfile']});
        },
        onError: (error: any) => {
            addNotification(`Error al guardar: ${error.message}`, 'error');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        saveMutation.mutate(profile);
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner/></div>;
    }

    if (isError && (error as any).response?.status !== 404) {
        return <div className="text-center p-8 text-red-500">Error: {(error as Error).message}</div>;
    }

    if (!profile) {
        return <div className="text-center p-8 text-[var(--color-foreground)]/60">Cargando perfil...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-[var(--color-card)] text-[var(--color-foreground)] p-8 rounded-lg shadow-sm border border-[var(--color-border)] max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Tus Datos Personales y de Facturación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 3. Campo de correo (no editable) */}
                <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-foreground)]/80">Correo
                        Electrónico</label>
                    <input type="email" name="email" id="email" value={customer?.email || ''} disabled
                           className="mt-1 block w-full rounded-md border-[var(--color-border)] shadow-sm bg-[var(--color-muted)]/50 cursor-not-allowed p-2.5"/>
                </div>
                {/* Campos del formulario */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre
                        Completo</label>
                    <input type="text" name="fullName" id="fullName" value={profile.fullName} onChange={handleChange}
                           required
                           className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-primary focus:ring-primary p-2.5"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-foreground)]/80">Teléfono</label>
                    <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleChange}
                           className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-primary focus:ring-primary p-2.5"/>
                </div>
                <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-[var(--color-foreground)]/80">Tipo de
                        Documento</label>
                    <select name="documentType" id="documentType" value={profile.documentType || 'CC'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-primary focus:ring-primary p-2.5">
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="NIT">NIT</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PPT">PPT</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="documentNumber" className="block text-sm font-medium text-[var(--color-foreground)]/80">Número de
                        Documento</label>
                    <input type="text" name="documentNumber" id="documentNumber" value={profile.documentNumber || ''}
                           onChange={handleChange}
                           className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm focus:border-primary focus:ring-primary p-2.5"/>
                </div>
            </div>
            <div className="mt-6">
                <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    );
};