import { Navigate, Outlet } from "react-router-dom";
import { isTokenExpired } from "@/utils/auth"; // Importamos la función de expiración

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");

    // 🔹 Si no hay token o está expirado, redirigir al Login
    if (!token || isTokenExpired()) {
      localStorage.removeItem("token"); //  Borra el token solo si está expirado
      return <Navigate to="/" replace />;
    }

  return <Outlet />;
};

export default ProtectedRoute;
