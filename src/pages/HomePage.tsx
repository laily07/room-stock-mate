import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Users, Package, Plus, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface House {
  id_rumah: number;
  nama_rumah: string;
  members: number;
  items: number;
  lastActivity: string;
}

import heroImage from "@/assets/stock-hero.jpg";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newHouseName, setNewHouseName] = useState("");
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserHouses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserHouses = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('pengguna_id')
        .eq('id', user?.id)
        .single();

      if (userProfile) {
        const { data: rumahData } = await supabase
          .from('rumah')
          .select('*')
          .eq('id_pengguna', userProfile.pengguna_id);

        if (rumahData) {
          const housesWithStats = await Promise.all(
            rumahData.map(async (rumah) => {
              const { count: memberCount } = await supabase
                .from('anggota_rumah')
                .select('*', { count: 'exact' })
                .eq('id_rumah', rumah.id_rumah)
                .eq('status', 'aktif');

              const { count: itemCount } = await supabase
                .from('barang')
                .select('*', { count: 'exact' })
                .eq('id_rumah', rumah.id_rumah);

              return {
                id_rumah: rumah.id_rumah,
                nama_rumah: rumah.nama_rumah,
                members: memberCount || 0,
                items: itemCount || 0,
                lastActivity: "Baru saja"
              };
            })
          );
          setHouses(housesWithStats);
        }
      }
    } catch (error) {
      console.error('Error fetching houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterHouse = (houseName: string) => {
    navigate(`/house/${encodeURIComponent(houseName)}/dashboard`);
  };

  const handleAddHouse = async () => {
    if (newHouseName.trim() && user) {
      try {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('pengguna_id')
          .eq('id', user.id)
          .single();

        if (userProfile) {
          const { error } = await supabase
            .from('rumah')
            .insert({
              nama_rumah: newHouseName,
              id_pengguna: userProfile.pengguna_id
            });

          if (error) {
            toast({
              title: "Error",
              description: "Gagal membuat rumah baru",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sukses",
              description: "Rumah berhasil dibuat"
            });
            setNewHouseName("");
            setIsDialogOpen(false);
            fetchUserHouses();
            handleEnterHouse(newHouseName);
          }
        }
      } catch (error) {
        console.error('Error creating house:', error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan",
          variant: "destructive"
        });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "Anda telah keluar dari akun"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Stock Home</h1>
        </div>
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate('/auth')}>
              <User className="w-4 h-4 mr-2" />
              Masuk
            </Button>
          )}
        </div>
      </div>
      
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
                  {!user && (
                    <Button variant="outline" size="lg" onClick={() => navigate('/auth')}>
                      <User className="w-4 h-4 mr-2" />
                      Masuk/Daftar
                    </Button>
                  )}
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
        {user && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pilih atau Buat Rumah/Kos Baru
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Kelola berbagai rumah atau kos yang Anda ikuti dalam satu dashboard terpusat
            </p>
          </div>
        )}

        {/* Houses Grid */}
        {user && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {houses.map((house) => (
              <Card key={house.id_rumah} className="card-hover cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                        <Home className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <span>{house.nama_rumah}</span>
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
                      onClick={() => handleEnterHouse(house.nama_rumah)}
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      variant="outline"
                    >
                      Masuk ke {house.nama_rumah}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {loading && user && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Memuat rumah...</p>
          </div>
        )}

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