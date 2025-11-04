import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

import CreateCategoryDialog from "./createCategory";
import EditCategoryDialog from "./editCategory";
import DeleteCategoryDialog from "./deleteCategory";
import { AppConfig } from "@/config/app-config";

// Definir interfaz para Categoría
interface Category {
  id: number;
  name: string;
  description: string;
  creation_date: string;
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch(`${AppConfig.API_URL}/categories/`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error al obtener categorías:", error))
      .finally(() => setLoading(false));
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;

    fetch(`${AppConfig.API_URL}/categories/delete/${selectedCategory.id}/`, {
      method: "DELETE",
    })
    
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar la categoría");
        setCategories(categories.filter((category) => category.id !== selectedCategory.id));
        toast.success("Categoría eliminada exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar la categoría");
      })
      .finally(() => {
        setOpenDelete(false);
        setSelectedCategory(null);
      });
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(null);
    setTimeout(() => {
        setSelectedCategory(category);
        setOpenEdit(true);
      }, 0);
  };
  
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(null);
    setTimeout(() => {
      setSelectedCategory(category);
      setOpenDelete(true);
    }, 0);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Categorías</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Categoría
        </Button>
      </div>
      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha de Creación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{format(new Date(category.creation_date), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No hay categorías disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <CreateCategoryDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCategoryCreated={(newCategory) => setCategories([...categories, newCategory])}
      />
      <EditCategoryDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        category={selectedCategory}
        fetchCategories={fetchCategories}
      />
      <DeleteCategoryDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDeleteCategory}
        categoryName={selectedCategory?.name}
        />

    </div>
  );
}
