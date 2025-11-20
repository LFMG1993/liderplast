import {useState, useMemo} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {createColumnHelper, getCoreRowModel, getExpandedRowModel, useReactTable} from '@tanstack/react-table';
import {categoryService} from '../../services/categoryService.ts';
import type {Category, CategoryCreationData, CategoryUpdateData} from "../../types";
import {useNotification} from "../../context/NotificationContext.tsx";
import {Button} from '../../components/general/Button.tsx';
import {CategoryTable} from '../../components/categories/CategoryTable.tsx';
import {CategoryForm} from '../../components/categories/CategoryForm.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {uploadImage} from '../../services/imageService.ts';
import {slugify} from "../../utils/utils.ts";
import {Spinner} from "../../components/general/Spinner.tsx";
import {ChevronDown, ChevronRight, Edit, ImageIcon, Trash2} from "lucide-react";

const columnHelper = createColumnHelper<Category>();
const CategoriesPage = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [expanded, setExpanded] = useState({});

    const {data: categories = [], isLoading, isError, error} = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: () => categoryService.getCategories(),
    });

    const saveMutation = useMutation({
        mutationFn: async ({data, imageFile}: {
            data: CategoryCreationData | CategoryUpdateData,
            imageFile: File | null
        }) => {
            let savedCategory: Category;
            const isUpdate = 'id' in data && data.id;

            if (isUpdate) {
                savedCategory = await categoryService.updateCategory((data as CategoryUpdateData & {
                    id: number
                }).id, data);
            } else {
                savedCategory = await categoryService.createCategory(data as CategoryCreationData);
            }

            if (imageFile) {
                const slug = slugify(savedCategory.name);
                const entityName = `category/${slug}-${savedCategory.id}`;
                const imageUrl = await uploadImage(imageFile, entityName);
                await categoryService.updateCategory(savedCategory.id, {imageUrl});
            } else if (isUpdate && data.imageUrl === null) {
                await categoryService.updateCategory(savedCategory.id, {imageUrl: null});
            }
        },
        onSuccess: (_, {data}) => {
            const message = ('id' in data && data.id) ? 'Categoría actualizada con éxito.' : 'Categoría creada con éxito.';
            addNotification(message, 'success');
            queryClient.invalidateQueries({queryKey: ['categories']});
            setIsFormModalOpen(false);
        },
        onError: (err: Error) => {
            addNotification(`Error al guardar: ${err.message}`, 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => categoryService.deleteCategory(id),
        onSuccess: () => {
            addNotification('Categoría eliminada con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['categories']});
            setCategoryToDelete(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al eliminar: ${err.message}`, 'error');
        },
    });

    const handleSave = (data: CategoryCreationData | CategoryUpdateData, imageFile: File | null) => {
        saveMutation.mutate({data, imageFile});
    };

    const handleConfirmDelete = () => {
        if (categoryToDelete) {
            deleteMutation.mutate(categoryToDelete.id);
        }
    };

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Nombre',
            cell: ({row, getValue}) => (
                <div style={{paddingLeft: `${row.depth * 1.5}rem`}} className="flex items-center gap-2">
                    {row.getCanExpand() ? (
                        <button {...{onClick: row.getToggleExpandedHandler()}}
                                className="cursor-pointer p-1 rounded-md hover:bg-gray-200">
                            {row.getIsExpanded() ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                        </button>
                    ) : (
                        <span className="w-8 inline-block"/> // Espaciador para alinear
                    )}
                    <span>{getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('description', {
            header: 'Descripción',
            cell: info => <span className="line-clamp-2">{info.getValue()}</span>
        }),
        columnHelper.accessor('imageUrl', {
            header: 'Imagen',
            size: 100,
            cell: ({row}) => (
                <div className="flex items-center">
                    {row.original.imageUrl ? (
                        <img src={row.original.imageUrl} alt={`Imagen de ${row.original.name}`}
                             className="w-12 h-12 object-cover rounded-md bg-gray-100"/>
                    ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md">
                            <ImageIcon className="h-6 w-6 text-gray-400"/>
                        </div>
                    )}
                </div>
            )
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-end">Acciones</div>,
            size: 120,
            cell: ({row}) => (
                <div className="flex justify-end items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => {
                        setEditingCategory(row.original);
                        setIsFormModalOpen(true);
                    }}><Edit className="h-4 w-4"/></Button>
                    <Button size="sm" variant="danger" onClick={() => setCategoryToDelete(row.original)}>
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>
            ),
        }),
    ], []);

    const table = useReactTable({
        data: categories,
        columns,
        state: {expanded},
        onExpandedChange: setExpanded,
        getSubRows: row => row.children,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

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

            {isLoading && <div className="flex justify-center items-center py-16"><Spinner/></div>}
            {isError && <p className="text-red-500">Error: {error?.message}</p>}
            {!isLoading && !isError && <CategoryTable table={table}/>}

            <CategoryForm
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSave}
                categoryToEdit={editingCategory}
                allCategories={categories}
                isSubmitting={saveMutation.isPending}
            />

            <ConfirmationModal
                isOpen={!!categoryToDelete}
                onClose={() => setCategoryToDelete(null)}
                onConfirm={handleConfirmDelete}
                isConfirming={deleteMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar la categoría "${categoryToDelete?.name}"? Eliminar una categoría también eliminará todas sus subcategorías. Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default CategoriesPage;