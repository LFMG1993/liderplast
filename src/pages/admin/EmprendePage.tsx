import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import type { PaginationState, SortingState } from "@tanstack/react-table";
import { emprendePostService } from '../../services/emprendePostService.ts';
import type { PaginatedResponse, Product, EmprendePost, EmprendePostCreationData, EmprendePostUpdateData } from '../../types';
import { Button } from '../../components/general/Button.tsx';
import { ConfirmationModal } from '../../components/general/ConfirmationModal.tsx';
import { Spinner } from "../../components/general/Spinner.tsx";
import { useNotification } from "../../context/NotificationContext.tsx";
import { EmprendeTable } from "../../components/emprende/EmprendeTable.tsx";
import { EmprendeForm } from "../../components/emprende/EmprendeForm.tsx";
import { productService } from "../../services/productService.ts";

export default function EmprendePage() {
    const queryClient = useQueryClient();
    const { addNotification } = useNotification();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<EmprendePost | null>(null);
    const [postToDelete, setPostToDelete] = useState<EmprendePost | null>(null);

    // --- Estados para TanStack Table ---
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilter(globalFilter), 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Query para los posts
    const { data: postsData, isLoading: isLoadingPosts } = useQuery<PaginatedResponse<EmprendePost>, Error>({
        queryKey: ['emprendePosts', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => emprendePostService.listAdmin({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
        }),
        placeholderData: keepPreviousData,
    });

    // Query para obtener todos los productos para el formulario
    const { data: allProducts = [] } = useQuery<Product[], Error>({
        queryKey: ['allProductsForEmprendeForm'],
        queryFn: () => productService.getProducts({ page: 1, limit: 9999 }).then(res => res.data),
        staleTime: Infinity,
    });

    const posts = useMemo(() => postsData?.data ?? [], [postsData]);
    const pageCount = useMemo(() => postsData?.pageCount ?? -1, [postsData]);

    const handleOpenEdit = async (post: EmprendePost) => {
        // Obtenemos la versión completa del post con los productos para el formulario
        const fullPost = await emprendePostService.getById(post.id);
        setEditingPost(fullPost);
        setIsFormOpen(true);
    };

    const saveMutation = useMutation({
        mutationFn: async ({ data, id }: { data: EmprendePostCreationData | EmprendePostUpdateData, id?: number }) => {
            if (id) {
                await emprendePostService.update(id, data);
                return emprendePostService.getById(id);
            }
            return emprendePostService.create(data as EmprendePostCreationData);
        },
        onSuccess: (_, { id }) => {
            addNotification(`Post ${id ? 'actualizado' : 'creado'} con éxito.`, 'success');
            queryClient.invalidateQueries({ queryKey: ['emprendePosts'] });
            setIsFormOpen(false);
        },
        onError: (err: Error) => {
            addNotification(`Error al guardar el post: ${err.message}`, 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => emprendePostService.delete(id),
        onSuccess: () => {
            addNotification('Post eliminado con éxito.', 'success');
            queryClient.invalidateQueries({ queryKey: ['emprendePosts'] });
            setPostToDelete(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al eliminar el post: ${err.message}`, 'error');
        }
    });

    const isLoading = isLoadingPosts && postsData === undefined;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Gestionar "Emprende"</h1>
                <Button onClick={() => { setEditingPost(null); setIsFormOpen(true); }}>Crear Post</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16"><Spinner /></div>
            ) : (
                <EmprendeTable
                    posts={posts}
                    onEdit={handleOpenEdit}
                    onDelete={setPostToDelete}
                    pagination={{ pageIndex, pageSize }}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}

            <EmprendeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={(data) => saveMutation.mutate({ data, id: editingPost?.id })}
                postToEdit={editingPost}
                allProducts={allProducts}
                isSubmitting={saveMutation.isPending}
            />

            <ConfirmationModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={() => postToDelete && deleteMutation.mutate(postToDelete.id)}
                isConfirming={deleteMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el post "${postToDelete?.title}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}