import {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Menu, Transition} from "@headlessui/react";
import {Translate} from 'react-bootstrap-icons'

interface LanguageSelectorProps {
    isTransparent: boolean;
}

export default function LanguageSelector({ isTransparent }: LanguageSelectorProps) {
    const {i18n} = useTranslation();
    const currentLanguage = i18n.language.toUpperCase();
    const buttonClasses = `flex items-center p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`;

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className={buttonClasses}>
                <Translate className="h-6 w-6"/>
                <span className="ml-1 text-xs font-bold">{currentLanguage}</span>
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
                    className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({active}) => (
                                <button onClick={() => i18n.changeLanguage('es')}
                                        className={`${active ? 'bg-liderplast-primary text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    Español (ES)
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({active}) => (
                                <button onClick={() => i18n.changeLanguage('en')}
                                        className={`${active ? 'bg-liderplast-primary text-white' : 'text-gray-900'} group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                    English (EN)
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}