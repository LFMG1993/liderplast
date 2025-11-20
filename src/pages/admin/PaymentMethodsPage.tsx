import {paymentMethodService} from '../../services/paymentMethodService';
import {Spinner} from '../../components/general/Spinner';
import {useState, useEffect, useMemo} from 'react';
import {Button} from '../../components/general/Button';
import {PlusCircle} from 'lucide-react';
import {PaymentMethodsTable} from "../../components/paymentMethods/PaymentMethodsTable.tsx";
import type {PaymentMethod, PaymentMethodCreationData, PaymentMethodUpdateData, PaginatedResponse} from "../../types";
import {useNotification} from "../../context/NotificationContext.tsx";
import {PaymentMethodForm} from "../../components/paymentMethods/PaymentMethodForm.tsx";
import {ConfirmationModal} from "../../components/general/ConfirmationModal.tsx";
import {uploadImage} from "../../services/imageService.ts";
import {slugify} from "../../utils/utils.ts";
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";

export default function PaymentMethodsPage() {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [methodToDelete, setMethodToDelete] = useState<PaymentMethod | null>(null);

    // --- Estados para TanStack Table ---
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedFilter(globalFilter), 500);
        return () => clearTimeout(timer);
    }, [globalFilter]);

    const {
        data: methodsData,
        isLoading: isLoadingMethods,
        isError,
        error
    } = useQuery<PaginatedResponse<PaymentMethod>, Error>({
        queryKey: ['paymentMethods', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => paymentMethodService.listAdmin({
            page: pageIndex + 1,
            pageSize: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
        }),
        placeholderData: keepPreviousData,
    });

    const paymentMethods = useMemo(() => methodsData?.data ?? [], [methodsData]);
    const pageCount = useMemo(() => methodsData?.pageCount ?? -1, [methodsData]);

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

    const saveMutation = useMutation({
        mutationFn: async ({data, imageFile}: {
            data: PaymentMethodUpdateData & { id?: number | null },
            imageFile: File | null
        }) => {
            let finalData = {...data};
            delete finalData.id;

            if (imageFile) {
                const nameForSlug = data.name || editingMethod?.name;
                if (!nameForSlug) throw new Error("No se pudo determinar un nombre para generar el slug de la imagen.");
                const slug = slugify(nameForSlug);
                const entityName = `payment-method/${slug}`;
                const imageUrl = await uploadImage(imageFile, entityName);
                finalData.qrCodeUrl = imageUrl;
            } else if (data.qrCodeUrl === null && editingMethod) {
                finalData.qrCodeUrl = null;
            }

            if (editingMethod) {
                return paymentMethodService.update(editingMethod.id, finalData);
            } else {
                return paymentMethodService.create(finalData as PaymentMethodCreationData);
            }
        },
        onSuccess: () => {
            const successMessage = editingMethod ? 'Método actualizado con éxito.' : 'Método creado con éxito.';
            addNotification(successMessage, 'success');
            queryClient.invalidateQueries({queryKey: ['paymentMethods']});
            setIsFormOpen(false);
            setEditingMethod(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al guardar: ${err.message}`, 'error');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => paymentMethodService.delete(id),
        onSuccess: () => {
            addNotification('Método de pago eliminado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['paymentMethods']});
            setMethodToDelete(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al eliminar: ${err.message}`, 'error');
        }
    });

    const confirmDelete = () => {
        if (methodToDelete) {
            deleteMutation.mutate(methodToDelete.id);
        }
    };

    const handleSave = (data: PaymentMethodUpdateData & { id?: number | null }, imageFile: File | null) => {
        saveMutation.mutate({data, imageFile});
    };

    const isLoading = isLoadingMethods && methodsData === undefined;

    if (isLoading) {
        return <div className="flex justify-center items-center p-8"><Spinner/></div>;
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Métodos de Pago (QR)</h1>
                    <p className="mt-2 text-sm text-[var(--color-foreground)]/80">
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
                    <div className="inline-block min-w-full py-2 align-middle">
                        {isError ? (
                            <p className="text-red-500 text-center">Error: {error.message}</p>
                        ) : (
                            <PaymentMethodsTable
                                methods={paymentMethods}
                                onEdit={handleOpenEdit}
                                onDelete={handleDelete}
                                pagination={{pageIndex, pageSize}}
                                setPagination={setPagination}
                                sorting={sorting}
                                setSorting={setSorting}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                pageCount={pageCount}/>
                        )}
                    </div>
                </div>
            </div>

            <PaymentMethodForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSave}
                methodToEdit={editingMethod}
                isSubmitting={saveMutation.isPending}
            />

            <ConfirmationModal
                isOpen={!!methodToDelete}
                onClose={() => setMethodToDelete(null)}
                onConfirm={confirmDelete}
                isConfirming={deleteMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el método "${methodToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
}