import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Contact from "./pages/contact.tsx";
import Category from "./pages/Category.tsx";
import AllProducts from "./pages/AllProducts.tsx";
import Header from "./Components/Header.tsx";
import Footer from "./Components/Footer.tsx";
import WhatsAppButton from "./Components/WhatsAppButton.tsx";

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/category" element={<Category/>}/>
                <Route path="/all-products" element={<AllProducts/>}/>
            </Routes>
            <Footer/>
            <WhatsAppButton/>
        </Router>
    );
}

export default App
