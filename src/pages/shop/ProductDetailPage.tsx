import {useState, useMemo, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {shopService} from '../../services/shopService';
import {useCart} from '../../context/CardContext.tsx';
import {SEO} from '../../components/general/SEO.tsx';
import {Spinner} from '../../components/general/Spinner.tsx';
import {Button} from '../../components/general/Button.tsx';
import {FileImage, Plus, Minus, CheckCircle} from 'lucide-react';
import {slugify} from "../../utils/utils.ts";

export default function ProductDetailPage() {
    const {id} = useParams<{ id: string }>();
    const {addItem} = useCart();

    const {data: product, isLoading, isError, error} = useQuery({
        queryKey: ['product', id],
        queryFn: () => shopService.getPublicProductById(Number(id)),
        enabled: !!id,
    });

    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [displayImage, setDisplayImage] = useState<string | null>(null);
    const [addedToCart, setAddedToCart] = useState(false);

    // Inicializa la imagen y las opciones seleccionadas cuando el producto se carga
    useEffect(() => {
        if (product) {
            setDisplayImage(product.imageUrl);
            // Pre-selecciona la primera opción de cada atributo si solo hay una
            const initialOptions: Record<string, string> = {};
            product.variants.forEach(variant => {
                variant.variantValues?.forEach(vv => {
                    const attrName = vv.attributeValue.attribute.name;
                    if (!initialOptions[attrName]) {
                        initialOptions[attrName] = vv.attributeValue.value;
                    }
                });
            });
            setSelectedOptions(initialOptions);
        }
    }, [product]);

    const attributeOptions = useMemo(() => {
        if (!product) return {};
        const options: Record<string, Set<string>> = {};
        product.variants.forEach(variant => {
            variant.variantValues?.forEach(vv => {
                const attrName = vv.attributeValue.attribute.name;
                if (!options[attrName]) {
                    options[attrName] = new Set();
                }
                options[attrName].add(vv.attributeValue.value);
            });
        });
        return options;
    }, [product]);

    const selectedVariant = useMemo(() => {
        if (!product || Object.keys(selectedOptions).length < Object.keys(attributeOptions).length) return null;
        return product.variants.find(variant =>
            variant.variantValues?.every(vv =>
                selectedOptions[vv.attributeValue.attribute.name] === vv.attributeValue.value
            )
        );
    }, [product, selectedOptions, attributeOptions]);

    useEffect(() => {
        if (selectedVariant?.imageUrl) {
            setDisplayImage(selectedVariant.imageUrl);
        } else if (product) {
            setDisplayImage(product.imageUrl);
        }
    }, [selectedVariant, product]);

    const handleOptionClick = (attributeName: string, value: string) => {
        setSelectedOptions(prev => ({...prev, [attributeName]: value}));
    };

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;
        addItem(product, quantity, selectedVariant.id);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000); // El mensaje desaparece después de 2 segundos
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner/></div>;
    }

    if (isError) {
        return <div className="text-center py-20 text-red-500">Error al cargar el
            producto: {(error as Error).message}</div>;
    }

    if (!product) {
        return <div className="text-center py-20">Producto no encontrado.</div>;
    }

    return (
        <>
            <SEO
                title={`${product.name} - Distribuciones Lider Plast`}
                description={product.description || ''}
                imageUrl={product.imageUrl || ''}
                canonicalUrl={`/producto/${slugify(product.name)}/${product.id}`}
            />
            <div className="container mx-auto px-4 py-12 bg-[var(--color-background)] text-[var(--color-foreground)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Columna de Imagen */}
                    <div
                        className="w-full aspect-square bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg flex items-center justify-center">
                        {displayImage ? (
                            <img src={displayImage} alt={product.name}
                                 className="w-full h-full object-contain rounded-lg p-4"/>
                        ) : (
                            <FileImage className="w-24 h-24 text-[var(--color-muted-foreground)]/60"/>
                        )}
                    </div>

                    {/* Columna de Detalles */}
                    <div className="flex flex-col">
                        <Link to={`/tienda?categories=${product.category.id}`}
                              className="text-sm text-primary hover:underline mb-2">{product.category.name}</Link>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
                        <p className="text-[var(--color-foreground)]/80 mb-6">{product.description}</p>

                        <div className="space-y-6">
                            {Object.entries(attributeOptions).map(([attributeName, values]) => (
                                <div key={attributeName}>
                                    <h4 className="font-semibold mb-2">{attributeName}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(values).map(value => (
                                            <button
                                                key={value}
                                                onClick={() => handleOptionClick(attributeName, value)}
                                                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                                                    selectedOptions[attributeName] === value
                                                        ? 'bg-primary text-primary-foreground border-primary'
                                                        : 'bg-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-border)]'
                                                }`}
                                            >
                                                {value}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <div className="text-3xl font-bold">
                                {selectedVariant ? (
                                    <span>${(selectedVariant.salePrice || selectedVariant.price).toLocaleString('es-CO')}</span>
                                ) : (
                                    <span className="text-[var(--color-foreground)]/60 text-xl">Selecciona las opciones para ver el precio</span>
                                )}
                            </div>
                        </div>

                        <div className="mt-2 h-6 text-sm text-green-600 dark:text-green-400 font-medium">
                            {selectedVariant?.volumeDiscounts && selectedVariant.volumeDiscounts.length > 0 && (
                                <span>
                                     Lleva {selectedVariant.volumeDiscounts[0].minQuantity} o más a ${selectedVariant.volumeDiscounts[0].price.toLocaleString('es-CO')} c/u
                                 </span>
                            )}
                        </div>

                        {selectedVariant && (
                            <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                                <div className="flex items-center gap-4">
                                    <label htmlFor="quantity" className="font-semibold">Cantidad:</label>
                                    <div className="flex items-center">
                                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="p-2 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-muted)]"
                                                aria-label="Disminuir cantidad">
                                            <Minus className="h-5 w-5"/>
                                        </button>
                                        <span className="px-4 font-medium text-lg">{quantity}</span>
                                        <button onClick={() => setQuantity(q => q + 1)}
                                                className="p-2 border border-[var(--color-border)] rounded-md hover:bg-[var(--color-muted)]"
                                                aria-label="Aumentar cantidad">
                                            <Plus className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button
                                        onClick={handleAddToCart}
                                        size="lg"
                                        className="w-full"
                                    >
                                        {addedToCart ? (
                                            <>
                                                <CheckCircle className="h-5 w-5 mr-2"/>
                                                Añadido al carrito
                                            </>
                                        ) : (
                                            'Añadir al Carrito'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}