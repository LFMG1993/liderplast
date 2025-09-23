import {useEffect, useState} from 'react';
import {categoryService} from '../../services/categoryService.ts';
import type {Category, CategoryCreationData, CategoryUpdateData} from "../../types";
import {useNotification} from '../../providers/NotificationProvider.tsx';
import {Button} from '../../components/general/Button.tsx';
import {CategoryTable} from '../../components/categories/CategoryTable.tsx';
import {CategoryForm} from '../../components/categories/CategoryForm.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {uploadImage} from '../../services/imageService.ts';
import {slugify} from "../../utils/utils.ts";
import {Spinner} from "../../components/general/Spinner.tsx";

const CategoriesPage = () => {
        const [categories, setCategories] = useState<Category[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState<string | null>(null);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isFormModalOpen, setIsFormModalOpen] = useState(false);
        const [editingCategory, setEditingCategory] = useState<Category | null>(null);
        const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
        const {showNotification} = useNotification();

        const fetchCategories = async () => {
            try {
                setIsLoading(true);
                const data = await categoryService.getCategories();
                setCategories(data);
            } catch (err: any) {
                setError(err.message);
                showNotification({message: err.message, type: 'error'});
            } finally {
                setIsLoading(false);
            }
        };

        useEffect(() => {
            fetchCategories();
        }, []);

        const handleEdit = (category: Category) => {
            setEditingCategory(category);
            setIsFormModalOpen(true);
        };
        const handleDelete = (category: Category) => {
            setCategoryToDelete(category);
        };

        const handleSave = async (
            data: CategoryUpdateData & { id?: number | null },
            imageFile: File | null
        ) => {
            setIsSubmitting(true);
            try {
                let savedCategory: Category;

                // --- PASO 1: Crear o actualizar la categoría SIN la imagen ---
                if ('id' in data && data.id) {
                    savedCategory = await categoryService.updateCategory(data.id, data);
                } else { // Es una creación
                    savedCategory = await categoryService.createCategory(data as CategoryCreationData);
                }

                // --- PASO 2: Si hay una imagen, subirla AHORA que tenemos el ID ---
                if (imageFile) {
                    // Esto genera URL de imagen más limpias y amigables para SEO.
                    const slug = slugify(savedCategory.name);
                    const entityName = `category/${slug}`;
                    const imageUrl = await uploadImage(imageFile, entityName);

                    // --- PASO 3: Hacer la segunda llamada para actualizar solo la URL de la imagen ---
                    await categoryService.updateCategory(savedCategory.id, {imageUrl});
                } else if (data.imageUrl === null && 'id' in data && data.id) {
                    // Si el usuario eliminó la imagen, nos aseguramos de que se guarde como null
                    await categoryService.updateCategory(savedCategory.id, {imageUrl: null});
                }

                // --- PASO 4: Notificar al usuario y actualizar la UI ---
                const successMessage = ('id' in data && data.id) ? 'Categoría actualizada con éxito.' : 'Categoría creada con éxito.';
                showNotification({message: successMessage, type: 'success'});
                setIsFormModalOpen(false); // Cierra el modal
                await fetchCategories();
            } catch (err: any) {
                console.error("Error al guardar la categoría:", err);
                const errorMessage = err.message || 'Ocurrió un error inesperado al guardar la categoría.';
                showNotification({message: errorMessage, type: 'error'});
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleConfirmDelete = async () => {
            if (!categoryToDelete) return;
            try {
                await categoryService.deleteCategory(categoryToDelete.id);
                showNotification({message: 'Categoría eliminada con éxito.', type: 'success'});
                setCategoryToDelete(null);
                await fetchCategories();
            } catch (err: any) {
                showNotification({message: err.message, type: 'error'});
            }
        };

        return (
            <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
                    <Button onClick={() => {
                        setEditingCategory(null);
                        setIsFormModalOpen(true);
                    }}>
                        Crear Categoría
                    </Button>
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-16">
                        <Spinner/>
                    </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && !error &&
                    <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete}/>}

                <CategoryForm
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSave={handleSave}
                    categoryToEdit={editingCategory}
                    allCategories={categories}
                    isSubmitting={isSubmitting}
                />

                {/* ✅ CORRECCIÓN: Se pasan las props 'message' y 'onConfirm' en lugar de 'children'. */}
                <ConfirmationModal
                    isOpen={!!categoryToDelete}
                    onClose={() => setCategoryToDelete(null)}
                    onConfirm={handleConfirmDelete}
                    title="Confirmar Eliminación"
                    message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Eliminar una categoría también eliminará todas sus subcategorías. Esta acción no se puede deshacer.`}
                />
            </div>
        );
    }
;

export default CategoriesPage;