import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface Permission {
  id: number;
  name: string;
}

interface EditPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  permission: Permission | null;
  fetchPermissions: () => void;
}

export default function EditPermissionDialog({ open, onClose, permission, fetchPermissions }: EditPermissionDialogProps) {
  const [permissionName, setPermissionName] = useState("");

  // Cargar datos del permiso cuando se abre el modal
  useEffect(() => {
    if (permission) {
      setPermissionName(permission.name);
    }
  }, [permission]);

  // Guardar los cambios del permiso
  const handleSavePermission = () => {
    if (!permission) return;
    if (!permissionName.trim()) {
      toast.error("El nombre del permiso es obligatorio.");
      return;
    }

    const updatedPermission = { id: permission.id, name: permissionName };

    fetch(`${AppConfig.API_URL}/permissions/${permission.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPermission),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar el permiso");
        return response.json();
      })
      .then(() => {
        toast.success("Permiso actualizado exitosamente");
        fetchPermissions(); // ✅ Llamamos a fetchPermissions para actualizar la lista
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo actualizar el permiso");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Permiso</DialogTitle>
        </DialogHeader>

        {/* Nombre del Permiso */}
        <label className="block">
          <span className="text-sm font-medium">Nombre del Permiso</span>
          <Input
            type="text"
            value={permissionName}
            onChange={(e) => setPermissionName(e.target.value)}
          />
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSavePermission}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
