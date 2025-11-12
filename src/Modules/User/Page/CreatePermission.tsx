
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";
interface CreatePermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onPermissionCreated: (newPermission: any) => void;
}
export default function CreatePermission({ open, onClose, onPermissionCreated }: CreatePermissionDialogProps) {
  const [permissionName, setPermissionName] = useState("");
  // 🔹 Crear un nuevo permiso
  const handleCreatePermission = () => {
    if (!permissionName.trim()) {
      toast.error("El nombre del permiso es obligatorio.");
      return;
    }
    const newPermission = { name: permissionName };
    fetch(`${AppConfig.API_URL}/permissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPermission),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear el permiso");
        return response.json();
      })
      .then((createdPermission) => {
        onPermissionCreated(createdPermission);
        toast.success("Permiso creado exitosamente");
        onClose();
        setPermissionName("");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear el permiso");
      });
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Permiso</DialogTitle>
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
          <Button variant="default" onClick={handleCreatePermission}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

