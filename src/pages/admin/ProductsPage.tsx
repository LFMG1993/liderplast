import {useState, useMemo, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient, keepPreviousData} from '@tanstack/react-query';
import type {PaginationState, SortingState} from "@tanstack/react-table";
import {productService} from '../../services/productService.ts';
import type {Product, ProductCreationData, PaginatedResponse} from '../../types';
import {Button} from '../../components/general/Button.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {ProductTable} from '../../components/products/ProductTable.tsx';
import {useNotification} from '../../context/NotificationContext.tsx';
import {ProductForm, type ProductFormData, createInitialProductState} from '../../components/products/ProductForm.tsx';
import {attributeService} from "../../services/attributeService.ts";
import {categoryService} from "../../services/categoryService.ts";
import type {Attribute, Category} from "../../types";
import {uploadImage} from "../../services/imageService.ts";
import {slugify} from "../../utils/utils.ts";
import {Spinner} from "../../components/general/Spinner.tsx";

const ProductsPage = () => {
    const queryClient = useQueryClient();
    const {addNotification} = useNotification();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<ProductFormData>(createInitialProductState);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    // Estados para las tablas
    const [{pageIndex, pageSize}, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [debouncedFilter, setDebouncedFilter] = useState('');

    // Debounce para el filtro de búsqueda
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilter(globalFilter);
        }, 500); // Espera 500ms después de que el usuario deja de escribir
        return () => clearTimeout(timer);
    }, [globalFilter]);

    // Query para productos paginados
    const {
        data: productsData,
        isLoading: isLoadingProducts,
        isError,
        error
    } = useQuery<PaginatedResponse<Product>, Error>({
        queryKey: ['products', pageIndex, pageSize, debouncedFilter, sorting],
        queryFn: () => productService.getProducts({
            page: pageIndex + 1,
            limit: pageSize,
            search: debouncedFilter,
            sortBy: sorting[0]?.id,
            sortOrder: sorting[0] ? (sorting[0].desc ? 'desc' : 'asc') : undefined,
        }),
        placeholderData: keepPreviousData,
    });

    // Queries para datos de soporte (atributos y categorías)
    const {data: attributes = []} = useQuery<Attribute[], Error>({
        queryKey: ['attributes'],
        queryFn: attributeService.getAttributesWithValues,
    });
    const {data: categories = []} = useQuery<Category[], Error>({
        queryKey: ['categories'],
        queryFn: categoryService.getCategories,
    });

    const products = useMemo(() => productsData?.data ?? [], [productsData]);
    const pageCount = useMemo(() => productsData?.pageCount ?? -1, [productsData]);

    const handleEdit = async (id: number) => {
        try {
            const productDetails = await productService.getProductById(id);
            // Pre-populamos el estado del formulario para edición.
            setFormData({
                name: productDetails.name,
                description: productDetails.description || '',
                categoryId: productDetails.category.id,
                isFeatured: productDetails.isFeatured,
                isActive: productDetails.isActive,
                image_url: productDetails.imageUrl || null,
                imageFile: null,
                variants: productDetails.variants.map(v => ({
                    ...v,
                    imageFile: null,
                    selectedAttributes: (v.variantValues ?? []).reduce((acc: Record<number, number>, vv) => {
                        if (vv.attributeValue && vv.attributeValue.attributeId) {
                            acc[vv.attributeValue.attributeId] = vv.attributeValue.id;
                        }
                        return acc;
                    }, {}),
                })),
            });
            setEditingProduct(productDetails);
            setIsFormModalOpen(true);
        } catch (err: any) {
            addNotification(`Error al cargar los detalles del producto: ${err.message}`, 'error');
        }
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
    };

    const saveProductMutation = useMutation({
        mutationFn: async (formData: ProductFormData) => {
            const slug = slugify(formData.name);
            const uploadPromises: Promise<string | null>[] = [];

            if (formData.imageFile) {
                const entityName = `product/${slug}-${editingProduct?.id || 'new'}`;
                uploadPromises.push(uploadImage(formData.imageFile, entityName));
            } else {
                uploadPromises.push(Promise.resolve(formData.image_url));
            }

            formData.variants.forEach((variant, index) => {
                if (variant.imageFile) {
                    const entityName = `product/${slug}/${variant.sku || `variant-${index}`}`;
                    uploadPromises.push(uploadImage(variant.imageFile, entityName));
                } else {
                    uploadPromises.push(Promise.resolve(variant.imageUrl || null));
                }
            });

            const [mainImageUrl, ...variantImageUrls] = await Promise.all(uploadPromises);

            const finalPayload: ProductCreationData = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                isFeatured: formData.isFeatured,
                isActive: formData.isActive,
                imageUrl: mainImageUrl,
                variants: formData.variants.map((v, index) => {
                    const attributeValueIds = Object.values(v.selectedAttributes).filter(id => id && !isNaN(id));
                    return {
                        id: v.id,
                        sku: v.sku,
                        price: Number(v.price),
                        stock: Number(v.stock),
                        salePrice: v.salePrice === null ? undefined : v.salePrice,
                        imageUrl: variantImageUrls[index],
                        isActive: v.isActive,
                        unitOfMeasure: v.unitOfMeasure,
                        unitsPerItem: v.unitsPerItem,
                        volumeDiscounts: v.volumeDiscounts,
                        attributeValueIds: attributeValueIds,
                    };
                }),
            };

            if (editingProduct) {
                return productService.updateProduct(editingProduct.id, finalPayload);
            } else {
                return productService.createProduct(finalPayload);
            }
        },

        onSuccess: () => {
            const successMessage = editingProduct ? 'Producto actualizado.' : 'Producto creado.';
            addNotification(successMessage, 'success');
            queryClient.invalidateQueries({queryKey: ['products']});
            setIsFormModalOpen(false);
            setEditingProduct(null);
        },
        onError: (err: any) => {
            const errorInfo = err.info?.errors ? Object.values(err.info.errors).flat().join(', ') : err.message;
            const finalMessage = `Error al guardar: ${errorInfo || 'Error desconocido.'}`;
            addNotification(finalMessage, 'error');
        }
    });

    const deleteProductMutation = useMutation({
        mutationFn: (id: number) => productService.deleteProduct(id),
        onSuccess: () => {
            addNotification('Producto eliminado con éxito.', 'success');
            queryClient.invalidateQueries({queryKey: ['products']});
            setProductToDelete(null);
        },
        onError: (err: Error) => {
            addNotification(`Error al eliminar: ${err.message}`, 'error');
        }
    });

    const handleConfirmDelete = () => {
        if (productToDelete) {
            deleteProductMutation.mutate(productToDelete.id);
        }
    };

    const handleFormClose = () => {
        setIsFormModalOpen(false);
        setEditingProduct(null);
    };

    const isLoading = isLoadingProducts && productsData === undefined;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[var(--color-foreground)]">Gestión de Productos</h1>
                <Button onClick={() => {
                    setFormData(createInitialProductState);
                    setEditingProduct(null);
                    setIsFormModalOpen(true);
                }}>Crear Producto</Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            ) : isError ? (
                <p className="text-red-500 text-center">Error: {error.message}</p>
            ) : (
                <ProductTable
                    products={products}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={{pageIndex, pageSize}}
                    setPagination={setPagination}
                    sorting={sorting}
                    setSorting={setSorting}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    pageCount={pageCount}
                />
            )}

            <ProductForm
                isOpen={isFormModalOpen}
                onClose={handleFormClose}
                onSave={(formData) => saveProductMutation.mutate(formData)}
                productToEdit={editingProduct}
                attributes={attributes}
                categories={categories}
                isSubmitting={saveProductMutation.isPending}
                formData={formData}
                setFormData={setFormData}
            />

            <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDelete}
                isConfirming={deleteProductMutation.isPending}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ProductsPage;