import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";

// Mock data for houses
const houses = [
  { 
    id: 1, 
    name: "Rumah A", 
    members: 5, 
    items: 23,
    lastActivity: "2 jam lalu"
  },
  { 
    id: 2, 
    name: "Kos B", 
    members: 8, 
    items: 18,
    lastActivity: "5 menit lalu"
  },
  { 
    id: 3, 
    name: "Rumah Keluarga", 
    members: 4, 
    items: 31,
    lastActivity: "1 hari lalu"
  },
];

import heroImage from "@/assets/stock-hero.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");

  const handleEnterHouse = (houseName: string) => {
    navigate(`/house/${encodeURIComponent(houseName)}/dashboard`);
  };

  const handleAddHouse = () => {
    if (newHouseName.trim()) {
      // Here you would typically add the house to your backend
      console.log("Adding house:", newHouseName);
      setNewHouseName("");
      setIsDialogOpen(false);
      // Navigate to the new house
      handleEnterHouse(newHouseName);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Stock Home
                <span className="block text-primary">Management</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Kelola inventaris rumah dan kos Anda dengan mudah. Pantau stok barang, atur daftar belanja, 
                dan kelola anggota dalam satu platform yang simpel dan powerful.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                      <Plus className="w-5 h-5 mr-2" />
                      Mulai Sekarang
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Rumah/Kos Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="houseName">Nama Rumah/Kos</Label>
                        <Input
                          id="houseName"
                          placeholder="Contoh: Rumah Saya, Kos Mahasiswa"
                          value={newHouseName}
                          onChange={(e) => setNewHouseName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddHouse()}
                        />
                      </div>
                      <Button onClick={handleAddHouse} className="w-full">
                        Buat Rumah
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg" className="hover:bg-accent">
                  Lihat Demo
                </Button>
              </div>
            </div>
            <div className="order-first lg:order-last">
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Stock management dashboard preview" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Pilih atau Buat Rumah/Kos Baru
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Kelola berbagai rumah atau kos yang Anda ikuti dalam satu dashboard terpusat
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {houses.map((house) => (
            <Card key={house.id} className="card-hover cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span>{house.name}</span>
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {house.lastActivity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{house.members} anggota</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{house.items} item</span>
                    </div>
                  </div>

                  {/* Enter Button */}
                  <Button 
                    onClick={() => handleEnterHouse(house.name)}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    Masuk ke {house.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {houses.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Belum ada rumah/kos</h3>
            <p className="text-muted-foreground mb-4">
              Mulai dengan membuat rumah atau kos pertama Anda
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Rumah/Kos Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Rumah/Kos Baru</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="houseName">Nama Rumah/Kos</Label>
                    <Input
                      id="houseName"
                      placeholder="Contoh: Rumah Saya, Kos Mahasiswa"
                      value={newHouseName}
                      onChange={(e) => setNewHouseName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddHouse()}
                    />
                  </div>
                  <Button onClick={handleAddHouse} className="w-full">
                    Buat Rumah
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}