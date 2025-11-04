import * as React from "react";
import { GalleryVerticalEnd, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavMainMediun } from "@/components/nav-main-mediun";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import LogoutButton from "@/app/dashboard/siderbar"; // Asegúrate que exista

const data = {
  navMain: [
    {
      title: "Gestion De Usuario",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Usuarios", url: "usuarios" },
        { title: "Roles", url: "roles" },
        { title: "Permisos", url: "permisos" },
      ],
    },
  ],
  navMainMediun: [
    {
      title: "Inventario",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Productos", url: "productos" },
        { title: "Categorias", url: "categorias" },
        { title: "Reportes de Producto", url: "reporte-productos" },
        { title: "Reportes de cliente", url: "reporte-compras-cliente" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="bg-gradient-to-b from-red-800 to-red-900 text-white shadow-xl"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2 text-xl font-bold px-4 py-4 tracking-wide">
          <GalleryVerticalEnd className="w-8 h-8 text-white" />
          <span>Electronic</span>
        </div>
        <hr className="border-white/20 my-2" />
      </SidebarHeader>

      <SidebarContent className="space-y-2 px-2">
        <NavMain items={data.navMain} />
        <hr className="border-white/20 my-2" />
        <NavMainMediun items={data.navMainMediun} />
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 mt-auto">
        {/* <LogoutButton /> */}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
