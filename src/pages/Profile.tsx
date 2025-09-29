import { useState, useEffect } from "react";
import { User, Mail, Phone, Settings, Bell, Shield, Key, Camera, Save, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Navbar } from "@/components/layout/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const profileSchema = z.object({
  nama_pengguna: z.string().min(2, "Nama harus minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  email_pengguna: z.string().email("Format email tidak valid"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

const notifications = {
  lowStock: true,
  newMembers: true,
  shoppingCompleted: false,
  weeklyReport: true,
  emailNotifications: true,
  pushNotifications: true
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { profile, houses, loading, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(notifications);
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nama_pengguna: "",
      email_pengguna: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        nama_pengguna: profile.nama_pengguna,
        email_pengguna: profile.email_pengguna,
      });
    }
  }, [profile, profileForm]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Admin</Badge>;
      case "moderator":
        return <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">Moderator</Badge>;
      default:
        return <Badge variant="outline">Member</Badge>;
    }
  };

  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    setIsUpdating(true);
    try {
      const { error } = await updateProfile(data);
      if (error) throw error;
      
      toast({
        title: "Profil berhasil diperbarui",
        description: "Perubahan profil telah disimpan.",
      });
      setIsEditing(false);
    } catch (err: any) {
      toast({
        title: "Gagal memperbarui profil",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (data: z.infer<typeof passwordSchema>) => {
    setIsUpdating(true);
    try {
      // Here you would implement password change logic
      toast({
        title: "Password berhasil diubah",
        description: "Password Anda telah diperbarui.",
      });
      passwordForm.reset();
    } catch (err: any) {
      toast({
        title: "Gagal mengubah password",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) {
      try {
        await signOut();
        toast({
          title: "Akun berhasil dihapus",
          description: "Akun Anda telah dihapus.",
        });
      } catch (err: any) {
        toast({
          title: "Gagal menghapus akun",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {error || "Profil tidak ditemukan"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profil Pengguna
          </h1>
          <p className="text-muted-foreground">
            Kelola informasi akun dan preferensi Anda
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="houses">Rumah/Kos</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informasi Profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-primary-foreground text-xl">
                        {getInitials(profile.nama_pengguna)}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{profile.nama_pengguna}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {houses.length} rumah/kos
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bergabung sejak {profile.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID') : '-'}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(handleSaveProfile)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={profileForm.control}
                        name="nama_pengguna"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input {...field} disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email_pengguna"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" disabled={!isEditing} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <Label>Total Rumah/Kos</Label>
                        <Input
                          value={`${houses.length} rumah/kos`}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>User ID</Label>
                        <Input
                          value={profile.pengguna_id.toString()}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Simpan Perubahan
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              profileForm.reset();
                            }}
                            disabled={isUpdating}
                          >
                            Batal
                          </Button>
                        </>
                      ) : (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profil
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>

              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="houses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Rumah/Kos yang Diikuti</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {houses.map((house, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{house.nama_rumah}</h3>
                            {getRoleBadge(house.role)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Anggota:</span>
                              <span>{house.member_count} orang</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Item:</span>
                              <span>{house.item_count} item</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            Lihat Detail
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {houses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Belum ada rumah/kos yang diikuti</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Pengaturan Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Stok Menipis</h3>
                      <p className="text-sm text-muted-foreground">
                        Terima notifikasi saat stok barang hampir habis
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.lowStock}
                      onCheckedChange={(value) => handleNotificationChange('lowStock', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Anggota Baru</h3>
                      <p className="text-sm text-muted-foreground">
                        Terima notifikasi saat ada anggota baru bergabung
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newMembers}
                      onCheckedChange={(value) => handleNotificationChange('newMembers', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Belanja Selesai</h3>
                      <p className="text-sm text-muted-foreground">
                        Terima notifikasi saat item belanja ditandai selesai
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.shoppingCompleted}
                      onCheckedChange={(value) => handleNotificationChange('shoppingCompleted', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Laporan Mingguan</h3>
                      <p className="text-sm text-muted-foreground">
                        Terima ringkasan aktivitas setiap minggu
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={(value) => handleNotificationChange('weeklyReport', value)}
                    />
                  </div>
                </div>

                <hr />

                <div className="space-y-4">
                  <h3 className="font-medium">Metode Notifikasi</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-sm text-muted-foreground">
                        Kirim notifikasi melalui email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(value) => handleNotificationChange('emailNotifications', value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notification</h4>
                      <p className="text-sm text-muted-foreground">
                        Tampilkan notifikasi di browser
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(value) => handleNotificationChange('pushNotifications', value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Keamanan Akun</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Saat Ini</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Masukkan password saat ini" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Masukkan password baru" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Konfirmasi Password Baru</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Konfirmasi password baru" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Ubah Password
                    </Button>
                  </form>
                </Form>

                <hr />

                <div className="space-y-4">
                  <h3 className="font-medium text-destructive">Zona Bahaya</h3>
                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium mb-2">Hapus Akun</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Setelah akun dihapus, semua data akan dihapus secara permanen. 
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isUpdating}>
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : null}
                      Hapus Akun
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}