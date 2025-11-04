import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface Permission {
  id: number;
  name: string;
}

interface CreateRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onRoleCreated: (newRole: any) => void;
}

export default function CreateRole({
  open,
  onClose,
  onRoleCreated,
}: CreateRoleDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Obtener permisos
  useEffect(() => {
    if (open) {
      fetch(`${AppConfig.API_URL}/permissions/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data: Permission[]) => setPermissions(data))
        .catch((err) => console.error("Error al obtener permisos:", err));
    }
  }, [open]);

  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateRole = () => {
    if (!roleName.trim() || selectedPermissions.length === 0) {
      toast.error("El nombre del rol y al menos un permiso son requeridos.");
      return;
    }

    const newRole = {
      name: roleName,
      permissions: selectedPermissions, //  campo correcto para Django
    };

    fetch(`${AppConfig.API_URL}/roles/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newRole),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al crear el rol");
        return res.json();
      })
      .then((createdRole) => {
        onRoleCreated(createdRole);
        toast.success("Rol creado exitosamente");
        setRoleName("");
        setSelectedPermissions([]);
        onClose();
      })
      .catch((err) => {
        console.error("Error:", err);
        toast.error("No se pudo crear el rol");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Rol</DialogTitle>
        </DialogHeader>

        <label className="block">
          <span className="text-sm font-medium">Nombre del Rol</span>
          <Input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </label>

        <div className="mt-4">
          <span className="text-sm font-medium">Permisos</span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {permissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedPermissions.includes(perm.id)}
                  onCheckedChange={() => togglePermission(perm.id)}
                />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="default" onClick={handleCreateRole}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
