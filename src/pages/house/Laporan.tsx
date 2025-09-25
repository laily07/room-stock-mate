import { useState } from "react";
import { useParams } from "react-router-dom";
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Users, Package, ShoppingCart } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

const monthlyStats = {
  totalItems: 23,
  addedItems: 8,
  usedItems: 15,
  shoppingList: 12,
  completedShopping: 8,
  members: 4,
  activities: 47
};

const categoryData = [
  { name: "Sembako", count: 8, percentage: 35 },
  { name: "Makanan", count: 6, percentage: 26 },
  { name: "Kebersihan", count: 5, percentage: 22 },
  { name: "Minuman", count: 4, percentage: 17 }
];

const topItems = [
  { name: "Beras Premium", used: 15, category: "Sembako" },
  { name: "Minyak Goreng", used: 12, category: "Makanan" },
  { name: "Sabun Cuci", used: 10, category: "Kebersihan" },
  { name: "Air Mineral", used: 8, category: "Minuman" }
];

const memberActivity = [
  { name: "Rani", contributions: 18, percentage: 38 },
  { name: "Andi", contributions: 12, percentage: 26 },
  { name: "Sari", contributions: 10, percentage: 21 },
  { name: "Budi", contributions: 7, percentage: 15 }
];

export default function Laporan() {
  const { houseName } = useParams();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [selectedPeriod, setSelectedPeriod] = useState("bulan-ini");
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background">
        <Navbar 
          currentHouse={decodedHouseName}
          houses={["Rumah A", "Kos B", "Rumah Keluarga"]}
        />
        
        <div className="flex w-full">
          <AppSidebar currentHouse={decodedHouseName} />
          
          <SidebarInset>
            <div className="p-6">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Laporan & Insight
                    </h1>
                    <p className="text-muted-foreground">
                      Analisis dan statistik penggunaan {decodedHouseName}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minggu-ini">Minggu Ini</SelectItem>
                        <SelectItem value="bulan-ini">Bulan Ini</SelectItem>
                        <SelectItem value="3-bulan">3 Bulan Terakhir</SelectItem>
                        <SelectItem value="tahun-ini">Tahun Ini</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Aktivitas</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{monthlyStats.activities}</div>
                    <p className="text-xs text-muted-foreground">
                      +12% dari bulan lalu
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Barang Digunakan</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{monthlyStats.usedItems}</div>
                    <p className="text-xs text-muted-foreground">
                      dari {monthlyStats.totalItems} total item
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Belanja Selesai</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{monthlyStats.completedShopping}</div>
                    <p className="text-xs text-muted-foreground">
                      dari {monthlyStats.shoppingList} item
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{monthlyStats.members}</div>
                    <p className="text-xs text-muted-foreground">
                      100% partisipasi
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Reports */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="categories">Kategori</TabsTrigger>
                  <TabsTrigger value="items">Top Items</TabsTrigger>
                  <TabsTrigger value="members">Anggota</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span>Tren Penggunaan</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Minggu 1</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={65} className="w-20" />
                              <span className="text-sm font-medium">65%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Minggu 2</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={80} className="w-20" />
                              <span className="text-sm font-medium">80%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Minggu 3</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={72} className="w-20" />
                              <span className="text-sm font-medium">72%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Minggu 4</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={90} className="w-20" />
                              <span className="text-sm font-medium">90%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>Aktivitas Harian</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">12</div>
                            <p className="text-sm text-muted-foreground">rata-rata aktivitas per hari</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Pagi (06-12)</span>
                              <span className="font-medium">40%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Siang (12-18)</span>
                              <span className="font-medium">35%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Malam (18-24)</span>
                              <span className="font-medium">25%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        <span>Distribusi Kategori</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categoryData.map((category, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{category.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{category.count} item</Badge>
                                <span className="text-sm font-medium">{category.percentage}%</span>
                              </div>
                            </div>
                            <Progress value={category.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span>Barang Paling Sering Digunakan</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">#{index + 1}</span>
                              </div>
                              <div>
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">{item.used}x digunakan</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="members" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Kontribusi Anggota</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {memberActivity.map((member, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{member.name}</span>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{member.contributions} aktivitas</Badge>
                                <span className="text-sm font-medium">{member.percentage}%</span>
                              </div>
                            </div>
                            <Progress value={member.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}