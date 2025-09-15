import {Fragment} from 'react';
import {Menu, Transition} from '@headlessui/react';
import {FacebookIcon} from '../icons/FacebookIcon';
import {InstagramIcon} from '../icons/InstagramIcon';
import {TiktokIcon} from '../icons/TiktokIcon';
import {AppIndicator} from "react-bootstrap-icons";

interface SocialSelectorProps {
    isTransparent: boolean;
}

export default function SocialSelector({isTransparent}: SocialSelectorProps) {
    const buttonClasses = `flex items-center p-2 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 ${isTransparent ? 'text-white hover:bg-white/20' : 'text-gray-700 hover:bg-gray-100'}`;

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className={buttonClasses}>
                <span className="sr-only">Nuestras redes sociales</span>
                <AppIndicator className="h-6 w-6"/>
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
                    className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1 flex justify-around">
                        <Menu.Item>
                            <a href="https://web.facebook.com/lider.plast.52" target="_blank" rel="noopener noreferrer"
                               className="p-2 rounded-full hover:bg-gray-100"><FacebookIcon className="h-8 w-8"/></a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="https://www.instagram.com/distribucionesliderplast" target="_blank"
                               rel="noopener noreferrer" className="p-2 rounded-full hover:bg-gray-100"><InstagramIcon
                                className="h-8 w-8"/></a>
                        </Menu.Item>
                        <Menu.Item>
                            <a href="https://www.tiktok.com/@liderplast1" target="_blank" rel="noopener noreferrer"
                               className="p-2 rounded-full hover:bg-gray-100"><TiktokIcon className="h-8 w-8"/></a>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};