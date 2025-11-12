import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface EditCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  fetchCategories: () => void;
}

export default function EditCategoryDialog({
  open,
  onClose,
  category,
  fetchCategories,
}: EditCategoryDialogProps) {
  const [editedCategory, setEditedCategory] = useState<Category>({
    id: 0,
    name: "",
    description: "",
  });

  // Cargar los datos cuando se abre el modal
  useEffect(() => {
    if (category) {
      setEditedCategory(category);
    }
  }, [category]);

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCategory((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios en la categoría
  const handleSaveCategory = () => {
    if (!editedCategory.name.trim() || !editedCategory.description.trim()) {
      toast.error("El nombre y la descripción son obligatorios.");
      return;
    }
    fetch(`${AppConfig.API_URL}/categories/update/${editedCategory.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedCategory),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar la categoría");
        return response.json();
      })
      .then(() => {
        toast.success("Categoría actualizada exitosamente");
        fetchCategories(); //  Actualizar la lista de categorías
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo actualizar la categoría");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Categoría</DialogTitle>
        </DialogHeader>
        
        {/* Campos de la Categoría */}
        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <Input type="text" name="name" value={editedCategory.name} onChange={handleChange} />
        </label>
        <label className="block">
          <span className="text-sm font-medium">Descripción</span>
          <Input type="text" name="description" value={editedCategory.description} onChange={handleChange} />
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleSaveCategory}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
