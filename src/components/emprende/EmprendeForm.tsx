import { useState, useEffect } from 'react';
import type { Product, EmprendePost, EmprendePostCreationData, EmprendePostUpdateData } from '../../types';
import { Modal } from '../general/Modal.tsx';
import { Button } from '../general/Button.tsx';
import { Combobox } from '@headlessui/react';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface EmprendeFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EmprendePostCreationData | EmprendePostUpdateData) => void;
    postToEdit: EmprendePost | null;
    allProducts: Product[];
    isSubmitting: boolean;
}

export const EmprendeForm = (props: EmprendeFormProps) => {
    const { isOpen, onClose, onSave, postToEdit, allProducts, isSubmitting } = props;
    const [formData, setFormData] = useState<EmprendePostCreationData | EmprendePostUpdateData>({ title: '', youtubeUrl: '', productIds: [] });
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState('');

    useEffect(() => {
        if (postToEdit) {
            const productIds = postToEdit.products.map(p => p.productId);
            setFormData({
                title: postToEdit.title,
                description: postToEdit.description || '',
                youtubeUrl: postToEdit.youtubeUrl,
                productIds: productIds,
            });
            setSelectedProducts(allProducts.filter(p => productIds.includes(p.id)));
        } else {
            setFormData({ title: '', youtubeUrl: '', productIds: [] });
            setSelectedProducts([]);
        }
    }, [postToEdit, allProducts]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleProductSelectionChange = (selected: Product[]) => {
        setSelectedProducts(selected);
        setFormData({ ...formData, productIds: selected.map(p => p.id) });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const filteredProducts = query === '' ? allProducts : allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={postToEdit ? 'Editar Post' : 'Crear Nuevo Post'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[var(--color-foreground)]/80">Título del Post</label>
                    <input id="title" name="title" type="text" required value={formData.title} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5" />
                </div>
                <div>
                    <label htmlFor="youtubeUrl" className="block text-sm font-medium text-[var(--color-foreground)]/80">URL del Video de YouTube</label>
                    <input id="youtubeUrl" name="youtubeUrl" type="url" required value={formData.youtubeUrl} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5" placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[var(--color-foreground)]/80">Descripción (Opcional)</label>
                    <textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="mt-1 block w-full rounded-md border-[var(--color-border)] bg-[var(--color-muted)] shadow-sm p-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--color-foreground)]/80">Productos Relacionados</label>
                    <Combobox value={selectedProducts} onChange={handleProductSelectionChange} multiple>
                        <div className="relative mt-1">
                            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-[var(--color-muted)] text-left shadow-md border border-[var(--color-border)]">
                                <Combobox.Input
                                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-transparent focus:ring-0"
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder="Busca y selecciona productos..."
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronsUpDown className="h-5 w-5 text-[var(--color-foreground)]/60" aria-hidden="true" />
                                </Combobox.Button>
                            </div>
                            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-[var(--color-card)] py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {filteredProducts.map((product) => (
                                    <Combobox.Option key={product.id} value={product} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-primary/80 text-primary-foreground' : ''}`}>
                                        {({ selected }) => (
                                            <>
                                                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{product.name}</span>
                                                {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary"><Check className="h-5 w-5" aria-hidden="true" /></span>}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </div>
                    </Combobox>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {selectedProducts.map(product => (
                            <span key={product.id} className="flex items-center gap-1 px-2 py-1 bg-[var(--color-muted)] text-sm rounded-full border border-[var(--color-border)]">
                                {product.name}
                                <button type="button" onClick={() => handleProductSelectionChange(selectedProducts.filter(p => p.id !== product.id))}>
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t border-[var(--color-border)]">
                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</Button>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Guardar Post'}</Button>
                </div>
            </form>
        </Modal>
    );
};