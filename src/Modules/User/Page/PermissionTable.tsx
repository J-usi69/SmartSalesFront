
import  { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import CreatePermissionDialog  from "./CreatePermission";
import EditPermissionDialog from "./EditPermission";
import DeletePermissionDialog from "./DeletePermission";
import { AppConfig } from "@/config/app-config";
//  Definir interfaces

interface Permission {
  id: number;
  name: string;
}
export default function PermissionsTable() {
  const [permissions, setPermission] = useState<Permission[]>([]); // Lista de permisos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [openCreate, setOpenCreate] = useState(false); // Diálogo de creación
  const [openEdit, setOpenEdit] = useState(false); // Diálogo de edición
  const [openDelete, setOpenDelete] = useState(false); // Diálogo de eliminación
//   const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermission , setselectedPermission] = useState<Permission | null>(null);
  const handleEditClick = (permission: Permission) => {
    setselectedPermission(null); // 🔹 Reinicia para evitar errores previos
    setTimeout(() => {
        setselectedPermission(permission);
      setOpenEdit(true); // 🔹 Asegura que el modal se abra correctamente
    }, 0);
  };
  // 🔹 Función para abrir el diálogo de eliminación de rol
  const handleDeleteClick = (permission: Permission) => {
    setselectedPermission(null); // 🔹 Reinicia para evitar errores previos
    setTimeout(() => {
        setselectedPermission(permission);
      setOpenDelete(true); // 🔹 Asegura que el modal se abra correctamente
    }, 0);
  };
   
  useEffect(() => {
    fetchPermissions();
  }, []);
  //Lista de los permisos
  // const fetchPermissions= () => {
  //   fetch(`${AppConfig.API_URL}/permissions/`)
  //     .then((response) => response.json())
  //     .then((data: Permission[]) => {
  //       setPermission(data);
  //     })
  //     .catch((error) => console.error("Error al obtener permisos:", error))
  //     .finally(() => setLoading(false));
  // };

    const fetchPermissions= () => {
    fetch(`${AppConfig.API_URL}/permissions/`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then((data: Permission[]) => setPermission(data))
      .catch((error) => console.error("Error al obtener permisos:", error))
      .finally(() => setLoading(false));
     };

  const handleDeletePermission = () => {
    if (!selectedPermission) return;
    fetch(`${AppConfig.API_URL}/permissions/${selectedPermission.id}`, {
      method: "DELETE",
    })
      .then((response) => {
       
        if (!response.ok) throw new Error("Error al eliminar el permiso");
        setPermission(permissions.filter((permission) => permission.id !== selectedPermission.id));
        toast.success("Permiso eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar el permiso");
      })
      .finally(() => {
        setOpenDelete(false);
        setselectedPermission(null);
      });
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Permisos</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Permiso
        </Button>
      </div>
      {loading ? (
        <p>Cargando permisos...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length > 0 ? (
              permissions.map((permiso) => (
                <TableRow key={permiso.id}>
                  <TableCell>{permiso.id}</TableCell>
                  <TableCell>{permiso.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(permiso)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(permiso)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">No hay roles disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
<CreatePermissionDialog 
  open={openCreate} 
  onClose={() => setOpenCreate(false)} 
  onPermissionCreated={(newPermission) => setPermission([...permissions, newPermission])}
/>     
<EditPermissionDialog 
  open={openEdit} 
  onClose={() => setOpenEdit(false)} 
  permission={selectedPermission} 
  fetchPermissions={fetchPermissions} // ✅ Usamos fetchRoles para recargar la tabla
/>
 
<DeletePermissionDialog 
open={openDelete}
 onClose={() => setOpenDelete(false)} 
 onDelete={handleDeletePermission} />
    </div>
  );
}
