import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function HouseDashboard() {
  const { houseName } = useParams();
  const { user } = useAuth();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    members: 0,
    shoppingList: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && decodedHouseName) {
      fetchDashboardData();
    }
  }, [user, decodedHouseName]);

  const fetchDashboardData = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('pengguna_id')
        .eq('id', user?.id)
        .single();

      if (userProfile) {
        const { data: rumah } = await supabase
          .from('rumah')
          .select('id_rumah')
          .eq('nama_rumah', decodedHouseName)
          .eq('id_pengguna', userProfile.pengguna_id)
          .single();

        if (rumah) {
          // Fetch stats
          const { count: totalItems } = await supabase
            .from('barang')
            .select('*', { count: 'exact' })
            .eq('id_rumah', rumah.id_rumah);

          const { count: members } = await supabase
            .from('anggota_rumah')
            .select('*', { count: 'exact' })
            .eq('id_rumah', rumah.id_rumah)
            .not('tanggal_dihapus', 'is', null);

          const { count: shoppingList } = await supabase
            .from('daftar_belanja')
            .select('*', { count: 'exact' })
            .eq('id_rumah', rumah.id_rumah)
            .not('tanggal_dihapus', 'is', null);

          // Fetch low stock items
          const { data: lowStockData } = await supabase
            .from('barang')
            .select('nama_barang, stok, satuan, ambang_batas')
            .eq('id_rumah', rumah.id_rumah)
            .lt('stok', 5)
            .limit(5);

          setStats({
            totalItems: totalItems || 0,
            lowStock: lowStockData?.length || 0,
            members: members || 0,
            shoppingList: shoppingList || 0
          });

          setLowStockItems(lowStockData?.map(item => ({
            name: item.nama_barang,
            current: item.stok,
            unit: item.satuan,
            status: item.stok === 0 ? "habis" : "hampir-habis"
          })) || []);

          // Mock recent activities for now
          setRecentActivities([
            { id: 1, user: "Anda", action: "mengakses dashboard", time: "Baru saja" }
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <Navbar 
          currentHouse={decodedHouseName}
          houses={[decodedHouseName]}
        />
        
        <div className="flex w-full">
          <AppSidebar currentHouse={decodedHouseName} />
          
          <SidebarInset>
            <div className="p-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Dashboard {decodedHouseName}
                </h1>
                <p className="text-muted-foreground">
                  Ringkasan inventaris dan aktivitas terkini
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalItems}</div>
                    <p className="text-xs text-muted-foreground">item tersedia</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-warning">{stats.lowStock}</div>
                    <p className="text-xs text-muted-foreground">perlu perhatian</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Anggota</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.members}</div>
                    <p className="text-xs text-muted-foreground">orang</p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daftar Belanja</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.shoppingList}</div>
                    <p className="text-xs text-muted-foreground">item menunggu</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <span>Stok Menipis/Habis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : lowStockItems.length > 0 ? (
                      lowStockItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.current} {item.unit}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant={item.status === "habis" ? "destructive" : "warning"}
                          >
                            {item.status === "habis" ? "Habis" : "Hampir Habis"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">
                        Semua stok dalam kondisi baik
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span>Aktivitas Terkini</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                        <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}