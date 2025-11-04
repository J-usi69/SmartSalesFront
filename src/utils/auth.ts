import { jwtDecode } from "jwt-decode";

export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true; // Si no hay token, está expirado

  try {
    const decoded: { exp: number } = jwtDecode(token); // Decodifica el token
    return decoded.exp * 1000 < Date.now(); // Compara la expiración con la hora actual
  } catch (error) {
    return true; // Si hay error, el token es inválido
  }
};
