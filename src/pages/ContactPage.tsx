import * as React from 'react';
import {useState} from "react";
import type {FC, ChangeEventHandler, FormEvent} from "react";
import {HouseDoorFill, TelephoneFill, Globe, EnvelopeFill} from 'react-bootstrap-icons';
import SmartLink from "../components/general/SmartLink.tsx";
import {SEO} from '../components/general/SEO';
import {api} from "../services/api.ts";

interface FormInputProps {
    label: string;
    name: string;
    type?: React.HTMLInputTypeAttribute;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    required?: boolean;
}

// Un componente reutilizable para los campos del formulario
const FormInput: FC<FormInputProps> = ({label, name, type = "text", value, onChange, required = true}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-liderplast-primary focus:border-liderplast-primary sm:text-sm"
        />
    </div>
);

interface StatusAlertProps {
    type: 'success' | 'error';
    message: string;
}

const StatusAlert: FC<StatusAlertProps> = ({type, message}) => {
    const baseClasses = "p-4 mt-4 rounded-md text-sm";
    const typeClasses = {
        success: "bg-green-100 text-green-800",
        error: "bg-red-100 text-red-800",
    };
    return <div className={`${baseClasses} ${typeClasses[type]}`}>{message}</div>;
};

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [status, setStatus] = useState<null | "sending" | "sent" | "error">(null);

    const handleChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const payload = {
                nombre: form.name.trim(),
                email: form.email.trim(),
                asunto: form.subject.trim(),
                mensaje: form.message.trim(),
            };

            await api.post('/api/contact', payload);

            setStatus("sent");
            setForm({name: "", email: "", subject: "", message: ""});
        } catch (err: any) {
            console.error("Error al enviar formulario de contacto:", err.message);
            setStatus("error");
        }
    };

    return (
        <>
            <SEO
                title="Contacto"
                description="Ponte en contacto con el equipo de Liderplast."
            />
            <div className="bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Título */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                            Ponte en Contacto
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Nos encantaría saber de ti.
                        </p>
                    </div>

                    {/* Contenido principal: Formulario y Detalles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Columna del Formulario */}
                        <div className="bg-white p-8 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <FormInput label="Tu Nombre" name="name" value={form.name} onChange={handleChange}/>
                                <FormInput label="Tu Correo" name="email" type="email" value={form.email}
                                           onChange={handleChange}/>
                                <FormInput label="Asunto" name="subject" value={form.subject} onChange={handleChange}/>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                        Mensaje
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-liderplast-primary focus:border-liderplast-primary sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-liderplast-primary hover:bg-liderplast-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-liderplast-primary disabled:opacity-50"
                                        disabled={status === "sending"}
                                    >
                                        {status === "sending" ? "Enviando…" : "Enviar Mensaje"}
                                    </button>
                                </div>
                                {status === "sent" &&
                                    <StatusAlert type="success" message="¡Gracias! Tu mensaje ha sido enviado."/>}
                                {status === "error" &&
                                    <StatusAlert type="error"
                                                 message="Ocurrió un error. Por favor, intenta de nuevo."/>}
                            </form>
                        </div>

                        {/* Columna de Detalles de Contacto */}
                        <div className="space-y-8">
                            {/* Mapa */}
                            <div>
                                <div
                                    className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg bg-gray-200">
                                    <iframe
                                        src="https://maps.google.com/maps?q=Plasticos%20El%20lider%2C%20Cucuta&t=&z=17&ie=UTF8&iwloc=&output=embed"
                                        className="w-full h-full"
                                        style={{border: 0}}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>
                            {/* Información de contacto */}
                            <div className="bg-white p-8 rounded-lg shadow-lg">
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-center">
                                        <HouseDoorFill className="text-xl text-liderplast-primary mr-4 flex-shrink-0"/>
                                        <span>Calle 6 # 4 - 18 Barrio el llano Cúcuta - Norte de Santander</span>
                                    </li>
                                    <li className="flex items-center">
                                        <TelephoneFill className="text-xl text-liderplast-primary mr-4 flex-shrink-0"/>
                                        <span>Teléfono: <SmartLink to="https://wa.me/573242940464"
                                                                   className="text-liderplast-primary hover:underline">+57 324 294 0464</SmartLink></span>
                                    </li>
                                    <li className="flex items-center">
                                        <Globe className="text-xl text-liderplast-primary mr-4 flex-shrink-0"/>
                                        <span>Sitio web: <SmartLink to="https://distribucioneslider.com.co"
                                                                    className="text-liderplast-primary hover:underline">www.distribucioneslider.com.co</SmartLink></span>
                                    </li>
                                    <li className="flex items-center">
                                        <EnvelopeFill className="text-xl text-liderplast-primary mr-4 flex-shrink-0"/>
                                        <span>Email: <SmartLink to="mailto:liderplast@gmail.com"
                                                                className="text-liderplast-primary hover:underline">liderplast@gmail.com</SmartLink></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}