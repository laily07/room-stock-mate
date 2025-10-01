import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Clock,
  Bell,
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
      title: "Notifikasi",
      url: `/house/${encodeURIComponent(currentHouse || "")}/notifikasi`,
      icon: Bell,
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
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* House Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div>
          <h2 className="font-semibold text-sidebar-foreground truncate">
            {currentHouse || "Pilih Rumah"}
          </h2>
          <p className="text-xs text-sidebar-foreground/70">Management Stock</p>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 p-2">
        <div className="space-y-2">
          <div className="px-2 py-1.5 text-xs font-medium text-sidebar-foreground/70">
            Menu Utama
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}