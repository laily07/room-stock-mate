import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Clock,
} from "lucide-react";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentHouse?: string;
}

export function AppSidebar({ currentHouse }: AppSidebarProps) {
  const location = useLocation();

  // Dynamic menu items based on current house
  const menuItems = [
    {
      title: "Dashboard",
      url: `/house/${encodeURIComponent(currentHouse || "")}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      title: "Stok Barang", 
      url: `/house/${encodeURIComponent(currentHouse || "")}/stok-barang`,
      icon: Package,
    },
    {
      title: "Daftar Belanja",
      url: `/house/${encodeURIComponent(currentHouse || "")}/daftar-belanja`,
      icon: ShoppingCart,
    },
    {
      title: "Anggota",
      url: `/house/${encodeURIComponent(currentHouse || "")}/anggota`,
      icon: Users,
    },
    {
      title: "Laporan & Insight",
      url: `/house/${encodeURIComponent(currentHouse || "")}/laporan`,
      icon: BarChart3,
    },
    {
      title: "Timeline Aktivitas",
      url: `/house/${encodeURIComponent(currentHouse || "")}/timeline`,
      icon: Clock,
    },
  ];

  const isActive = (path: string) => location.pathname === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-accent";

  return (
    <SidebarPrimitive collapsible="none">
      <SidebarContent className="bg-sidebar-background">
        {/* House Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div>
            <h2 className="font-semibold text-sidebar-foreground truncate">
              {currentHouse || "Pilih Rumah"}
            </h2>
            <p className="text-xs text-sidebar-foreground/70">Management Stock</p>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}