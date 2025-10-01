import { Bell, Check, Clock, Package, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
  house: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Stok Rendah",
    message: "Beras tinggal sedikit (2 kg)",
    time: "2 menit lalu",
    read: false,
    house: "Rumah A",
  },
  {
    id: "2",
    type: "success",
    title: "Pembelian Selesai",
    message: "Minyak goreng sudah dibeli oleh Rani",
    time: "5 menit lalu",
    read: false,
    house: "Rumah B",
  },
  {
    id: "3",
    type: "info",
    title: "Item Ditambahkan",
    message: "Gula pasir ditambahkan ke daftar belanja",
    time: "1 jam lalu",
    read: true,
    house: "Rumah A",
  },
  {
    id: "4",
    type: "warning",
    title: "Stok Hampir Habis",
    message: "Telur tinggal 5 butir",
    time: "2 jam lalu",
    read: true,
    house: "Rumah A",
  },
];

const getTypeStyles = (type: string) => {
  switch (type) {
    case "warning":
      return "bg-warning text-warning-foreground";
    case "success":
      return "bg-success text-success-foreground";
    case "info":
      return "bg-info text-info-foreground";
    default:
      return "bg-secondary text-secondary-foreground";
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <Package className="h-4 w-4" />;
    case "success":
      return <Check className="h-4 w-4" />;
    case "info":
      return <ShoppingCart className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export default function Notifikasi() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifikasi
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau semua aktivitas dan update terbaru
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="destructive" className="text-lg px-3 py-1">
            {unreadCount} Baru
          </Badge>
        )}
      </div>

      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm">
          <Check className="h-4 w-4 mr-2" />
          Tandai Semua Dibaca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semua Notifikasi</CardTitle>
          <CardDescription>Daftar notifikasi dari semua rumah</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <div
                className={`p-4 hover:bg-accent transition-colors ${
                  !notification.read ? "bg-accent/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2 rounded-full ${getTypeStyles(
                      notification.type
                    )}`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={getTypeStyles(notification.type)}
                      >
                        {notification.house}
                      </Badge>
                      {!notification.read && (
                        <Badge variant="destructive" className="text-xs">
                          Baru
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
              {index < notifications.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
