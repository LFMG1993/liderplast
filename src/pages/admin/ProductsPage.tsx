import {useEffect, useState} from 'react';
import {productService} from '../../services/productService.ts';
import type {Product, ProductCreationData} from '../../types';
import {Button} from '../../components/general/Button.tsx';
import {ConfirmationModal} from '../../components/general/ConfirmationModal.tsx';
import {ProductTable} from '../../components/products/ProductTable.tsx';
import {useNotification} from '../../providers/NotificationProvider.tsx';
import {ProductForm, type ProductFormData} from '../../components/products/ProductForm.tsx';
import {attributeService} from "../../services/attributeService.ts";
import {categoryService} from "../../services/categoryService.ts";
import type {Attribute, Category} from "../../types";
import {uploadImage} from "../../services/imageService.ts";
import {slugify} from "../../utils/utils.ts";
import {Spinner} from "../../components/general/Spinner.tsx";

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const {showNotification} = useNotification();

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [productsData, attributesData, categoriesData] = await Promise.all([
                productService.getProducts(),
                attributeService.getAttributesWithValues(),
                categoryService.getCategories()
            ]);
            setProducts(productsData);
            setAttributes(attributesData);
            setCategories(categoriesData);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los productos.');
            showNotification({message: err.message || 'Error al cargar los productos.', type: 'error'});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = async (id: number) => {
        // ✅ MEJORA: Hacemos la función asíncrona para obtener los datos completos del producto.
        try {
            setIsLoading(true); // Opcional: mostrar un indicador de carga
            // Obtenemos la versión detallada del producto, incluyendo `variantValues`.
            const productDetails = await productService.getProductById(id);
            setEditingProduct(productDetails);
            setIsFormModalOpen(true);
        } catch (err: any) {
            showNotification({message: `Error al cargar los detalles del producto: ${err.message}`, type: 'error'});
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
    };

    const handleSaveProduct = async (formData: ProductFormData) => {
        setIsSubmitting(true);
        try {
            // ✅ MEJORA: Lógica de subida de imágenes centralizada y transaccional.
            // 1. Subir todas las imágenes (principal y de variantes) en paralelo.
            const slug = slugify(formData.name);

            const uploadPromises: Promise<string | null>[] = [];

            // Promesa para la imagen principal
            if (formData.imageFile) {
                const entityName = `product/${slug}-${editingProduct?.id || 'new'}`;
                uploadPromises.push(uploadImage(formData.imageFile, entityName));
            } else {
                uploadPromises.push(Promise.resolve(formData.image_url));
            }

            // Promesas para las imágenes de las variantes
            formData.variants.forEach((variant, index) => {
                if (variant.imageFile) {
                    const entityName = `product/${slug}/${variant.sku || `variant-${index}`}`;
                    uploadPromises.push(uploadImage(variant.imageFile, entityName));
                } else {
                    uploadPromises.push(Promise.resolve(variant.imageUrl));
                }
            });

            const [mainImageUrl, ...variantImageUrls] = await Promise.all(uploadPromises);

            // 2. Construir el payload final con las URLs de las imágenes ya subidas.
            const finalPayload: ProductCreationData = {
                name: formData.name,
                description: formData.description,
                categoryId: formData.categoryId,
                isFeatured: formData.isFeatured,
                imageUrl: mainImageUrl,
                variants: formData.variants.map((v, index) => ({
                    id: v.id,
                    sku: v.sku,
                    price: v.price,
                    stock: v.stock,
                    salePrice: v.salePrice === null ? undefined : v.salePrice,
                    imageUrl: variantImageUrls[index],
                    unitOfMeasure: v.unitOfMeasure,
                    unitsPerItem: v.unitsPerItem,
                    volumeDiscounts: v.volumeDiscounts,
                    attributeValueIds: Object.values(v.selectedAttributes).filter(id => !isNaN(id)),
                })),
            };

            // 3. Guardar el producto con todos los datos y URLs.
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, finalPayload);
            } else {
                await productService.createProduct(finalPayload);
            }

            const successMessage = editingProduct ? 'Producto actualizado con éxito.' : 'Producto creado con éxito.';
            showNotification({message: successMessage, type: 'success'});
            setIsFormModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err: any) {
            const errorInfo = err.info?.errors ? Object.values(err.info.errors).flat().join(', ') : err.message;
            const finalMessage = `Error al guardar: ${errorInfo || 'Error desconocido.'}`;
            showNotification({message: finalMessage, type: 'error'});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        try {
            await productService.deleteProduct(productToDelete.id);
            showNotification({message: `Producto "${productToDelete.name}" eliminado con éxito.`, type: 'success'});
            setProductToDelete(null);
            await fetchData(); // Volvemos a cargar los productos
        } catch (err: any) {
            showNotification({message: err.message || 'Error al eliminar el producto.', type: 'error'});
            setProductToDelete(null);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestión de Productos</h1>
                <Button onClick={() => {
                    setEditingProduct(null);
                    setIsFormModalOpen(true);
                }}>Crear Producto</Button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center py-16">
                    <Spinner/>
                </div>
            )}
            {error && !isLoading && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete}/>}

            <ProductForm
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveProduct}
                productToEdit={editingProduct}
                attributes={attributes}
                categories={categories}
                isSubmitting={isSubmitting}
            />

            <ConfirmationModal
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                message={`¿Estás seguro de que deseas eliminar el producto "${productToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default ProductsPage;