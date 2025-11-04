import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Product } from "./productsTable";
import { AppConfig } from "@/config/app-config";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface EditProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  fetchProducts: () => void;
}

export default function EditProductDialog({ open, onClose, product, fetchProducts }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }

    // Cargar categorías
    fetch(`${AppConfig.API_URL}/categories/`)
      .then((response) => response.json())
      .then((data: Category[]) => setCategories(data))
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
        toast.error("No se pudo cargar las categorías");
      });
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "category"
          ? { id: Number(value), name: "", description: "" }  // solo usamos el ID
          : name === "price" || name === "stock"|| name === "stock_minimo"
          ? Number(value)
          : value,
      };
    });
  };
  

  const handleSave = () => {
    if (!editedProduct || !editedProduct.name.trim() || editedProduct.price == null || editedProduct.stock == null || editedProduct.category.id == null) {
      toast.error("El nombre, precio, stock y categoría son obligatorios.");
      return;
    }
    fetch(`${AppConfig.API_URL}/products/update/${editedProduct.id}/`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...editedProduct,
        category: editedProduct.category.id  // Solo mandás el ID
      }),
    })
  
      .then((response) => {
        if (!response.ok) throw new Error("Error al editar el producto");
        return response.json();
      })
      
      .then(() => {
        toast.success("Producto actualizado exitosamente");
        fetchProducts(); // Refrescar lista de productos
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo actualizar el producto");
      });
      console.log(editedProduct)
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>

        {/* Imagen */}
        <label className="block">
          <span className="text-sm font-medium">URL de la Imagen</span>
          <Input
            type="text"
            name="image"
            value={editedProduct?.image || ""}
            onChange={handleChange}
          />
        </label>

        {editedProduct?.image && (
          <div className="mt-2 flex justify-center">
            <img src={editedProduct.image} alt="Vista previa" className="w-48 h-48 object-cover border rounded" />
          </div>
        )}

        {/* Nombre */}
        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <Input
            type="text"
            name="name"
            value={editedProduct?.name || ""}
            onChange={handleChange}
          />
        </label>

        {/* Descripción */}
        <label className="block">
          <span className="text-sm font-medium">Descripción</span>
          <Input
            type="text"
            name="description"
            value={editedProduct?.description || ""}
            onChange={handleChange}
          />
        </label>

        {/* Tamaño */}
        <label className="block">
          <span className="text-sm font-medium">Tamaño</span>
          <Input
            type="text"
            name="size"
            value={editedProduct?.size || ""}
            onChange={handleChange}
          />
        </label>

        {/* Stock */}
        <label className="block">
          <span className="text-sm font-medium">Stock</span>
          <Input
            type="number"
            name="stock"
            value={editedProduct?.stock || ""}
            onChange={handleChange}
          />
        </label>
            {/* Stock minimo*/}
        <label className="block">
              <span className="text-sm font-medium">Stock mínimo</span>
              <Input
                type="number"
                name="stock_minimo"
                value={editedProduct?.stock_minimo || 0}
                onChange={handleChange}
              />
            </label>
        {/* Precio */}
        <label className="block">
          <span className="text-sm font-medium">Precio</span>
          <Input
            type="number"
            name="price"
            value={editedProduct?.price || ""}
            onChange={handleChange}
          />
        </label>

        {/* Marca */}
        <label className="block">
          <span className="text-sm font-medium">Marca</span>
          <Input
            type="text"
            name="brand"
            value={editedProduct?.brand || ""}
            onChange={handleChange}
          />
        </label>

        {/* Categoría */}
        <label className="block">
          <span className="text-sm font-medium">Categoría</span>
          <select
            name="category"
            value={editedProduct?.category.id || ""}
            onChange={handleChange}
            className="w-full mt-2"
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <DialogFooter>
          <Button variant="default" onClick={handleSave}>
            Guardar
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
