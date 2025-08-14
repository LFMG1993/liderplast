import {Outlet} from 'react-router-dom';
import Dock from './Dock.tsx';
import ProfilePopover from "./ProfilePopover.tsx";

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <main className="flex-1 overflow-y-auto pb-28">
                {/* Las páginas hijas (Dashboard, Usuarios, etc.) se renderizarán aquí */}
                <Outlet/>
            </main>
            <Dock/>
            <ProfilePopover/>
        </div>
    );
};

export default DashboardLayout;