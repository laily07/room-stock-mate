import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search, Mail, Phone, Crown, Shield, User, MoreVertical, UserPlus } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const members = [
  {
    id: 1,
    name: "Rani Suryani",
    email: "rani@email.com",
    phone: "+62 812-3456-7890",
    role: "admin",
    avatar: "",
    joinDate: "2024-01-01",
    lastActive: "2 jam lalu",
    contributions: 45
  },
  {
    id: 2,
    name: "Andi Pratama",
    email: "andi@email.com",
    phone: "+62 821-9876-5432",
    role: "member",
    avatar: "",
    joinDate: "2024-01-05",
    lastActive: "1 hari lalu",
    contributions: 23
  },
  {
    id: 3,
    name: "Sari Dewi",
    email: "sari@email.com",
    phone: "+62 856-1234-5678",
    role: "member",
    avatar: "",
    joinDate: "2024-01-10",
    lastActive: "3 jam lalu",
    contributions: 12
  },
  {
    id: 4,
    name: "Budi Santoso",
    email: "budi@email.com",
    phone: "+62 877-8765-4321",
    role: "moderator",
    avatar: "",
    joinDate: "2024-01-15",
    lastActive: "5 menit lalu",
    contributions: 31
  },
];

const roles = ["Admin", "Moderator", "Member"];

export default function Anggota() {
  const { houseName } = useParams();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Semua");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "moderator":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Semua" || member.role === selectedRole.toLowerCase();
    
    return matchesSearch && matchesRole;
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
                  Anggota
                </h1>
                <p className="text-muted-foreground">
                  Kelola anggota {decodedHouseName}
                </p>
                <div className="mt-4">
                  <Badge variant="outline" className="text-sm">
                    {members.length} anggota terdaftar
                  </Badge>
                </div>
              </div>

              {/* Actions & Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Cari nama atau email anggota..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Semua">Semua Role</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-primary-light">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Undang Anggota
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Undang Anggota Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Email</Label>
                          <Input 
                            type="email" 
                            placeholder="contoh@email.com" 
                          />
                        </div>
                        <div>
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(role => (
                                <SelectItem key={role} value={role.toLowerCase()}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Pesan Undangan (Opsional)</Label>
                          <Input placeholder="Pesan khusus untuk anggota baru" />
                        </div>
                        <Button className="w-full" onClick={() => setIsInviteDialogOpen(false)}>
                          Kirim Undangan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <Card key={member.id} className="card-hover">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-light text-primary-foreground">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{member.name}</h3>
                            <div className="flex items-center space-x-1 mt-1">
                              {getRoleIcon(member.role)}
                              {getRoleBadge(member.role)}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                            <DropdownMenuItem>Lihat Aktivitas</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              Hapus Anggota
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Bergabung: {new Date(member.joinDate).toLocaleDateString('id-ID')}</span>
                        <span>Aktif: {member.lastActive}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Kontribusi</span>
                          <Badge variant="outline" className="text-xs">
                            {member.contributions} aktivitas
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tidak ada anggota</h3>
                  <p className="text-muted-foreground">
                    Tidak ditemukan anggota yang sesuai dengan filter
                  </p>
                </div>
              )}
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}