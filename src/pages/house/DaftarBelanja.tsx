import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search, Check, X, ShoppingCart, Users, Calendar, Package } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const shoppingItems = [
  {
    id: 1,
    name: "Beras Premium 5kg",
    category: "Sembako",
    quantity: 1,
    unit: "sak",
    priority: "tinggi",
    addedBy: "Rani",
    addedDate: "2024-01-10",
    notes: "Merk favorit keluarga",
    completed: false
  },
  {
    id: 2,
    name: "Minyak Goreng 2L",
    category: "Makanan",
    quantity: 2,
    unit: "botol",
    priority: "sedang",
    addedBy: "Andi",
    addedDate: "2024-01-09",
    notes: "",
    completed: true
  },
  {
    id: 3,
    name: "Sabun Cuci Piring",
    category: "Kebersihan",
    quantity: 3,
    unit: "pcs",
    priority: "rendah",
    addedBy: "Sari",
    addedDate: "2024-01-08",
    notes: "Yang anti lemak",
    completed: false
  },
];

const categories = ["Semua", "Sembako", "Makanan", "Minuman", "Kebersihan"];
const priorities = ["Tinggi", "Sedang", "Rendah"];

export default function DaftarBelanja() {
  const { houseName } = useParams();
  const decodedHouseName = houseName ? decodeURIComponent(houseName) : "";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [isStockUpdateOpen, setIsStockUpdateOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [stockUpdateData, setStockUpdateData] = useState({
    quantity: "",
    unit: "",
    expiry: "",
    estimatedDepletion: ""
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return <Badge variant="destructive">🔴 Tinggi</Badge>;
      case "sedang":
        return <Badge variant="warning">🟡 Sedang</Badge>;
      case "rendah":
        return <Badge variant="secondary">🟢 Rendah</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredItems = shoppingItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesCompleted = showCompleted || !item.completed;
    
    return matchesSearch && matchesCategory && matchesCompleted;
  });

  const completedCount = shoppingItems.filter(item => item.completed).length;
  const totalCount = shoppingItems.length;

  const handleItemCheck = (itemId: number, checked: boolean) => {
    if (checked) {
      setCheckedItems(prev => [...prev, itemId]);
    } else {
      setCheckedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSudahDibeli = () => {
    const selected = shoppingItems.filter(item => checkedItems.includes(item.id));
    setSelectedItems(selected);
    setIsStockUpdateOpen(true);
  };

  const handleStockUpdate = () => {
    // Update stock data logic here
    console.log("Updating stock with:", stockUpdateData, "for items:", selectedItems);
    
    // Mark items as completed
    checkedItems.forEach(itemId => {
      const item = shoppingItems.find(i => i.id === itemId);
      if (item) item.completed = true;
    });
    
    // Reset states
    setCheckedItems([]);
    setIsStockUpdateOpen(false);
    setStockUpdateData({
      quantity: "",
      unit: "",
      expiry: "",
      estimatedDepletion: ""
    });
  };

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
                  Daftar Belanja
                </h1>
                <p className="text-muted-foreground">
                  Kelola daftar belanja untuk {decodedHouseName}
                </p>
                <div className="mt-4">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      {totalCount - completedCount} belum dibeli
                    </Badge>
                    <Badge variant="success" className="text-sm">
                      {completedCount} sudah dibeli
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions & Filters */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Cari item belanja..."
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

                  <Button
                    variant={showCompleted ? "default" : "outline"}
                    onClick={() => setShowCompleted(!showCompleted)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Sudah Dibeli
                  </Button>

                  {checkedItems.length > 0 && (
                    <Button
                      onClick={handleSudahDibeli}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Sudah Dibeli ({checkedItems.length})
                    </Button>
                  )}

                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-primary to-primary-light">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tambah Item Baru</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nama Item</Label>
                          <Input placeholder="Contoh: Beras Premium 5kg" />
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
                            <Input type="number" placeholder="1" />
                          </div>
                          <div>
                            <Label>Satuan</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Satuan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pcs">pcs</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="liter">liter</SelectItem>
                                <SelectItem value="botol">botol</SelectItem>
                                <SelectItem value="pak">pak</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label>Prioritas</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih prioritas" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority} value={priority.toLowerCase()}>
                                  {priority}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Catatan (Opsional)</Label>
                          <Input placeholder="Catatan tambahan" />
                        </div>
                        <Button className="w-full" onClick={() => setIsAddDialogOpen(false)}>
                          Tambah ke Daftar
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Shopping List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Daftar Belanja ({filteredItems.length} item)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredItems.map((item) => (
                      <div key={item.id} className={`p-4 rounded-lg border ${item.completed ? 'bg-muted/50' : 'bg-background'}`}>
                        <div className="flex items-start space-x-3">
                          <Checkbox 
                            checked={checkedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {item.name}
                              </h3>
                              {getPriorityBadge(item.priority)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <span>{item.quantity} {item.unit}</span>
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{item.addedBy}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(item.addedDate).toLocaleDateString('id-ID')}</span>
                              </div>
                            </div>
                            {item.notes && (
                              <p className="text-sm text-muted-foreground italic">
                                "{item.notes}"
                              </p>
                            )}
                          </div>
                          <Button size="sm" variant="ghost">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filteredItems.length === 0 && (
                    <div className="text-center py-8">
                      <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Daftar belanja kosong</h3>
                      <p className="text-muted-foreground">
                        Tambahkan item yang perlu dibeli
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stock Update Dialog */}
              <Dialog open={isStockUpdateOpen} onOpenChange={setIsStockUpdateOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>Update Stok Barang</span>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-2">Item yang dibeli:</p>
                      {selectedItems.map((item, index) => (
                        <div key={item.id} className="text-sm text-muted-foreground">
                          • {item.name} ({item.quantity} {item.unit})
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Jumlah Stok Baru</Label>
                        <Input 
                          type="number" 
                          placeholder="10"
                          value={stockUpdateData.quantity}
                          onChange={(e) => setStockUpdateData(prev => ({...prev, quantity: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label>Satuan</Label>
                        <Select 
                          value={stockUpdateData.unit}
                          onValueChange={(value) => setStockUpdateData(prev => ({...prev, unit: value}))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Satuan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="liter">liter</SelectItem>
                            <SelectItem value="pcs">pcs</SelectItem>
                            <SelectItem value="pak">pak</SelectItem>
                            <SelectItem value="botol">botol</SelectItem>
                            <SelectItem value="sak">sak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Tanggal Kadaluarsa</Label>
                      <Input 
                        type="date"
                        value={stockUpdateData.expiry}
                        onChange={(e) => setStockUpdateData(prev => ({...prev, expiry: e.target.value}))}
                      />
                    </div>

                    <div>
                      <Label>Estimasi Habis (hari)</Label>
                      <Input 
                        type="number" 
                        placeholder="30"
                        value={stockUpdateData.estimatedDepletion}
                        onChange={(e) => setStockUpdateData(prev => ({...prev, estimatedDepletion: e.target.value}))}
                      />
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setIsStockUpdateOpen(false)}
                      >
                        Batal
                      </Button>
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleStockUpdate}
                      >
                        Update Stok
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}