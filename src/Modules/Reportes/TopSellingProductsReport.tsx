import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
// import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { AppConfig } from "@/config/app-config";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ProductReport {
  product_id: number;
  name: string;
  brand: string;
  category: string;
  average_unit_price: number;
  total_quantity_sold: number;
  total_sales: number;
}

export default function TopSellingProductsReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<ProductReport[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = () => {
    if (!startDate || !endDate) {
      toast.error("Selecciona ambas fechas");
      return;
    }

    setLoading(true);
    fetch(`${AppConfig.API_URL}/report/top-selling-products/?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener reporte");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error(err);
        toast.error("No se pudo obtener el reporte");
      })
      .finally(() => setLoading(false));
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Reporte de Productos Más Vendidos", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [[
        "ID", "Nombre", "Marca", "Categoría", 
        "Precio Prom.", "Cantidad Vendida", "Total Ventas"
      ]],
      body: data.map(prod => [
        prod.product_id,
        prod.name,
        prod.brand,
        prod.category,
        `$${prod.average_unit_price.toFixed(2)}`,
        prod.total_quantity_sold,
        `$${prod.total_sales.toFixed(2)}`
      ]),
    });

    doc.save("reporte_productos_mas_vendidos.pdf");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Reporte de Productos Más Vendidos</h2>

      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm">Desde</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Hasta</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Button onClick={fetchReport} disabled={loading}>
          {loading ? "Cargando..." : "Generar Reporte"}
          
        </Button>
      </div>

        {data.length > 0 && (
     <>
        <div className="flex justify-end mb-4">
        <Button variant="secondary" onClick={exportToPDF}>
            Exportar a PDF
        </Button>
        </div>

        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio Promedio</TableHead>
            <TableHead>Cantidad Vendida</TableHead>
            <TableHead>Total Ventas</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((prod) => (
            <TableRow key={prod.product_id}>
                <TableCell>{prod.product_id}</TableCell>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.brand}</TableCell>
                <TableCell>{prod.category}</TableCell>
                <TableCell>${prod.average_unit_price.toFixed(2)}</TableCell>
                <TableCell>{prod.total_quantity_sold}</TableCell>
                <TableCell>${prod.total_sales.toFixed(2)}</TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </>
    )}
    </div>
  );
}
