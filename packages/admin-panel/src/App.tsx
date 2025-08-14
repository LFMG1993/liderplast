import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardLayout from "./components/DashboardLayout.tsx";
import UsersPage from "./pages/UsersPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import SuppliersPage from "./pages/SuppliersPage.tsx";
import InventoryPage from "./pages/InventoryPage.tsx";
import CategoriesPage from "./pages/CategoriesPage.tsx";
import AttributesPage from "./pages/AttributesPage.tsx";
import {NotificationProvider} from "./providers/NotificationProvider.tsx";

function App() {
    return (
        <AuthProvider>
            <NotificationProvider>
                <BrowserRouter basename="/admin">
                    <Routes>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route element={<ProtectedRoute/>}>
                            <Route element={<DashboardLayout/>}>
                                <Route path="dashboard" element={<DashboardPage/>}/>
                                <Route path="users" element={<UsersPage/>}/>
                                <Route path="categories" element={<CategoriesPage/>}/>
                                <Route path="attributes" element={<AttributesPage/>}/>
                                <Route path="products" element={<ProductsPage/>}/>
                                <Route path="suppliers" element={<SuppliersPage/>}/>
                                <Route path="inventory" element={<InventoryPage/>}/>
                                <Route index element={<Navigate to="/dashboard" replace/>}/>
                                <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </AuthProvider>
    );
}

export default App;