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
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setPreview(initialImageUrl || null);
    }, [initialImageUrl]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Genera una URL local para la previsualización instantánea.
            const localPreviewUrl = URL.createObjectURL(file);
            setPreview(localPreviewUrl);
            onFileChange(file);
        } else {
            // Si el usuario cancela la selección, no hacemos nada.
        }
    };

    const removeImage = () => {
        setPreview(null);
        onFileChange(null); // Informar al padre que no hay imagen
        // Limpiamos el input para que se pueda volver a seleccionar el mismo archivo.
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <div
                className="mt-1 flex justify-center items-center w-full h-48 border-2 border-gray-300 border-dashed rounded-md relative">
                {preview ? (
                    <>
                        <img src={preview} alt="Vista previa" className="h-full w-full object-contain rounded-md"/>
                        <button onClick={removeImage}
                                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                            <X className="h-4 w-4 text-red-500"/>
                        </button>
                    </>
                ) : (
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400"/>
                        <div className="flex text-sm text-gray-600">
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                <span>Subir un archivo</span>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">WEBP, PNG, JPG hasta 1MB</p>
                    </div>
                )}
                {isUploading &&
                    <div
                        className="absolute inset-0 bg-gray-500 bg-opacity-70 flex justify-center items-center rounded-md">
                        <Loader2
                            className="h-8 w-8 animate-spin text-primary"/></div>}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden"
                   accept="image/png, image/jpeg, image/webp, image/avif"/>
        </div>
    );
};