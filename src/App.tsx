import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import DashboardLayout from "./app/dashboard/layout"; // Importamos el Layout
// import WellcomePage from "./app/dashboard/page"; // Página principal del Dashboard
// import PanelDeControl from "./app/dashboard/panel-de-control/page";
// import Perfiles from "./app/dashboard/perfiles/page";
// import Settings from "./app/dashboard/settings/page";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./routes/ProtecteRuote";
import PageLogin from "./app/login/page";
import UsersTable from "./Modules/User/Page/userTable";
import RolesTable from "./Modules/User/Page/RolesTable";
import PermissionsTable from "./Modules/User/Page/PermissionTable";
import ProductTable from "./Modules/Inventario/Page/productsTable";
import CategoriesTable from "./Modules/Inventario/Page/categoriesTable";
import { Toaster } from "react-hot-toast"; //  Importamos Toaster
import TopSellingProductsReport from "./Modules/Reportes/TopSellingProductsReport";
import ProductsByCustomerReport from './Modules/Reportes/ProductsByCustomerReport';
// import page from "./app/dashboard/page";
import WelcomePage from "./app/dashboard/page";



const AppRoutes = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Router>
      <Toaster position="bottom-right" /> {/*  Agregamos Toaster aquí */}
      <Routes>
        {/* Ruta principal con el Login */}
        <Route path="/" element={<PageLogin />} />

        {/* Dashboard con Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="/dashboard" element={<WelcomePage />} />
            <Route path="usuarios" element={<UsersTable />} />
            <Route path="roles" element={<RolesTable />} />
            <Route path="permisos" element={<PermissionsTable />} />
            <Route path="productos" element={<ProductTable />} />
            <Route path="categorias" element={<CategoriesTable />} />
            <Route path="reporte-productos" element={<TopSellingProductsReport />} /> 
            <Route path="reporte-compras-cliente" element={<ProductsByCustomerReport />} />

          </Route>
        </Route>
      </Routes>
    </Router>
  </ThemeProvider>
  );
};

export default AppRoutes;

