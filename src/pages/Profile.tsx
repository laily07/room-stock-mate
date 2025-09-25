import { useState } from "react";
import { User, Mail, Phone, Settings, Bell, Shield, Key, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";

const userProfile = {
  name: "Rani Suryani",
  email: "rani@email.com",
  phone: "+62 812-3456-7890",
  avatar: "",
  joinDate: "2024-01-01",
  totalHouses: 3,
  totalActivities: 156,
  role: "Admin"
};

const userHouses = [
  { name: "Rumah A", role: "admin", members: 5, items: 23 },
  { name: "Kos B", role: "member", members: 8, items: 18 },
  { name: "Rumah Keluarga", role: "moderator", members: 4, items: 31 }
];

const notifications = {
  lowStock: true,
  newMembers: true,
  shoppingCompleted: false,
  weeklyReport: true,
  emailNotifications: true,
  pushNotifications: true
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(userProfile);
  const [notificationSettings, setNotificationSettings] = useState(notifications);

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

  const handleSaveProfile = () => {
    // Here you would save to backend
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
                      <AvatarImage src={profileData.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-primary-foreground text-xl">
                        {getInitials(profileData.name)}
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
                    <h3 className="text-xl font-semibold">{profileData.name}</h3>
                    <div className="flex items-center space-x-2">
                      {getRoleBadge(profileData.role)}
                      <Badge variant="outline">
                        {profileData.totalHouses} rumah/kos
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Bergabung sejak {new Date(profileData.joinDate).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Aktivitas</Label>
                    <Input
                      value={`${profileData.totalActivities} aktivitas`}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Perubahan
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Batal
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </div>
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
                  {userHouses.map((house, index) => (
                    <Card key={index} className="card-hover">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{house.name}</h3>
                            {getRoleBadge(house.role)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Anggota:</span>
                              <span>{house.members} orang</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total Item:</span>
                              <span>{house.items} item</span>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Password Saat Ini</Label>
                    <Input type="password" placeholder="Masukkan password saat ini" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Baru</Label>
                    <Input type="password" placeholder="Masukkan password baru" />
                  </div>
                  <div className="space-y-2">
                    <Label>Konfirmasi Password Baru</Label>
                    <Input type="password" placeholder="Konfirmasi password baru" />
                  </div>
                  <Button>
                    Ubah Password
                  </Button>
                </div>

                <hr />

                <div className="space-y-4">
                  <h3 className="font-medium text-destructive">Zona Bahaya</h3>
                  <div className="p-4 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium mb-2">Hapus Akun</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Setelah akun dihapus, semua data akan dihapus secara permanen. 
                      Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <Button variant="destructive">
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