import {useEffect, useState} from 'react';
import {productService} from '../services/productService';
import type {Product, ProductCreationData} from '../types';
import {Button} from '../components/general/Button';
import {ConfirmationModal} from '../components/general/ConfirmationModal';
import {ProductTable} from '../components/products/ProductTable';
import {useNotification} from '../providers/NotificationProvider';
import {ProductForm} from '../components/products/ProductForm';
import {attributeService} from "../services/attributeService";
import {categoryService} from "../services/categoryService";
import type {Attribute, Category} from "../types";
import {uploadImage} from "../services/imageService";
import {slugify} from "../utils/utils";

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

    const handleEdit = (id: number) => {
        const product = products.find(p => p.id === id);
        if (product) {
            setEditingProduct(product);
            setIsFormModalOpen(true);
        }
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
    };

    const handleSaveProduct = async (
        data: ProductCreationData & { id?: number | null },
        imageFile: File | null
    ) => {
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                let finalImageUrl = data.image_url;

                // Si hay un nuevo archivo, lo subimos y obtenemos la nueva URL.
                if (imageFile) {
                    const slug = slugify(editingProduct.name); // Usamos el nombre original para estabilidad.
                    const entityName = `product/${slug}-${editingProduct.id}`; // Hacemos el nombre único con el ID.
                    finalImageUrl = await uploadImage(imageFile, entityName);
                }
                // Construimos el payload final con TODOS los datos y la URL correcta.
                const payload: ProductCreationData = {
                    ...data,
                    image_url: finalImageUrl,
                };

                // Hacemos UNA SOLA llamada a la API con el objeto completo.
                await productService.updateProduct(editingProduct.id, payload);
            } else {
                // 1. Creamos el producto SIN la URL de la imagen.
                const newProduct = await productService.createProduct(data);
                // 2. Si hay un archivo de imagen, lo subimos y actualizamos el producto recién creado.
                if (imageFile) {
                    const slug = slugify(newProduct.name);
                    const entityName = `product/${slug}-${newProduct.id}`; // Hacemos el nombre único con el nuevo ID.
                    const newImageUrl = await uploadImage(imageFile, entityName);
                    // 3. Hacemos la segunda llamada para añadir la URL de la imagen.
                    await productService.updateProduct(newProduct.id, {image_url: newImageUrl});
                }
            }
            const successMessage = editingProduct ? 'Producto actualizado con éxito.' : 'Producto creado con éxito.';
            showNotification({message: successMessage, type: 'success'});
            setIsFormModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err: any) {
            const errorMessage = err.response?.errors ? JSON.stringify(err.response.errors) : (err.message || 'Error al guardar el producto.');
            showNotification({message: errorMessage, type: 'error'});
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

            {isLoading && <p>Cargando productos...</p>}
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

            <ConfirmationModal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)}
                               title="Confirmar Eliminación">
                <p>¿Estás seguro de que deseas eliminar el producto <strong>"{productToDelete?.name}"</strong>?</p>
                <p className="text-sm text-gray-500 mt-2">Esta acción no se puede deshacer.</p>
                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={() => setProductToDelete(null)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Eliminar</Button>
                </div>
            </ConfirmationModal>
        </div>
    );
};

export default ProductsPage;