import * as React from 'react';
import {useEffect, useState, useRef} from 'react';
import {UploadCloud, X, Loader2} from 'lucide-react';

interface ImageUploaderProps {
    onFileChange: (file: File | null) => void;
    initialImageUrl?: string | null;
    isUploading: boolean;
}

export const ImageUploader = ({onFileChange, initialImageUrl, isUploading}: ImageUploaderProps) => {
    const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(initialImageUrl || null);
    }, [initialImageUrl]);

    const processFile = (file: File | undefined) => {
        if (file && file.type.startsWith('image/')) {
            const localPreviewUrl = URL.createObjectURL(file);
            setPreview(localPreviewUrl);
            onFileChange(file);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        processFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const removeImage = () => {
        setPreview(null);
        onFileChange(null); // Informar al padre que no hay imagen
        // Limpiamos el input para que se pueda volver a seleccionar el mismo archivo.
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-[var(--color-foreground)]/80 mb-1">Imagen</label>
            <div
                className={`mt-1 flex justify-center items-center w-full h-48 border-2 border-dashed rounded-md relative transition-colors ${
                    isDragging
                        ? 'border-[var(--color-primary)] bg-primary/10'
                        : 'border-[var(--color-border)]'
                } ${!preview ? 'cursor-pointer' : ''}`}
                onClick={() => !preview && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Vista previa" className="h-full w-full object-contain rounded-md"/>
                        <button onClick={removeImage}
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
                            <X className="h-4 w-4"/>
                        </button>
                    </>
                ) : (
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-[var(--color-foreground)]/40"/>
                        <div className="flex text-sm text-[var(--color-foreground)]/60">
                             <span className="font-medium text-primary">
                                 Haz clic para subir
                             </span>
                            <p className="pl-1">o arrastra y suelta</p>
                        </div>
                    </div>
                )}
                {isUploading &&
                    <div
                        className="absolute inset-0 bg-[var(--color-card)]/80 flex justify-center items-center rounded-md">
                        <Loader2
                            className="h-8 w-8 animate-spin text-primary"/></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden"
                   accept="image/png, image/jpeg, image/webp, image/avif"/>
        </div>
    );
};