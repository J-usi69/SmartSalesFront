import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { requestFirebaseToken, listenToPushNotifications } from "@/firebase";
import Header from "@/components/Header";

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    requestFirebaseToken();
    listenToPushNotifications();
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    
  }, [navigate]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Header /> {/*  Agregamos el header */}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
