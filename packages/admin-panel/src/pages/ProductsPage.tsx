import {useEffect, useState} from 'react';
import {productService, type Product, type ProductCreationData} from '../services/productService';
import {Button} from '../components/general/Button';
import {ConfirmationModal} from '../components/general/ConfirmationModal';
import {ProductTable} from '../components/products/ProductTable';
import {useNotification} from '../providers/NotificationProvider';
import {ProductForm} from '../components/products/ProductForm';
import {attributeService, type Attribute} from "../services/attributeService";
import {categoryService, type Category} from "../services/categoryService";

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
            ]);setProducts(productsData.products);
            setAttributes(attributesData.attributes);
            setCategories(categoriesData.categories);
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

    const handleSaveProduct = async (data: ProductCreationData) => {
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, data);
                showNotification({message: 'Producto actualizado con éxito.', type: 'success'});
            } else {
                await productService.createProduct(data);
                showNotification({message: 'Producto creado con éxito.', type: 'success'});
            }
            setIsFormModalOpen(false);
            setEditingProduct(null);
            await fetchData();
        } catch (err: any) {
            showNotification({message: err.message || 'Error al guardar el producto.', type: 'error'});
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