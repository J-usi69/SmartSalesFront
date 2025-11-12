import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  categoryName?: string;
}

export default function DeleteCategoryDialog({
  open,
  onClose,
  onDelete,
  categoryName,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar Categoría?</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar <b>{categoryName || "esta categoría"}</b>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
