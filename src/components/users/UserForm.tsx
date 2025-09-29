import {useState, useEffect} from 'react';
import type {User, UserCreationData} from '../../types';
import {Button} from '../general/Button.tsx';
import {X} from 'lucide-react';

interface UserFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: UserCreationData) => void;
    userToEdit: User | null;
}

const initialState: UserCreationData = {
    nombre: '',
    email: '',
    password: '',
    rol: 'user', // ✅ MEJORA: Se estandariza el rol por defecto.
};

export const UserForm = ({isOpen, onClose, onSubmit, userToEdit}: UserFormProps) => {
    const [formData, setFormData] = useState<UserCreationData>({
        ...initialState
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
        } else {
            setFormData(initialState);
        }
    }, [userToEdit, isEditMode, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSubmit = {...formData};
        if (isEditMode) {
            // No enviar la contraseña si no se ha cambiado en modo edición
            if (!dataToSubmit.password) {
                delete dataToSubmit.password;
            }
        }
        onSubmit(dataToSubmit);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-lg font-medium text-gray-900">{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="h-6 w-6"/>
                        </button>
                    </div>

                    <div className="p-6 space-y-4 text-black">
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre
                                Completo</label>
                            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required/>
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña {isEditMode ? '(Dejar en blanco para no cambiar)' : ''}
                            </label>
                            <input type="password" name="password" id="password" value={formData.password || ''}
                                   onChange={handleChange}
                                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                   required={!isEditMode}/>
                        </div>
                        <div>
                            <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                            <select name="rol" id="rol" value={formData.rol} onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option value="ADMIN">Administrador</option>
                                <option value="VENDEDOR">Vendedor</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 p-6 border-t bg-gray-50 rounded-b-lg">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" variant="primary">
                            {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}