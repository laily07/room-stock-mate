import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Home } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  nama_pengguna: z.string().min(2, 'Nama minimal 2 karakter').optional(),
});

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nama_pengguna = formData.get('nama_pengguna') as string;

    try {
      const validationData = {
        email,
        password,
        ...(activeTab === 'signup' && { nama_pengguna })
      };
      
      authSchema.parse(validationData);

      let result;
      if (activeTab === 'signin') {
        result = await signIn(email, password);
      } else {
        result = await signUp(email, password, nama_pengguna);
      }

      if (result.error) {
        if (result.error.message.includes('Invalid login credentials')) {
          setError('Email atau password salah');
        } else if (result.error.message.includes('User already registered')) {
          setError('Email sudah terdaftar. Silakan masuk dengan akun Anda.');
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('Silakan periksa email Anda untuk konfirmasi akun');
        } else {
          setError(result.error.message);
        }
      } else {
        if (activeTab === 'signup') {
          setError('');
          // Show success message for signup
          setActiveTab('signin');
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Stock Home</h1>
          </div>
          <p className="text-muted-foreground">
            Kelola inventaris rumah dan kos Anda dengan mudah
          </p>
        </div>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle>Selamat Datang</CardTitle>
            <CardDescription>
              Masuk atau daftar untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Masuk</TabsTrigger>
                <TabsTrigger value="signup">Daftar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Masuk
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nama">Nama Pengguna</Label>
                    <Input
                      id="signup-nama"
                      name="nama_pengguna"
                      type="text"
                      placeholder="Nama Anda"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="nama@email.com"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Daftar
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}