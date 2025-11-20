import {Outlet} from 'react-router-dom';
import Dock from './Dock.tsx';

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <main className="flex-1 overflow-y-auto pb-28">
                <Outlet/>
            </main>
            <Dock/>
        </div>
    );
};

export default DashboardLayout;