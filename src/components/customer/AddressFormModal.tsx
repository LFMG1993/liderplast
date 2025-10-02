import {useEffect, useState, Fragment} from 'react';
import type {Address, AddressCreationData} from '../../types';
import {Modal} from '../general/Modal';
import {Button} from '../general/Button';
import {locationService} from "../../services/locationService.ts";
import {Combobox, Transition} from "@headlessui/react";
import {Check, ChevronsUpDown} from "lucide-react";

interface AddressFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AddressCreationData, id?: number) => void;
    initialData?: Address | null;
    isSaving: boolean;
}

const emptyForm: AddressCreationData = {
    recipientName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    details: '',
    isDefault: false,
};

export const AddressFormModal = ({isOpen, onClose, onSave, initialData, isSaving}: AddressFormModalProps) => {
    const [formData, setFormData] = useState<AddressCreationData>(emptyForm);

    // Estados para los desplegables
    const [departments, setDepartments] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [departmentQuery, setDepartmentQuery] = useState('');
    const [cityQuery, setCityQuery] = useState('');

    // Cargar la lista de departamentos al montar el componente
    useEffect(() => {
        locationService.getDepartments().then(setDepartments);
    }, []);

    useEffect(() => {
        // Limpiar queries cuando el modal se cierra o abre
        setDepartmentQuery('');
        setCityQuery('');
        if (isOpen && initialData) {
            // Si estamos editando, llenamos el formulario con los datos existentes.
            setFormData({
                recipientName: initialData.recipientName,
                street: initialData.street,
                city: initialData.city,
                state: initialData.state,
                postalCode: initialData.postalCode || '',
                details: initialData.details || '',
                isDefault: initialData.isDefault,
            });
        } else {
            // Si es para crear, reseteamos al formulario vacío.
            setFormData(emptyForm);
        }
    }, [isOpen, initialData]);

    // Efecto para actualizar las ciudades cuando cambia el departamento seleccionado
    useEffect(() => {
        if (typeof formData.state === 'string' && formData.state) {
            locationService.getCitiesByDepartment(formData.state).then(setCities);
        } else {
            setCities([]); // Si no hay departamento, la lista de ciudades está vacía
        }
    }, [formData.state]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type} = e.target;
        const isCheckbox = type === 'checkbox';

        setFormData(prev => {
            return {...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value};
        });
    };

    // Handler específico para los Combobox
    const handleComboboxChange = (name: 'state' | 'city', value: string) => {
        setFormData(prev => {
            const newFormData = {...prev, [name]: value};
            if (name === 'state') {
                newFormData.city = ''; // Resetea la ciudad si cambia el departamento
                setCityQuery(''); // Limpia la búsqueda de ciudad
            }
            return newFormData;
        });
    };

    // Lógica para filtrar listas basadas en la búsqueda del usuario
    const filteredDepartments =
        departmentQuery === ''
            ? departments
            : departments.filter((dep) =>
                dep.toLowerCase().replace(/\s+/g, '').includes(departmentQuery.toLowerCase().replace(/\s+/g, ''))
            );

    const filteredCities =
        cityQuery === ''
            ? cities
            : cities.filter((city) =>
                city.toLowerCase().replace(/\s+/g, '').includes(cityQuery.toLowerCase().replace(/\s+/g, ''))
            );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, initialData?.id);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Editar Dirección' : 'Añadir Nueva Dirección'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipientName">Nombre de quien recibe</label>
                    <input id="recipientName" name="recipientName" type="text" required value={formData.recipientName}
                           onChange={handleChange}
                           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="street">Dirección</label>
                        <input id="street" name="street" type="text" required value={formData.street}
                               onChange={handleChange} placeholder="Calle y Número"
                               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                    </div>
                    <div>
                        <label htmlFor="details">Detalles </label>
                        <input id="details" name="details" type="text" value={formData.details || ''}
                               onChange={handleChange} placeholder="Apto, Torre, etc."
                               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-liderplast-primary focus:ring-liderplast-primary"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="state">Departamento</label>
                        <Combobox value={formData.state || ''}
                                  onChange={(value) => handleComboboxChange('state', value)}>
                            <div className="relative mt-1">
                                <Combobox.Input
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-liderplast-primary focus:outline-none focus:ring-1 focus:ring-liderplast-primary"
                                    onChange={(event) => setDepartmentQuery(event.target.value)}
                                    displayValue={(department: string | null) => department || ''}
                                    placeholder="Busca un departamento"
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </Combobox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Combobox.Options
                                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {filteredDepartments.length === 0 && departmentQuery !== '' ? (
                                            <div
                                                className="relative cursor-default select-none py-2 px-4 text-gray-700">No
                                                se encontró.</div>
                                        ) : (
                                            filteredDepartments.map((dep) => (
                                                <Combobox.Option key={dep} value={dep}
                                                                 className={({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-liderplast-primary text-green-500' : 'text-gray-900'}`}>
                                                    {({selected, active}) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{dep}</span>
                                                            {selected && <span
                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-liderplast-primary'}`}><Check
                                                                className="h-5 w-5" aria-hidden="true"/></span>}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            ))
                                        )}
                                    </Combobox.Options>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                    <div>
                        <label htmlFor="city">Ciudad</label>
                        <Combobox value={formData.city || ''} onChange={(value) => handleComboboxChange('city', value)}
                                  disabled={!formData.state || cities.length === 0}>
                            <div className="relative mt-1">
                                <Combobox.Input
                                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-liderplast-primary focus:outline-none focus:ring-1 focus:ring-liderplast-primary disabled:bg-gray-100"
                                    onChange={(event) => setCityQuery(event.target.value)}
                                    displayValue={(city: string | null) => city || ''}
                                    placeholder="Busca una ciudad"
                                />
                                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                </Combobox.Button>
                                <Transition as={Fragment} leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <Combobox.Options
                                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        {filteredCities.length === 0 && cityQuery !== '' ? (
                                            <div
                                                className="relative cursor-default select-none py-2 px-4 text-gray-700">No
                                                se encontró.</div>
                                        ) : (
                                            filteredCities.map((city) => (
                                                <Combobox.Option key={city} value={city}
                                                                 className={({active}) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-liderplast-primary text-green-500' : 'text-gray-900'}`}>
                                                    {({selected, active}) => (
                                                        <>
                                                            <span
                                                                className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{city}</span>
                                                            {selected && <span
                                                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-liderplast-primary'}`}><Check
                                                                className="h-5 w-5" aria-hidden="true"/></span>}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            ))
                                        )}
                                    </Combobox.Options>
                                </Transition>
                            </div>
                        </Combobox>
                    </div>
                </div>

                <div className="flex items-center">
                    <input id="isDefault" name="isDefault" type="checkbox" checked={formData.isDefault}
                           onChange={handleChange}
                           className="h-4 w-4 rounded border-gray-300 text-liderplast-primary focus:ring-liderplast-primary"/>
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                        Usar como dirección predeterminada
                    </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? 'Guardando...' : 'Guardar Dirección'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};