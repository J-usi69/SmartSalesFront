import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { AppConfig } from "@/config/app-config";

interface Notification {
  id: number;
  name: string;
  stock: number;
  stock_minimo: number;
}


export default function Header() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Obtener notificaciones de productos con bajo stock
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${AppConfig.API_URL}/products/alerta-stock-sms/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data: Notification[] = await response.json();
          setNotifications(data);
        } else {
          console.error("Error al cargar notificaciones.");
        }
      } catch (error) {
        console.error("Error al obtener notificaciones:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-full bg-primary text-white px-6 py-3 flex justify-between items-center shadow-md z-50">
      <h1 className="text-lg font-semibold">Panel de Administración</h1>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-white hover:bg-primary/80 relative">
              <Bell className="w-5 h-5" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-80 bg-white dark:bg-gray-900 text-black dark:text-white shadow-xl rounded-lg p-2"
            >
            {notifications.length > 0 ? (
                notifications.map((product) => (
                <DropdownMenuItem
                    key={product.id}
                    className="flex flex-col items-start p-3 rounded-md hover:bg-muted"
                >
                    <span className="font-semibold text-sm text-destructive">
                    Stock bajo: {product.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                    Solo quedan {product.stock} unidades. Mínimo recomendado: {product.stock_minimo}
                    </span>
                </DropdownMenuItem>
                ))
            ) : (
                <DropdownMenuItem className="text-muted-foreground">Sin notificaciones</DropdownMenuItem>
            )}
          </DropdownMenuContent>

        </DropdownMenu>

        <Button variant="destructive" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
