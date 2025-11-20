import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {attributeService} from '../../services/attributeService.ts';
import type {Attribute, AttributeValue} from "../../types";
import {useNotification} from '../../context/NotificationContext.tsx';
import {Button} from '../../components/general/Button.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {Plus} from 'lucide-react';
import {AttributeCard} from '../../components/attributes/AttributeCard.tsx';
import {AttributeForm} from "../../components/attributes/AttributeForm.tsx";
import {Spinner} from "../../components/general/Spinner.tsx";

const AttributesPage = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    // Estados para los modales
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
    const [isValueModalOpen, setIsValueModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [deletingAttribute, setDeletingAttribute] = useState<Attribute | null>(null);
    const [deletingValue, setDeletingValue] = useState<{ attribute: Attribute, value: AttributeValue } | null>(null);
    const [addingValueTo, setAddingValueTo] = useState<Attribute | null>(null);
    const [formValue, setFormValue] = useState('');

    const {data: attributes = [], isLoading, isError, error} = useQuery<Attribute[], Error>({
        queryKey: ['attributes'],
        queryFn: attributeService.getAttributesWithValues,
    });

    const saveAttributeMutation = useMutation({
        mutationFn: (data: { name: string, id?: number }) =>
            data.id
                ? attributeService.updateAttribute(data.id, {name: data.name})
                : attributeService.createAttribute({name: data.name}),
        onSuccess: (_, variables) => {
            addNotification(`Atributo ${variables.id ? 'actualizado' : 'creado'} con éxito.`, 'success');
            queryClient.invalidateQueries({queryKey: ['attributes']});
            closeAttributeModal();
        },
        onError: (err: Error) => addNotification(`Error: ${err.message}`, 'error'),
    });

    const saveValueMutation = useMutation({
        mutationFn: (data: { attributeId: number, value: string }) =>
            attributeService.createAttributeValue(data),
        onSuccess: () => {
            addNotification('Valor añadido con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['attributes']});
            closeValueModal();
        },
        onError: (err: Error) => addNotification(`Error: ${err.message}`, 'error'),
    });

    const deleteAttributeMutation = useMutation({
        mutationFn: (id: number) => attributeService.deleteAttribute(id),
        onSuccess: () => {
            addNotification('Atributo eliminado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['attributes']});
            setDeletingAttribute(null);
        },
        onError: (err: Error) => addNotification(`Error: ${err.message}`, 'error'),
    });

    const deleteValueMutation = useMutation({
        mutationFn: (data: { attributeId: number, valueId: number }) =>
            attributeService.deleteAttributeValue(data.attributeId, data.valueId),
        onSuccess: () => {
            addNotification('Valor eliminado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['attributes']});
            setDeletingValue(null);
        },
        onError: (err: Error) => addNotification(`Error: ${err.message}`, 'error'),
    });

    const handleSaveAttribute = (e: React.FormEvent) => {
        e.preventDefault();
        saveAttributeMutation.mutate({name: formValue, id: editingAttribute?.id});
    };

    const handleSaveValue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingValueTo) return;
        saveValueMutation.mutate({attributeId: addingValueTo.id, value: formValue});
    };

    const handleConfirmDeleteAttribute = () => {
        if (deletingAttribute) {
            deleteAttributeMutation.mutate(deletingAttribute.id);
        }
    };

    const handleConfirmDeleteValue = () => {
        if (deletingValue) {
            deleteValueMutation.mutate({
                attributeId: deletingValue.attribute.id,
                valueId: deletingValue.value.id
            });
        }
    };

    // --- Funciones para controlar los modales ---
    const closeAttributeModal = () => {
        setIsAttributeModalOpen(false);
        setEditingAttribute(null);
        setFormValue('');
    };

    const closeValueModal = () => {
        setIsValueModalOpen(false);
        setAddingValueTo(null);
        setFormValue('');
    };

    const openNewAttributeModal = () => {
        setEditingAttribute(null);
        setFormValue('');
        setIsAttributeModalOpen(true);
    };

    const openEditAttributeModal = (attr: Attribute) => {
        setEditingAttribute(attr);
        setFormValue(attr.name);
        setIsAttributeModalOpen(true);
    };

    const openValueModal = (attr: Attribute) => {
        setAddingValueTo(attr);
        setFormValue('');
        setIsValueModalOpen(true);
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Gestión de Atributos</h1>
                <Button onClick={openNewAttributeModal}><Plus className="h-4 w-4 mr-2"/>Crear Atributo</Button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            )}
            {isError && <p className="text-red-500 text-center">Error al cargar atributos: {error.message}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isLoading && attributes.map(attr => (
                    <AttributeCard
                        key={attr.id}
                        attribute={attr}
                        onEdit={openEditAttributeModal}
                        onDelete={setDeletingAttribute}
                        onAddValue={openValueModal}
                        onDeleteValue={(value) => setDeletingValue({attribute: attr, value})}
                    />
                ))}
            </div>

            {/* Modal para Atributos */}
            <AttributeForm title={editingAttribute ? 'Editar Atributo' : 'Crear Atributo'}
                           isOpen={isAttributeModalOpen} onClose={closeAttributeModal}
                           onSubmit={handleSaveAttribute} isSubmitting={saveAttributeMutation.isPending}>
                <label htmlFor="attributeName" className="block text-sm font-medium text-[var(--color-foreground)]/80">Nombre
                    del
                    Atributo</label>
                <input type="text" id="attributeName" value={formValue}
                       onChange={(e) => setFormValue(e.target.value)}
                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary p-2.5"
                       required/>
            </AttributeForm>

            {/* Modal para Valores de Atributos */}
            <AttributeForm title={`Añadir valor a "${addingValueTo?.name}"`} isOpen={isValueModalOpen}
                           onClose={closeValueModal} onSubmit={handleSaveValue}
                           isSubmitting={saveValueMutation.isPending}>
                <label htmlFor="valueName" className="block text-sm font-medium text-[var(--color-foreground)]/80">Nuevo
                    Valor</label>
                <input type="text" id="valueName" value={formValue}
                       onChange={(e) => setFormValue(e.target.value)}
                       className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary p-2.5"
                       required/>
            </AttributeForm>

            {/* Modal de Confirmación para eliminar Atributo */}
            <ConfirmationModal
                isOpen={!!deletingAttribute}
                onClose={() => setDeletingAttribute(null)}
                onConfirm={handleConfirmDeleteAttribute}
                isConfirming={deleteAttributeMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el atributo "${deletingAttribute?.name}"? Esta acción también eliminará todos sus valores asociados y no se puede deshacer.`}
            />

            {/* Modal de Confirmación para eliminar Valor */}
            <ConfirmationModal
                isOpen={!!deletingValue}
                onClose={() => setDeletingValue(null)}
                onConfirm={handleConfirmDeleteValue}
                isConfirming={deleteValueMutation.isPending}
                title="Confirmar Eliminación de Valor"
                message={`¿Estás seguro de que deseas eliminar el valor "${deletingValue?.value.value}" del atributo "${deletingValue?.attribute.name}"?`}
            />
        </div>
    );
};

export default AttributesPage;