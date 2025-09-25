import { useState } from "react";
import { useParams } from "react-router-dom";
import { Clock, Filter, User, Package, ShoppingCart, Users, Plus, Edit, Trash2, Check } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const activities = [
  {
    id: 1,
    type: "add-item",
    user: "Rani Suryani",
    action: "menambahkan",
    target: "Beras Premium 5kg",
    details: "ke stok barang",
    timestamp: "2024-01-10T14:30:00",
    category: "stok",
    avatar: ""
  },
  {
    id: 2,
    type: "complete-shopping",
    user: "Andi Pratama",
    action: "menandai",
    target: "Minyak Goreng 2L",
    details: "sudah dibeli dari daftar belanja",
    timestamp: "2024-01-10T12:15:00",
    category: "belanja",
    avatar: ""
  },
  {
    id: 3,
    type: "edit-item",
    user: "Sari Dewi",
    action: "mengedit jumlah",
    target: "Sabun Mandi",
    details: "dari 3 menjadi 5 pcs",
    timestamp: "2024-01-10T10:45:00",
    category: "stok",
    avatar: ""
  },
  {
    id: 4,
    type: "add-shopping",
    user: "Budi Santoso",
    action: "menambahkan",
    target: "Gas LPG 3kg",
    details: "ke daftar belanja",
    timestamp: "2024-01-09T16:20:00",
    category: "belanja",
    avatar: ""
  },
  {
    id: 5,
    type: "join-member",
    user: "Maya Sari",
    action: "bergabung",
    target: "",
    details: "sebagai anggota baru",
    timestamp: "2024-01-09T14:10:00",
    category: "anggota",
    avatar: ""
  },
  {
    id: 6,
    type: "delete-item",
    user: "Rani Suryani",
    action: "menghapus",
    target: "Kopi Instan",
    details: "dari stok barang",
    timestamp: "2024-01-09T11:30:00",
    category: "stok",
    avatar: ""
  },
  {
    id: 7,
    type: "low-stock-alert",
    user: "System",
    action: "mengirim peringatan",
    target: "Sabun Cuci Piring",
    details: "stok hampir habis (1 pcs tersisa)",
    timestamp: "2024-01-08T08:00:00",
    category: "sistem",
    avatar: ""
  }
];

const categories = ["Semua", "Stok", "Belanja", "Anggota", "Sistem"];
const timeFilters = ["Semua Waktu", "Hari Ini", "Minggu Ini", "Bulan Ini"];

export default function Timeline() {
  const { houseName } = useParams();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedTime, setSelectedTime] = useState("Semua Waktu");
  const [searchTerm, setSearchTerm] = useState("");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "add-item":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "edit-item":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "delete-item":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case "add-shopping":
        return <ShoppingCart className="h-4 w-4 text-purple-500" />;
      case "complete-shopping":
        return <Check className="h-4 w-4 text-green-500" />;
      case "join-member":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "low-stock-alert":
        return <Package className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "stok":
        return <Badge variant="outline" className="text-green-600 border-green-200">Stok</Badge>;
      case "belanja":
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Belanja</Badge>;
      case "anggota":
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Anggota</Badge>;
      case "sistem":
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Sistem</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} menit lalu`;
    } else if (diffInHours < 24) {
      return `${diffInHours} jam lalu`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} hari lalu`;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || 
                           activity.category === selectedCategory.toLowerCase();
    
    // Simple time filtering logic (can be enhanced)
    let matchesTime = true;
    if (selectedTime === "Hari Ini") {
      const today = new Date().toDateString();
      const activityDate = new Date(activity.timestamp).toDateString();
      matchesTime = today === activityDate;
    }
    
    return matchesSearch && matchesCategory && matchesTime;
  });

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
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Timeline Aktivitas
                </h1>
                <p className="text-muted-foreground">
                  Riwayat aktivitas dan perubahan di {decodedHouseName}
                </p>
                <div className="mt-4">
                  <Badge variant="outline" className="text-sm">
                    {filteredActivities.length} aktivitas ditampilkan
                  </Badge>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Cari aktivitas, pengguna, atau item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeFilters.map(time => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Riwayat Aktivitas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredActivities.map((activity, index) => (
                      <div key={activity.id} className="relative flex items-start space-x-4 pb-4">
                        {/* Timeline line */}
                        {index !== filteredActivities.length - 1 && (
                          <div className="absolute left-6 top-12 w-px h-16 bg-border"></div>
                        )}
                        
                        {/* Avatar */}
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                          <AvatarImage src={activity.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-primary-foreground text-sm">
                            {activity.user === "System" ? "SYS" : getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getActivityIcon(activity.type)}
                              <span className="font-medium text-foreground">{activity.user}</span>
                              {getCategoryBadge(activity.category)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span>{activity.action} </span>
                            {activity.target && (
                              <span className="font-medium text-foreground">{activity.target} </span>
                            )}
                            <span>{activity.details}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredActivities.length === 0 && (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Tidak ada aktivitas</h3>
                      <p className="text-muted-foreground">
                        Tidak ditemukan aktivitas yang sesuai dengan filter
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}