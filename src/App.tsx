import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ProtectedRoute from './auth/ProtectedRoute.tsx';
import LoginPage from './pages/admin/LoginPage.tsx';
import DashboardPage from './pages/admin/DashboardPage.tsx';
import DashboardLayout from "./components/DashboardLayout.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import ProductsPage from "./pages/admin/ProductsPage.tsx";
import SuppliersPage from "./pages/admin/SuppliersPage.tsx";
import InventoryPage from "./pages/admin/InventoryPage.tsx";
import CategoriesPage from "./pages/admin/CategoriesPage.tsx";
import AttributesPage from "./pages/admin/AttributesPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import AllProductsPage from "./pages/shop/AllProductsPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import {NotificationProvider} from "./providers/NotificationProvider.tsx";
import {CartProvider} from "./context/CardContext.tsx";
import MainLayout from "./components/general/MainLayout.tsx";

function App() {
    return (
        <NotificationProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        {/* --- Rutas Públicas --- */}
                        <Route path="/" element={<HomePage/>}/>
                        <Route element={<MainLayout/>}>
                            <Route path="/contacto" element={<ContactPage/>}/>
                            <Route path="/tienda" element={<AllProductsPage/>}/>
                        </Route>
                        <Route path="/admin/login" element={<LoginPage/>}/>
                        {/* --- Rutas Protegidas del Admin --- */}
                        <Route path="/admin" element={<ProtectedRoute/>}>
                            <Route element={<DashboardLayout/>}>
                                <Route path="dashboard" element={<DashboardPage/>}/>
                                <Route path="users" element={<UsersPage/>}/>
                                <Route path="categories" element={<CategoriesPage/>}/>
                                <Route path="attributes" element={<AttributesPage/>}/>
                                <Route path="products" element={<ProductsPage/>}/>
                                <Route path="suppliers" element={<SuppliersPage/>}/>
                                <Route path="inventory" element={<InventoryPage/>}/>
                                <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </NotificationProvider>
    );
}

export default App;