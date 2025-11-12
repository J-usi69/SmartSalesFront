import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  lastname: string;
  country: string;
  role_id: number;
}

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  roles: Role[];
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, onSave, user, setUser, roles }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Usuario</Label>
            <Input
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
          </div>
          <div>
            <Label>Apellido</Label>
            <Input
              value={user.lastname}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            />
          </div>
          <div>
            <Label>País</Label>
            <Input
              value={user.country}
              onChange={(e) => setUser({ ...user, country: e.target.value })}
            />
          </div>
          <div>
            <Label>Rol</Label>
            <Select
              value={String(user.role_id)}
              onValueChange={(value) => setUser({ ...user, role_id: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
