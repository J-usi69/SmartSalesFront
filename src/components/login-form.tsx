import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "@/lib/api" // asegúrate de que este archivo exista y esté bien configurado
import { User } from "lucide-react"
import { AppConfig } from "@/config/app-config";
const verificarStockBajo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`${AppConfig.API_URL}/products/alerta-stock/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error al verificar el stock bajo:", error);
  }
};
export function LoginForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await api.post("/token/", {
        email,
        password,
      })

      const { access } = response.data as { access: string }
      localStorage.setItem("token", access)
    
      navigate("/dashboard") // o la ruta que tengas configurada
        // Luego de un pequeño retardo, llama la verificación
          setTimeout(() => {
            verificarStockBajo();
          }, 500); // medio segundo
    } catch (err: any) {
      console.error(err)
      setError("Email o contraseña incorrectos")
    }
  }

 
  return (
    <div className="min-h-screen bg-[url('/fondo-login.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="bg-white/90 dark:bg-black/90 rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary text-white p-3 rounded-full">
            <User size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-6 text-primary">Bienvenido de nuevo</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ejemplo:Gabi111@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ejemplo:111"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        <div className="text-sm text-muted-foreground mt-6 space-y-1">
          <p className="hover:underline cursor-pointer">¿Olvidaste tu contraseña?</p>
          <p className="hover:underline cursor-pointer">¿No tienes una cuenta?</p>
        </div>
      </div>
    </div>
  )
}