import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Contact from "./pages/contact.tsx";
import Category from "./pages/Category.tsx";
import AllProducts from "./pages/AllProducts.tsx";
import CartPage from "./pages/CartPage.tsx";
import Layout from "./Components/Layout.tsx";

function App() {
    return (
        <BrowserRouter basename="/tienda">
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Navigate to="/all-products" replace/>}/>
                    <Route path="contact" element={<Contact/>}/>
                    <Route path="category" element={<Category/>}/>
                    <Route path="all-products" element={<AllProducts/>}/>
                    <Route path="cart" element={<CartPage/>}/>
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App
