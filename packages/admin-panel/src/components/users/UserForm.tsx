import { useState, useEffect } from 'react';
import type { User, UserCreationData } from '../../services/userService';
import { Button } from '../general/Button';

interface UserFormProps {
    userToEdit?: User | null;
    onSubmit: (data: UserCreationData) => void;
    onCancel: () => void;
}

export function UserForm({ userToEdit, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<UserCreationData>({
        nombre: '',
        email: '',
        password: '',
        rol: 'user',
    });

    const isEditMode = !!userToEdit;

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                nombre: userToEdit.nombre,
                email: userToEdit.email,
                rol: userToEdit.rol,
                password: '', // La contraseña no se precarga por seguridad
            });
        }
    }, [userToEdit, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = { ...formData };
        if (isEditMode) {
            // No enviar la contraseña si no se ha cambiado en modo edición
            if (!dataToSubmit.password) {
                delete dataToSubmit.password;
            }
        }
        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 text-gray-900" />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 text-gray-900" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">{isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
                <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} required={!isEditMode} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 text-gray-900" />
            </div>
            <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                <select name="rol" id="rol" value={formData.rol} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 text-gray-900">
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">{isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}</Button>
            </div>
        </form>
    );
}