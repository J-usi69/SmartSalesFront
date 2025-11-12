import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast";
import CreateProductDialog from "./createProduct";
import EditProductDialog from "./editProduct";
import DeleteProductDialog from "./deleteProduct";
import { AppConfig } from "@/config/app-config";

interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  size: string;
  stock: number;
  stock_minimo:number;
  price: number;
  brand: string;
  category: Category; // Agregamos la categoría
}

export default function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    fetchProducts();
    fetchCategories(); 
  }, []);
   
  const fetchProducts = () => {
    fetch(`${AppConfig.API_URL}/products/`)
    
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error al obtener productos:", error))
      .finally(() => setLoading(false));
  };
  const fetchCategories = () => {
    fetch(`${AppConfig.API_URL}/categories/`)
      .then((response) => response.json())
      .then((data: Category[]) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error al obtener categorías:", error));
  };
  
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
  
    fetch(`${AppConfig.API_URL}/products/delete/${selectedProduct.id}/`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al eliminar el producto");
        setProducts(products.filter((product) => product.id !== selectedProduct.id));
        toast.success("Producto eliminado exitosamente");
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("No se pudo eliminar el producto");
      })
      .finally(() => {
        setOpenDelete(false);
        setSelectedProduct(null);
      });
  }; 
  const handleEditClick = (product: Product) => {
    setSelectedProduct(null);
    setTimeout(() => {
      setSelectedProduct(product);
      setOpenEdit(true);
    }, 0);
  };
  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(null);
    setTimeout(() => {
      setSelectedProduct(product);
      setOpenDelete(true);
    }, 0);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Lista de Productos</h2>
        <Button variant="default" onClick={() => setOpenCreate(true)}>
          <Plus className="w-4 h-4 mr-2" /> Crear Producto
        </Button>
      </div>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Stock Minimo</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell><img src={product.image} alt={product.name} className="w-12 h-12 object-cover" /></TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.size}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.stock_minimo}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(product)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(product)}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">No hay productos disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
     <CreateProductDialog 
      open={openCreate} 
      onClose={() => setOpenCreate(false)} 
      onProductCreated={(newProduct) => setProducts([...products, newProduct])} 
      categories={categories} // Agrega este prop con la lista de categorías
    />
      
      <EditProductDialog 
        open={openEdit} 
        onClose={() => setOpenEdit(false)} 
        product={selectedProduct} 
        fetchProducts={fetchProducts} 
      />
      
      <DeleteProductDialog
      open={openDelete}
      onClose={() => setOpenDelete(false)}
      onDelete={handleDeleteProduct}
      productName={selectedProduct?.name}
     />

    </div>
  );
}

