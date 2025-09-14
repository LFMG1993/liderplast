import {useEffect, useState} from 'react';
import {attributeService} from '../services/attributeService';
import type {Attribute} from "../types";
import {useNotification} from '../providers/NotificationProvider';
import {Button} from '../components/general/Button';
import {ConfirmationModal} from '../components/general/ConfirmationModal';
import {Plus} from 'lucide-react';
import {AttributeCard} from '../components/attributes/AttributeCard';
import {AttributeForm} from "../components/attributes/AttributeForm.tsx";

const AttributesPage = () => {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {showNotification} = useNotification();

    // Estados para los modales
    const [isAttributeModalOpen, setIsAttributeModalOpen] = useState(false);
    const [isValueModalOpen, setIsValueModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [deletingAttribute, setDeletingAttribute] = useState<Attribute | null>(null);
    const [addingValueTo, setAddingValueTo] = useState<Attribute | null>(null);
    const [formValue, setFormValue] = useState('');

    const fetchAttributes = async () => {
        try {
            setIsLoading(true);
            const data = await attributeService.getAttributesWithValues();
            setAttributes(data);
        } catch (err: any) {
            showNotification({message: err.message, type: 'error'});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const handleSaveAttribute = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingAttribute?.id) {
                await attributeService.updateAttribute(editingAttribute.id, {name: formValue});
            } else {
                await attributeService.createAttribute({name: formValue});
            }
            showNotification({message: 'Atributo guardado con éxito.', type: 'success'});
            closeAttributeModal();
            setFormValue('');
            await fetchAttributes();
        } catch (err: any) {
            showNotification({message: err.message, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveValue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingValueTo) return;
        setIsSubmitting(true);
        try {
            await attributeService.createAttributeValue({attributeId: addingValueTo.id, value: formValue});
            showNotification({message: 'Valor añadido con éxito.', type: 'success'});
            closeAttributeModal();
            setFormValue('');
            await fetchAttributes();
        } catch (err: any) {
            showNotification({message: err.message, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };
// ✅ MEJORA: Se añade la lógica de borrado que faltaba.
    // Esto hace que el `ConfirmationModal` y el estado `deletingAttribute` se usen.
    const handleConfirmDelete = async () => {
        if (!deletingAttribute) return;
        try {
            await attributeService.deleteAttribute(deletingAttribute.id);
            showNotification({message: 'Atributo eliminado con éxito.', type: 'success'});
            setDeletingAttribute(null);
            await fetchAttributes();
        } catch (err: any) {
            showNotification({message: err.message, type: 'error'});
            setDeletingAttribute(null);
        }
    };

    // --- Funciones para controlar los modales ---

    // ✅ MEJORA: Se definen las funciones que faltaban para cerrar los modales.
    // Cada función se encarga de restablecer el estado específico de su modal.
    const closeAttributeModal = () => {
        setIsAttributeModalOpen(false);
        setEditingAttribute(null);
    };

    const closeValueModal = () => {
        setIsValueModalOpen(false);
        setAddingValueTo(null);
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
                <h1 className="text-3xl font-bold">Gestión de Atributos</h1>
                <Button onClick={openNewAttributeModal}><Plus className="h-4 w-4 mr-2"/>Crear Atributo</Button>
            </div>

            {isLoading && <p>Cargando...</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!isLoading && attributes.map(attr => (
                    <AttributeCard key={attr.id} attribute={attr} onEdit={openEditAttributeModal}
                                   onDelete={setDeletingAttribute} onAddValue={openValueModal}/>
                ))}
            </div>

            {/* Modal para Atributos */}
            <AttributeForm title={editingAttribute ? 'Editar Atributo' : 'Crear Atributo'}
                           isOpen={isAttributeModalOpen} onClose={closeAttributeModal}
                           onSubmit={handleSaveAttribute} isSubmitting={isSubmitting}>
                <label htmlFor="attributeName" className="block text-sm font-medium text-gray-700">Nombre del
                    Atributo</label>
                <input type="text" id="attributeName" value={formValue} onChange={(e) => setFormValue(e.target.value)}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5" required/>
            </AttributeForm>

            {/* Modal para Valores de Atributos */}
            <AttributeForm title={`Añadir valor a "${addingValueTo?.name}"`} isOpen={isValueModalOpen}
                           onClose={closeValueModal} onSubmit={handleSaveValue}
                           isSubmitting={isSubmitting}>
                <label htmlFor="valueName" className="block text-sm font-medium text-gray-700">Nuevo Valor</label>
                <input type="text" id="valueName" value={formValue} onChange={(e) => setFormValue(e.target.value)}
                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 p-2.5" required/>
            </AttributeForm>

            {/* Modal de Confirmación para eliminar */}
            <ConfirmationModal
                isOpen={!!deletingAttribute}
                onClose={() => setDeletingAttribute(null)}
                title="Confirmar Eliminación"
            >
                <p>¿Estás seguro de que deseas eliminar el atributo <strong>"{deletingAttribute?.name}"</strong>?</p>
                <p className="text-sm text-gray-500 mt-2">Esta acción también eliminará todos sus valores asociados y no
                    se puede deshacer.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setDeletingAttribute(null)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Eliminar</Button>
                </div>
            </ConfirmationModal>
        </div>
    );
};

export default AttributesPage;