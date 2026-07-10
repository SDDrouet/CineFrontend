import {
  LayoutDashboard,
  Ticket,
  Clapperboard,
  LogOut,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    title: "Dashboard",
    url: "/app/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mis reservas",
    url: "/app/mis-reservas",
    icon: Ticket,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <ShadcnSidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
    >

      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500">
          <Clapperboard className="h-5 w-5 text-white" />
        </div>

        <div className="group-data-[collapsible=icon]:hidden">
          <h1 className="font-bold">
            Cine
            <span className="text-amber-500">
              Reservas
            </span>
          </h1>

          <p className="text-xs text-zinc-500">
            Panel administrativo
          </p>
        </div>
      </div>


      <SidebarContent>

        <SidebarGroup>

          <SidebarGroupLabel>
            Menú principal
          </SidebarGroupLabel>


          <SidebarGroupContent>

            <SidebarMenu>

              {menuItems.map((item) => {
                const Icon = item.icon;

                const active =
                  location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>

                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                    >

                      <Link to={item.url}>

                        <Icon />

                        <span>
                          {item.title}
                        </span>

                      </Link>

                    </SidebarMenuButton>

                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>


      <SidebarFooter>

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              tooltip="Cerrar sesión"
              onClick={handleLogout}
            >

              <LogOut />

              <span>
                Cerrar sesión
              </span>

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarFooter>


    </ShadcnSidebar>
  );
}