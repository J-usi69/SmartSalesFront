
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";

interface Category {
  id: number;
  name: string;
  description:string;
}

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onProductCreated: (newProduct: any) => void;
  categories: Category[]; // Definir el tipo correctamente
}

export default function CreateProduct({ open, onClose, onProductCreated }: CreateProductDialogProps) {
  const [product, setProduct] = useState({
    image: "",
    name: "",
    description: "",
    size: "",
    stock: 0,
    stock_minimo: 5, // nuevo campo editable
    price: 0,
    brand: "",
    category: null as number | null, // Asegúrate de que 'category' esté presente
  });
  const [categories, setCategories] = useState([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "category" || name === "price" || name === "stock_minimo"|| name === "stock" ? Number(value) : value,
    }));    
  };

  useEffect(()=>{
    fetch(`${AppConfig.API_URL}/categories/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear el producto");
        return response.json();
      })
      .then((data) => {
        setCategories(data)
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear el producto");
      });
  }, [])

  const handleCreateProduct = () => {
    if (!product.name.trim() || product.price == null || product.stock == null || product.category == null || product.stock_minimo == null ) {
      toast.error("El nombre, precio, stock y categoría son obligatorios.");
      return;
    }

    fetch(`${AppConfig.API_URL}/products/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al crear el producto");
        return response.json();
      })
      .then((createdProduct) => {
        onProductCreated(createdProduct);
        toast.success("Producto creado exitosamente");
        onClose();
        setProduct({ image: "", name: "", description: "", size: "", stock: 0, stock_minimo : 5, price: 0, brand: "", category:0 });
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo crear el producto");
      });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Producto</DialogTitle>
        </DialogHeader>

        {/* URL de la Imagen */}
        <label className="block">
          <span className="text-sm font-medium">URL de la Imagen</span>
          <Input type="text" name="image" value={product.image} onChange={handleChange} />
        </label>

        {/* Vista previa de la imagen */}
        {product.image && (
          <div className="mt-2 flex justify-center">
            <img src={product.image} alt="Vista previa" className="w-48 h-48 object-cover border rounded" />
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium">Nombre</span>
          <Input type="text" name="name" value={product.name} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Descripción</span>
          <Input type="text" name="description" value={product.description} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Tamaño</span>
          <Input type="text" name="size" value={product.size} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Stock</span>
          <Input type="number" name="stock" value={product.stock} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Stock mínimo</span>
          <Input type="number"name="stock_minimo" value={product.stock_minimo} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Precio</span>
          <Input type="number" name="price" value={product.price} onChange={handleChange} />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Marca</span>
          <Input type="text" name="brand" value={product.brand} onChange={handleChange} />
        </label>

        {/* Categoría */}
        <label className="block">
          <span className="text-sm font-medium">Categoría</span>
          <select name="category" value={product.category ?? ""} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Selecciona una categoría</option>
            {categories.map((category: Category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="default" onClick={handleCreateProduct}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
