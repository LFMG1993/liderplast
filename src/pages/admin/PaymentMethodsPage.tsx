import {paymentMethodService} from '../../services/paymentMethodService';
import {Spinner} from '../../components/general/Spinner';
import {useState, useEffect, useCallback} from 'react';
import {Button} from '../../components/general/Button';
import {PlusCircle} from 'lucide-react';
import {PaymentMethodsTable} from "../../components/paymentMethods/PaymentMethodsTable.tsx";
import type {PaymentMethod, PaymentMethodCreationData, PaymentMethodUpdateData} from "../../types";
import {useNotification} from "../../providers/NotificationProvider.tsx";
import {PaymentMethodForm} from "../../components/paymentMethods/PaymentMethodForm.tsx";
import {ConfirmationModal} from "../../components/general/ConfirmationModal.tsx";
import {uploadImage} from "../../services/imageService.ts";
import {slugify} from "../../utils/utils.ts";

export default function PaymentMethodsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);
    const {showNotification} = useNotification();

    const fetchData = useCallback(async () => {
            try {
                setIsLoading(true);
                const data = await paymentMethodService.listAdmin();
                setPaymentMethods(data);
            } catch (err: any) {
                showNotification({message: `Error al cargar métodos de pago: ${err.message}`, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        }, [showNotification]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenCreate = () => {
        setEditingMethod(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (method: PaymentMethod) => {
        setEditingMethod(method);
        setIsFormOpen(true);
    };

    const handleDelete = (method: PaymentMethod) => {
        setMethodToDelete(method);
    };

    const confirmDelete = async () => {
        if (methodToDelete) {
            try {
                await paymentMethodService.delete(methodToDelete.id);
                showNotification({message: 'Método de pago eliminado con éxito.', type: 'success'});
                setMethodToDelete(null);
                await fetchData(); // Recargar datos
            } catch (err: any) {
                showNotification({message: `Error al eliminar: ${err.message}`, type: 'error'});
            }
        }
    };

    const handleSave = async (data: PaymentMethodUpdateData & { id?: number | null },
                              imageFile: File | null
    ) => {
        setIsSubmitting(true);
        try {
            let finalData = {...data};
            delete finalData.id;

            // Si hay un archivo de imagen, lo subimos ANTES de llamar a la API para crear/actualizar.
            if (imageFile) {
                const nameForSlug = data.name || editingMethod?.name;
                if (!nameForSlug) throw new Error("No se pudo determinar un nombre para generar el slug de la imagen.");
                const slug = slugify(nameForSlug);
                const entityName = `payment-method/${slug}`;
                const imageUrl = await uploadImage(imageFile, entityName);
                // Añadimos la URL real al objeto que vamos a guardar.
                finalData.qrCodeUrl = imageUrl;
            } else if (data.qrCodeUrl === null && editingMethod) {
                // Si el usuario eliminó la imagen existente, nos aseguramos de que se guarde como null.
                finalData.qrCodeUrl = null;
            }

            if (editingMethod) {
                await paymentMethodService.update(editingMethod.id, finalData);
            } else {
                await paymentMethodService.create(finalData as PaymentMethodCreationData);
            }

            const successMessage = editingMethod ? 'Método actualizado con éxito.' : 'Método creado con éxito.';
            showNotification({message: successMessage, type: 'success'});
            setIsFormOpen(false);
            setEditingMethod(null);
            await fetchData(); // Recargar datos
        } catch (err: any) {
            showNotification({message: `Error al guardar: ${err.message}`, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Spinner/></div>;
    }
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold leading-6 text-gray-900">Métodos de Pago (QR)</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Gestiona los códigos QR y las instrucciones que verán tus clientes al pagar.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Button onClick={handleOpenCreate}>
                        <PlusCircle className="-ml-0.5 mr-1.5 h-5 w-5"/>
                        Nuevo Método
                    </Button>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {paymentMethods.length > 0 ? (
                            <PaymentMethodsTable methods={paymentMethods} onEdit={handleOpenEdit}
                                                 onDelete={handleDelete}/>
                        ) : <p className="text-center text-gray-500 py-8">No se han creado métodos de pago todavía.</p>}
                    </div>
                </div>
            </div>

            <PaymentMethodForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSave}
                methodToEdit={editingMethod}
                isSubmitting={isSubmitting}
            />

            <ConfirmationModal
                isOpen={!!methodToDelete}
                onClose={() => setMethodToDelete(null)}
                onConfirm={confirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el método "${methodToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}