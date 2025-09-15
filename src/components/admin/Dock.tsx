import { NavLink } from 'react-router-dom';
import { dockItems } from '../../models/navigations.ts';

const Dock = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none">
            <nav className="flex items-center gap-2 p-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-lg pointer-events-auto">
                {dockItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                isActive ? 'bg-primary/20 text-primary dark:bg-primary/30' : ''
                            }`
                        }
                    >
                        <item.icon className="w-6 h-6" />
                        <span className="mt-1 text-xs font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>
        </footer>
    );
};

export default Dock;