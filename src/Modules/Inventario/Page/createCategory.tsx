import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface CreateCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onCategoryCreated: (newCategory: any) => void;
}

export default function CreateCategory({ open, onClose, onCategoryCreated }: CreateCategoryDialogProps) {
  const [category, setCategory] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCategory = () => {
    if (!category.name.trim() || !category.description.trim()) {
      toast.error("El nombre y la descripción son obligatorios.");
      return;
    }

    fetch(`${AppConfig.API_URL}/api/categories/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })
    
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear la categoría");
        return response.json();
      })
      .then((createdCategory) => {
        onCategoryCreated(createdCategory);
        toast.success("Categoría creada exitosamente");
        onClose();
        setCategory({ name: "", description: "" });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear la categoría");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Categoría</DialogTitle>
        </DialogHeader>

        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <Input type="text" name="name" value={category.name} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Descripción</span>
          <Input type="text" name="description" value={category.description} onChange={handleChange} />
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreateCategory}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
