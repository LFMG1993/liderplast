import {Fragment} from "react";
import {Link} from "react-router-dom";
import {Menu, Transition} from "@headlessui/react";
import {useCart} from "../../context/CardContext.tsx";
import {Cart, Trash3Fill, FileImage} from "react-bootstrap-icons";

interface CartDropdownProps {
    isTransparent: boolean;
}

export default function CartDropdown({isTransparent}: CartDropdownProps) {
    const {items, removeItem} = useCart();
    const uniqueItemsCount = items.length;
    const buttonClasses = `relative p-2 rounded-full transition-colors ${isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`;

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className={buttonClasses}>
                <span className="sr-only">Ver carrito</span>
                <Cart className="w-6 h-6"/>
                {uniqueItemsCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {uniqueItemsCount}
                    </span>
                )}
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-2">
                        {items.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Tu carrito está vacío.</p>
                            </div>
                        ) : (
                            <>
                                <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200">
                                    {items.map(item => (
                                        <li key={item.variantId} className="flex items-center py-3 px-2">
                                            {/* ✅ MEJORA: Renderizamos la imagen desde la URL y usamos un fallback. */}
                                            <div
                                                className="h-16 w-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                                {item.image_url ? (
                                                    <img src={item.image_url} alt={item.name}
                                                         className="h-full w-full object-cover rounded-md"/>
                                                ) : (
                                                    <FileImage className="h-8 w-8 text-gray-400"/>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.variantDescription}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <p className="text-gray-500 text-sm">Cant: {item.quantity}</p>
                                                    {/*  Lógica de precios dinámicos en el dropdown. */}
                                                    <div className="text-sm font-medium">
                                                        {(() => {
                                                            const applicableDiscount = item.volumeDiscounts
                                                                ?.sort((a, b) => b.minQuantity - a.minQuantity)
                                                                .find(d => item.quantity >= d.minQuantity);
                                                            const effectivePrice = applicableDiscount ? applicableDiscount.price : item.price;

                                                            return effectivePrice < item.price ? (
                                                                <span
                                                                    className="text-green-600">${effectivePrice.toLocaleString('es-CO')}</span>
                                                            ) : <span>${item.price.toLocaleString('es-CO')}</span>
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => removeItem(item.variantId)}
                                                    className="ml-4 p-1 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                                                    aria-label={`Eliminar ${item.name} del carrito`}
                                            >
                                                <Trash3Fill className="h-5 w-5"/>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 border-t pt-4">
                                    <Link to="/carrito"
                                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white background-lider hover:bg-liderplast-hover">
                                        Ir al Carrito
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}