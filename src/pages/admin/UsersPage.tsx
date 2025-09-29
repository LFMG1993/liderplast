import {useState, useEffect, useCallback} from 'react';
import {userService} from '../../services/userService.ts';
import type {User, UserCreationData} from '../../types'
import {UserTable} from '../../components/users/UserTable.tsx';
import {UserForm} from '../../components/users/UserForm.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {Button} from '../../components/general/Button.tsx';
import {PlusCircle} from 'lucide-react';
import {useNotification} from "../../context/NotificationContext.tsx";
import {Spinner} from "../../components/general/Spinner.tsx";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const {addNotification} = useNotification();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los usuarios.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenCreateModal = () => {
        setUserToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setUserToEdit(user);
        setIsFormOpen(true);
    };

    const handleCloseModal = () => {
        setIsFormOpen(false);
        setUserToEdit(null);
    };

    const handleDelete = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        try {
            await userService.deleteUser(userToDelete.id);
            addNotification('Usuario eliminado con éxito', 'success');
            setUserToDelete(null);
            fetchUsers(); // Recargar la lista
        } catch (err: any) {
            addNotification(err.message || 'Error al eliminar el usuario.', 'error');
        }
    };

    const handleFormSubmit = async (data: UserCreationData) => {
        try {
            if (userToEdit) {
                await userService.updateUser(userToEdit.id, data);
                addNotification('Usuario actualizado con éxito', 'success');
            } else {
                await userService.createUser(data);
                addNotification('Usuario creado con éxito', 'success');
            }
            handleCloseModal();
            fetchUsers(); // Recargar la lista
        } catch (err: any) {
            // Idealmente, mostrar este error en el formulario
            addNotification(err.message || 'Error al guardar el usuario.', 'error');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Usuarios</h1>
                    <p className="mt-2 text-sm text-gray-700">Una lista de todos los usuarios en el sistema.</p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Button onClick={handleOpenCreateModal}><PlusCircle className="mr-2 h-5 w-5"/>Crear Usuario</Button>
                </div>
            </div>
            <div className="mt-8">
                {isLoading && <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error &&
                    <UserTable users={users} onEdit={handleOpenEditModal} onDelete={handleDelete}/>}
            </div>
            <UserForm
                isOpen={isFormOpen}
                onClose={handleCloseModal}
                onSubmit={handleFormSubmit}
                userToEdit={userToEdit}
            />
            <ConfirmationModal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}