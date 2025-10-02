import {useEffect, useState} from 'react';
import {customerProfileService} from '../../services/customerProfileService';
import type {CustomerProfileUpdateData} from '../../types';
import {useNotification} from '../../providers/NotificationProvider';
import {Spinner} from '../general/Spinner';
import {Button} from '../general/Button';
import {useUserAuth} from "../../context/UserAuthContext.tsx";

export const ProfileEditor = () => {
    const {customer} = useUserAuth();
    const [profile, setProfile] = useState<CustomerProfileUpdateData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const {showNotification} = useNotification();

    useEffect(() => {
        if (!customer) return;
        const fetchProfile = async () => {
            try {
                const data = await customerProfileService.getProfile();
                setProfile(data);
            } catch (error: any) {
                //  Manejo de error específico para 404.
                if (error.response && error.response.status === 404) {
                    // Si el perfil no existe, lo inicializamos con los datos del contexto.
                    setProfile({
                        fullName: customer.name || '', // Usamos el nombre del usuario como valor inicial.
                        phone: '',
                        documentType: 'CC',
                        documentNumber: '',
                        isBusiness: false,
                        businessName: '',
                        businessTaxId: '',
                    });
                } else {
                    showNotification({message: `Error al cargar el perfil: ${error.message}`, type: 'error'});
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [customer]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            const payload = (Object.keys(profile) as Array<keyof CustomerProfileUpdateData>).reduce((acc, key) => {
                const value = profile[key];
                // Solo incluimos valores que no sean null o una cadena vacía.
                if (value !== null && value !== '') {
                    acc[key] = value as any; // 'as any' aquí es seguro porque estamos reconstruyendo el objeto.
                }
                return acc;
            }, {} as Partial<CustomerProfileUpdateData>);

            await customerProfileService.createOrUpdateProfile(payload as CustomerProfileUpdateData);
            showNotification({message: 'Datos guardados con éxito', type: 'success'});
        } catch (error: any) {
            showNotification({message: `Error al guardar: ${error.message}`, type: 'error'});
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Spinner/></div>;
    }

    if (!profile) {
        return <div className="text-center p-8">No se pudo cargar el perfil.</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6">Tus Datos Personales y de Facturación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ✅ 3. Campo de correo (no editable) */}
                <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo
                        Electrónico</label>
                    <input type="email" name="email" id="email" value={customer?.email || ''} disabled
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"/>
                </div>
                {/* Campos del formulario */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre
                        Completo</label>
                    <input type="text" name="fullName" id="fullName" value={profile.fullName} onChange={handleChange}
                           required
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleChange}
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                </div>
                <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de
                        Documento</label>
                    <select name="documentType" id="documentType" value={profile.documentType || 'CC'}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary">
                        <option value="CC">Cédula de Ciudadanía</option>
                        <option value="NIT">NIT</option>
                        <option value="CE">Cédula de Extranjería</option>
                        <option value="PPT">PPT</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Número de
                        Documento</label>
                    <input type="text" name="documentNumber" id="documentNumber" value={profile.documentNumber || ''}
                           onChange={handleChange}
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                </div>
            </div>
            <div className="mt-6">
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </form>
    );
};