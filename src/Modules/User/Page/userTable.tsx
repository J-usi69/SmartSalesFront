
import  { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"; 
import DeleteUserDialog from "./DeleteUser";
import EditUserDialog from "./EditUser";
import CreateUserDialog from "./CreateUser";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";


interface Role {
  id: number;
  name: string;
}

export interface User {
  roles?: Role;
  id: number;
  username: string;
  password?: string;
  lastname: string;
  country: string;
  email: string;
  role_id: number;
}


export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  // const [open, setOpen] = useState(false); //  Estado para abrir/cerrar el diálogo

  const [newUser, setNewUser] = useState<User>({
    id: 0,
    username: "",
    password: "",
    lastname: "",
    country: "",
    email: "",
    role_id: 0,
  });

  useEffect(() => {
    fetch(`${AppConfig.API_URL}/users/`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No autorizado");
        }
        return response.json();
      })
      .then((data: User[]) => {
        console.log("Usuarios obtenidos:", data);
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      })
      .finally(() => setLoading(false));
  }, []);
  

  //  Obtener roles cuando se abre el formulario de creación
  // useEffect(() => {
  //   if (openCreate || openEdit) {
  //     fetch("http://localhost:8000/api/roles/") //  Endpoint para obtener roles
  //       .then((response) => response.json())
  //       .then((data: Role[]) => setRoles(data))
  //       .catch((error) => console.error("Error al obtener roles:", error));
  //   }
  // }, [openCreate, openEdit]);
  useEffect(() => {
    fetch(`${AppConfig.API_URL}/roles/`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("No autorizado");
        return response.json();
      })
      .then((data: Role[]) => setRoles(data))
      .catch((error) => console.error("Error al obtener roles:", error));
  }, []);
  
  

  //  Función para abrir el diálogo de confirmación
  const handleDeleteClick = (user: User) => {
    setSelectedUser(null); //  Reinicia el usuario seleccionado para evitar errores previos
    setTimeout(() => {
      setSelectedUser(user);
      setOpenDelete(true); //  Asegura que el diálogo se abra correctamente
    }, 0); // 🔹 Pequeño delay para asegurarse de que el estado se actualiza correctamente
  };
  
  const handleEditClick = (user: User) => {
    setEditedUser(null); //  Reinicia el estado antes de asignar el nuevo usuario
    setTimeout(() => {
      setEditedUser(user);
      setOpenEdit(true); //  Asegura que el diálogo se abra correctamente
    }, 0);
  };

  //  Función para eliminar el usuario
  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    
    setOpenDelete(false);
    fetch(`${AppConfig.API_URL}/users/delete/${selectedUser.id}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar el usuario");
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        toast.success("Usuario eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar el usuario");
      })
      .finally(() => {
        setTimeout(() => setSelectedUser(null), 300); // Reiniciar usuario después de cerrar el diálogo
      });
  };
  //PARA EDITAR
  const handleEditConfirm = () => {
    if (!editedUser) return;
  
    const userUpdate = { ...editedUser };
    delete userUpdate.roles;
    delete userUpdate.password;
  
    console.log("Enviando usuario editado:", userUpdate);
  
    fetch(`${AppConfig.API_URL}/users/update/${editedUser.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(userUpdate),
    })
      .then(async (response) => {
        console.log("Respuesta cruda:", response);
  
        if (!response.ok) {
          const errorText = await response.text(); // en caso de error plano
          throw new Error(errorText || "Error desconocido");
        }
  
        return response.json(); // ahora sí es seguro
      })
      .then((updatedUser) => {
        console.log("Usuario actualizado correctamente:", updatedUser);
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
        toast.success("Usuario actualizado exitosamente");
      })
      .catch((error) => {
        console.error("Error al actualizar:", error);
        toast.error("No se pudo actualizar el usuario");
      })
      .finally(() => {
        setOpenEdit(false);
        setTimeout(() => setEditedUser(null), 300);
      });
  };  


//  Función para abrir el diálogo de creación de usuario
const handleCreateConfirm = () => {
  // Copiar el usuario a enviar
  const userToCreate = { ...newUser };
  // Eliminar campos que no deben enviarse (solo lectura)
  delete userToCreate.roles;
  // Validación básica (opcional)
  if (!userToCreate.password || !userToCreate.email || !userToCreate.username) {
    toast.error("Todos los campos obligatorios deben completarse");
    return;
  }

  fetch(`${AppConfig.API_URL}/users/create/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userToCreate),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error desconocido");
      }
      return response.json();
    })
    .then((createdUser) => {
      console.log("Usuario creado correctamente:", createdUser);

      return fetch(`${AppConfig.API_URL}/users/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        }
      });
    })
    .then((res) => res.json())
    .then((updatedUsers: User[]) => {
      setUsers(updatedUsers);
      toast.success("Usuario creado exitosamente");
      setOpenCreate(false);
      setNewUser({
        id: 0,
        username: "",
        password: "",
        lastname: "",
        country: "",
        email: "",
        role_id: 0,
      });
    })
    .catch((error) => {
      console.error("Error al crear:", error);
      toast.error("No se pudo crear el usuario");
    });
};

  
  // setNewUser({...newUser, username: 'hola mundo'})
  // console.log(newUser.firstname)
  return (
    <div className="p-6">
        {/*  Botón para abrir el diálogo de creación de usuario */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Usuarios</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Usuario
        </Button>
      </div>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {/* <TableHead>Contrasena</TableHead> */}
              <TableHead>Email</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id ?? Math.random()}>
                  <TableCell>{user.id ?? "Sin ID"}</TableCell>
                  {/* <TableCell>{user.password ?? "Sin Contrasena"}</TableCell> */}
                  <TableCell>{user.email ?? "Sin Email"}</TableCell>
                  <TableCell>{user.username ?? "Sin Usuario"}</TableCell>
                  <TableCell>{user.lastname ?? "Sin Apellido"}</TableCell>
                  <TableCell>{user.country ?? "Sin País"}</TableCell>
                  <TableCell>{user.roles?.name?? "Sin Rol"}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                          <MoreVertical size={20} />
                    </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                       <DropdownMenuItem onClick={() => handleEditClick(user)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No hay usuarios disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}



      {/* Diálogos Importados */}
      <DeleteUserDialog 
      open={openDelete}
       onClose={() => setOpenDelete(false)} 
       onDelete={handleDeleteConfirm} 
       username={selectedUser?.username} />
      <EditUserDialog open={openEdit} onClose={() => setOpenEdit(false)} onSave={handleEditConfirm} user={editedUser} setUser={setEditedUser} roles={roles} />
      <CreateUserDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreate={handleCreateConfirm}
        user={newUser}
        setUser={setNewUser}
        roles={roles}
        isAdmin={true}
        />

    </div>
  );
}
