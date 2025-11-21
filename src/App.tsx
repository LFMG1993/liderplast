import * as React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {NotificationProvider} from "./providers/NotificationProvider.tsx";
import {CartProvider} from "./context/CardContext.tsx";
import {UserAuthProvider} from "./context/UserAuthContext.tsx";
import HomePage from "./pages/HomePage.tsx";
import AllProductsPage from "./pages/shop/AllProductsPage.tsx";
import ProductDetailPage from "./pages/shop/ProductDetailPage.tsx";
import EmprendePublicPage from "./pages/shop/EmprendePublicPage.tsx";
import EmprendePostDetailPage from "./pages/shop/EmprendePostDetailPage.tsx";
import CartPage from "./pages/shop/CartPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";
import CustomerPage from "./pages/shop/CustomerPage.tsx";
import MainLayout from "./components/general/MainLayout.tsx";
import LoginPage from './pages/admin/LoginPage.tsx';
import ProtectedRoute from './auth/ProtectedRoute.tsx';
import DashboardPage from './pages/admin/DashboardPage.tsx';
import DashboardLayout from "./components/admin/DashboardLayout.tsx";
import UsersPage from "./pages/admin/UsersPage.tsx";
import ProductsPage from "./pages/admin/ProductsPage.tsx";
import ProvidersPage from "./pages/admin/ProvidersPage.tsx";
import InventoryPage from "./pages/admin/InventoryPage.tsx";
import EmprendePage from "./pages/admin/EmprendePage.tsx";
import CategoriesPage from "./pages/admin/CategoriesPage.tsx";
import AttributesPage from "./pages/admin/AttributesPage.tsx";
import PaymentMethodsPage from "./pages/admin/PaymentMethodsPage.tsx";
import OrdersPage from "./pages/admin/OrdersPage.tsx";
import ShipmentsPage from "./pages/admin/ShipmentPage.tsx";
import CheckoutPage from "./pages/shop/CheckoutPage.tsx";
import OrderConfirmationPage from "./pages/shop/OrderConfirmationPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import CookiePolicyPage from "./pages/CookiesPolicyPage.tsx";
import {ThemeProvider} from "./context/ThemeContext.tsx";
import {CookieBanner} from "./components/general/CookieBanner.tsx";
import {Analytics} from "./components/general/Analytics.tsx";

// Componente wrapper para el tema público
const PublicThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <ThemeProvider storageKey="theme-public" defaultTheme="light">
        <>
            {children}
            <CookieBanner/>
        </>
    </ThemeProvider>
);

// Componente wrapper para el tema administrativo
const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <ThemeProvider storageKey="theme-admin" defaultTheme="dark">
        {children}
    </ThemeProvider>
);

function App() {
    return (
        <NotificationProvider>
            <UserAuthProvider>
                <CartProvider>
                    <BrowserRouter>
                        <Analytics/>
                        <Routes>
                            {/* --- Rutas Públicas --- */}
                            <Route path="/" element={<PublicThemeProvider><HomePage/></PublicThemeProvider>}/>
                            <Route element={<PublicThemeProvider><MainLayout/></PublicThemeProvider>}>
                                <Route path="/nosotros" element={<AboutUsPage/>}/>
                                <Route path="/contacto" element={<ContactPage/>}/>
                                <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
                                <Route path="/cookie-policy" element={<CookiePolicyPage/>}/>
                                <Route path="/tienda" element={<AllProductsPage/>}/>
                                <Route path="/emprender" element={<EmprendePublicPage/>}/>
                                <Route path="/emprender/:slug/:id" element={<EmprendePostDetailPage/>}/>
                                <Route path="/producto/:slug/:id" element={<ProductDetailPage/>}/>
                                <Route path="/carrito" element={<CartPage/>}/>
                                <Route path="/perfil" element={<CustomerPage/>}/>
                                <Route path="/checkout/:orderId" element={<CheckoutPage/>}/>
                                <Route path="/orden-confirmada/:orderId" element={<OrderConfirmationPage/>}/>
                            </Route>
                            <Route path="/admin/login" element={<AdminThemeProvider><LoginPage/></AdminThemeProvider>}/>
                            {/* --- Rutas Protegidas del Admin --- */}
                            <Route path="/admin" element={<ProtectedRoute/>}>
                                <Route element={<AdminThemeProvider><DashboardLayout/></AdminThemeProvider>}>
                                    <Route index element={<DashboardPage/>}/>
                                    <Route path="users" element={<UsersPage/>}/>
                                    <Route path="categories" element={<CategoriesPage/>}/>
                                    <Route path="attributes" element={<AttributesPage/>}/>
                                    <Route path="products" element={<ProductsPage/>}/>
                                    <Route path="providers" element={<ProvidersPage/>}/>
                                    <Route path="inventory" element={<InventoryPage/>}/>
                                    <Route path="emprende" element={<EmprendePage/>}/>
                                    <Route path="payment-methods" element={<PaymentMethodsPage/>}/>
                                    <Route path="orders" element={<OrdersPage/>}/>
                                    <Route path="shipments" element={<ShipmentsPage/>}/>
                                    <Route path="*" element={<Navigate to="/admin" replace/>}/>
                                </Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </CartProvider>
            </UserAuthProvider>
        </NotificationProvider>
    );
}

export default App;