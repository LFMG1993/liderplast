import {Outlet} from "react-router-dom";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import WhatsAppButton from "./WhatsAppButton.tsx";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow">
                <Outlet/>
            </main>
            <Footer/>
            <WhatsAppButton/>
        </div>
    );
};

export default Layout;
