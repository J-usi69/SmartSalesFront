import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { toast } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AppConfig } from "@/config/app-config";

interface CustomerProduct {
  product__id: number;
  product__name: string;
  product__brand: string;
  product__category__name: string;
  cantidad_total: number;
  precio_unitario: number;
  subtotal: number;
}

export default function ProductsByCustomerReport() {
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = () => {
    if (!email || !startDate || !endDate) {
      toast.error("Completa todos los campos.");
      return;
    }

    setLoading(true);
    fetch(`${AppConfig.API_URL}/report/products-by-customer/?email=${email}&start_date=${startDate}&end_date=${endDate}`, {
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
    doc.text(`Compras del cliente: ${email}`, 14, 20);
    doc.text(`Desde: ${startDate}  Hasta: ${endDate}`, 14, 28);

    autoTable(doc, {
        startY: 35,
        head: [[
        "ID", "Nombre", "Marca", "Categoría",
        "Cantidad", "Precio Unitario", "Subtotal"
        ]],
        body: data.map(item => [
        item.product__id,
        item.product__name,
        item.product__brand,
        item.product__category__name,
        item.cantidad_total,
        `$${item.precio_unitario.toFixed(2)}`,
        `$${item.subtotal.toFixed(2)}`
        ]),
    });

    doc.save(`compras_cliente_${email}.pdf`);
    };
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Productos comprados por cliente</h2>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-sm">Email del cliente</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
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
     

      {data.length > 0 ? (
        <>
            <div className="flex justify-end mb-4">
            <Button variant="secondary" onClick={exportToPDF}>
                Exportar a PDF
            </Button>
            </div>

            <Table className="mt-6">
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unitario</TableHead>
                <TableHead>Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                <TableRow key={index}>
                    <TableCell>{item.product__id}</TableCell>
                    <TableCell>{item.product__name}</TableCell>
                    <TableCell>{item.product__brand}</TableCell>
                    <TableCell>{item.product__category__name}</TableCell>
                    <TableCell>{item.cantidad_total}</TableCell>
                    <TableCell>${item.precio_unitario.toFixed(2)}</TableCell>
                    <TableCell>${item.subtotal.toFixed(2)}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </>
        ) : (
        !loading && <p className="text-muted-foreground mt-4">No se encontraron compras para este cliente en ese rango de fechas.</p>
        )}

    </div>
  );
}
