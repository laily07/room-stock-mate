import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search, Filter, Edit, Trash2, ShoppingCart, Package } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Mock data for stock items
const stockItems = [
  {
    id: 1,
    name: "Beras Premium",
    category: "Sembako",
    quantity: 5,
    unit: "kg",
    minStock: 3,
    status: "cukup",
    expiry: "2024-03-15",
    notes: "Beli di toko ABC"
  },
  {
    id: 2,
    name: "Minyak Goreng",
    category: "Makanan",
    quantity: 2,
    unit: "liter",
    minStock: 3,
    status: "hampir-habis",
    expiry: "2024-04-20",
    notes: ""
  },
  {
    id: 3,
    name: "Gas LPG 3kg",
    category: "Listrik",
    quantity: 1,
    unit: "tabung",
    minStock: 2,
    status: "hampir-habis",
    expiry: null,
    notes: "Ganti regulator baru"
  },
  {
    id: 4,
    name: "Sabun Cuci Piring",
    category: "Kebersihan",
    quantity: 0,
    unit: "pcs",
    minStock: 1,
    status: "habis",
    expiry: "2025-01-10",
    notes: ""
  },
];

const categories = ["Semua", "Sembako", "Makanan", "Minuman", "Kebersihan", "Listrik", "Alat Tulis"];
const statusOptions = ["Semua", "Cukup", "Hampir Habis", "Habis"];

export default function StokBarang() {
  const { houseName } = useParams();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "cukup":
        return <Badge variant="success">🟢 Cukup</Badge>;
      case "hampir-habis":
        return <Badge variant="warning">🟡 Hampir Habis</Badge>;
      case "habis":
        return <Badge variant="destructive">🔴 Habis</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "Semua" || 
                         (selectedStatus === "Cukup" && item.status === "cukup") ||
                         (selectedStatus === "Hampir Habis" && item.status === "hampir-habis") ||
                         (selectedStatus === "Habis" && item.status === "habis");
    
    return matchesSearch && matchesCategory && matchesStatus;
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
                  Stok Barang
                </h1>
                <p className="text-muted-foreground">
                  Kelola inventaris barang {decodedHouseName}
                </p>
              </div>

              {/* Actions & Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Cari barang atau catatan..."
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

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-primary-light">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Barang
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Barang Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nama Barang</Label>
                          <Input placeholder="Contoh: Beras Premium" />
                        </div>
                        <div>
                          <Label>Kategori</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.slice(1).map(category => (
                                <SelectItem key={category} value={category.toLowerCase()}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label>Jumlah</Label>
                            <Input type="number" placeholder="5" />
                          </div>
                          <div>
                            <Label>Satuan</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Satuan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="liter">liter</SelectItem>
                                <SelectItem value="pcs">pcs</SelectItem>
                                <SelectItem value="tabung">tabung</SelectItem>
                                <SelectItem value="pak">pak</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Batas Minimum</Label>
                          <Input type="number" placeholder="3" />
                        </div>
                        <div>
                          <Label>Tanggal Kadaluarsa (Opsional)</Label>
                          <Input type="date" />
                        </div>
                        <div>
                          <Label>Catatan (Opsional)</Label>
                          <Input placeholder="Catatan tambahan" />
                        </div>
                        <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                          Simpan Barang
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Stock Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Daftar Stok Barang ({filteredItems.length} item)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Barang</TableHead>
                          <TableHead>Kategori</TableHead>
                          <TableHead>Jumlah</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Kadaluarsa</TableHead>
                          <TableHead>Catatan</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>
                              {item.quantity} {item.unit}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(item.status)}
                            </TableCell>
                            <TableCell>
                              {item.expiry ? new Date(item.expiry).toLocaleDateString('id-ID') : '-'}
                            </TableCell>
                            <TableCell className="max-w-32 truncate">
                              {item.notes || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Tidak ada barang</h3>
                      <p className="text-muted-foreground">
                        Tidak ditemukan barang yang sesuai dengan filter
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