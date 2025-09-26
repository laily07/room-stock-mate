import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/auth/AuthPage";
import HouseDashboard from "./pages/house/HouseDashboard";
import StokBarang from "./pages/house/StokBarang";
import DaftarBelanja from "./pages/house/DaftarBelanja";
import Anggota from "./pages/house/Anggota";
import Laporan from "./pages/house/Laporan";
import Timeline from "./pages/house/Timeline";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/house/:houseName/dashboard" element={
              <ProtectedRoute>
                <HouseDashboard />
              </ProtectedRoute>
            } />
            <Route path="/house/:houseName/stok-barang" element={
              <ProtectedRoute>
                <StokBarang />
              </ProtectedRoute>
            } />
            <Route path="/house/:houseName/daftar-belanja" element={
              <ProtectedRoute>
                <DaftarBelanja />
              </ProtectedRoute>
            } />
            <Route path="/house/:houseName/anggota" element={
              <ProtectedRoute>
                <Anggota />
              </ProtectedRoute>
            } />
            <Route path="/house/:houseName/laporan" element={
              <ProtectedRoute>
                <Laporan />
              </ProtectedRoute>
            } />
            <Route path="/house/:houseName/timeline" element={
              <ProtectedRoute>
                <Timeline />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
