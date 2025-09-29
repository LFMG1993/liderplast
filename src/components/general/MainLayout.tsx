import {Outlet} from "react-router-dom";
import Footer from "./Footer.tsx";
import WhatsAppButton from "./WhatsAppButton.tsx";
import {TopBar} from "./TopBar.tsx";

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <TopBar/>
            <main className="flex-grow">
                <Outlet/>
            </main>
            <Footer/>
            <WhatsAppButton/>
        </div>
    );
};

export default MainLayout;
