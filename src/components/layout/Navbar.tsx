import { Bell, ChevronDown, Home, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface NavbarProps {
  currentHouse?: string;
  houses?: string[];
  onHouseChange?: (house: string) => void;
  onAddHouse?: () => void;
}

export const Navbar = ({ currentHouse, houses = [], onHouseChange, onAddHouse }: NavbarProps) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Stock Home</h1>
            </div>

            {/* House Selector */}
            {currentHouse && houses.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-4">
                    {currentHouse}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {houses.map((house) => (
                    <DropdownMenuItem
                      key={house}
                      onClick={() => onHouseChange?.(house)}
                      className={currentHouse === house ? "bg-accent" : ""}
                    >
                      {house}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onAddHouse}>
                    + Tambah Rumah
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 border-b">
                  <h3 className="font-semibold text-sm">Notifikasi</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="p-3 flex-col items-start">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs bg-warning text-warning-foreground px-2 py-1 rounded">Rumah A</span>
                      <span className="text-xs text-muted-foreground">2 menit lalu</span>
                    </div>
                    <p className="text-sm mt-1">Beras tinggal sedikit (2 kg)</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 flex-col items-start">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs bg-success text-success-foreground px-2 py-1 rounded">Rumah B</span>
                      <span className="text-xs text-muted-foreground">5 menit lalu</span>
                    </div>
                    <p className="text-sm mt-1">Minyak goreng sudah dibeli oleh Rani</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="p-2 border-b">
                  <p className="text-sm font-medium">
                    {profileLoading ? 'Loading...' : (profile?.nama_pengguna || 'User')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {profileLoading ? 'Loading...' : (profile?.email_pengguna || 'user@example.com')}
                  </p>
                </div>
                <DropdownMenuItem onClick={handleEditProfile}>
                  <User className="w-4 h-4 mr-2" />
                  Edit Profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};