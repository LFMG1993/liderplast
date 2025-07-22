import {Fragment} from "react";
import {Link} from "react-router-dom";
import {Menu, Transition} from "@headlessui/react";
import {useCart} from "../hooks/CardContext.tsx";
import {ImagesProducts} from "../utils/images.ts";

export default function CardDropdown() {
    const {items, removeItem} = useCart();
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-liderplast-primary focus:outline-none">
                <span className="sr-only">Ver carrito</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {totalItems > 0 && (
                    <span
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {totalItems}
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
                                        <li key={item.id} className="flex items-center py-3 px-2">
                                            <img src={ImagesProducts[item.image]} alt={item.title}
                                                 className="h-16 w-16 object-cover rounded-md"/>
                                            <div className="ml-4 flex-1">
                                                <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                                                <p className="text-gray-500 text-sm">Cantidad: {item.quantity}</p>
                                            </div>
                                            <button onClick={() => removeItem(item.id)}
                                                    className="ml-4 text-gray-400 hover:text-red-500">
                                                <i className="bi bi-trash3-fill"></i>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-4 border-t pt-4">
                                    <Link to="/cart"
                                          className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-liderplast-primary hover:bg-liderplast-hover">
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