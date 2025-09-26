-- Drop the failed constraints and revert changes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles;

-- Disable RLS temporarily to fix the constraints
ALTER TABLE public.rumah DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota_rumah DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.barang DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daftar_belanja DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekomendasi_belanja DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_stok DISABLE ROW LEVEL SECURITY;

-- Revert the UUID changes back to integer
ALTER TABLE public.rumah ALTER COLUMN id_pengguna TYPE INTEGER USING id_pengguna::text::integer;
ALTER TABLE public.anggota_rumah ALTER COLUMN id_pengguna TYPE INTEGER USING id_pengguna::text::integer;
ALTER TABLE public.barang ALTER COLUMN id_pengguna TYPE INTEGER USING id_pengguna::text::integer;
ALTER TABLE public.riwayat_stok ALTER COLUMN id_pengguna TYPE INTEGER USING id_pengguna::text::integer;
ALTER TABLE public.langganan ALTER COLUMN id_pengguna TYPE INTEGER USING id_pengguna::text::integer;

-- Create user_profiles table that maps Supabase auth users to local user IDs
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  pengguna_id INTEGER REFERENCES public.pengguna(id_pengguna) ON DELETE CASCADE UNIQUE,
  nama_pengguna TEXT NOT NULL,
  email_pengguna TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS on all tables
ALTER TABLE public.pengguna ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rumah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anggota_rumah ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daftar_belanja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rekomendasi_belanja ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riwayat_stok ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.katalog_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kategori_produk ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.langganan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo ENABLE ROW LEVEL SECURITY;

-- RLS policies for pengguna (legacy users table)
CREATE POLICY "Users can view their own pengguna record" ON public.pengguna
  FOR SELECT USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- RLS policies for rumah (houses)
CREATE POLICY "Users can view their own houses" ON public.rumah
  FOR SELECT USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own houses" ON public.rumah
  FOR INSERT WITH CHECK (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own houses" ON public.rumah
  FOR UPDATE USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own houses" ON public.rumah
  FOR DELETE USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- RLS policies for anggota_rumah (house members)
CREATE POLICY "House owners can manage members" ON public.anggota_rumah
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.rumah r
      JOIN public.user_profiles up ON up.pengguna_id = r.id_pengguna
      WHERE r.id_rumah = anggota_rumah.id_rumah 
      AND up.id = auth.uid()
    )
  );

CREATE POLICY "Members can view their own membership" ON public.anggota_rumah
  FOR SELECT USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- RLS policies for barang (items)
CREATE POLICY "House members can manage items" ON public.barang
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.anggota_rumah ar
      JOIN public.user_profiles up ON up.pengguna_id = ar.id_pengguna
      WHERE ar.id_rumah = barang.id_rumah 
      AND up.id = auth.uid()
      AND ar.status = 'aktif'
    ) OR EXISTS (
      SELECT 1 FROM public.rumah r
      JOIN public.user_profiles up ON up.pengguna_id = r.id_pengguna
      WHERE r.id_rumah = barang.id_rumah 
      AND up.id = auth.uid()
    )
  );

-- RLS policies for daftar_belanja (shopping lists)
CREATE POLICY "House members can manage shopping lists" ON public.daftar_belanja
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.anggota_rumah ar
      JOIN public.user_profiles up ON up.pengguna_id = ar.id_pengguna
      WHERE ar.id_rumah = daftar_belanja.id_rumah 
      AND up.id = auth.uid()
      AND ar.status = 'aktif'
    ) OR EXISTS (
      SELECT 1 FROM public.rumah r
      JOIN public.user_profiles up ON up.pengguna_id = r.id_pengguna
      WHERE r.id_rumah = daftar_belanja.id_rumah 
      AND up.id = auth.uid()
    )
  );

-- RLS policies for riwayat_stok (stock history)
CREATE POLICY "House members can view stock history" ON public.riwayat_stok
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.barang b
      JOIN public.anggota_rumah ar ON ar.id_rumah = b.id_rumah
      JOIN public.user_profiles up ON up.pengguna_id = ar.id_pengguna
      WHERE b.id_barang = riwayat_stok.id_barang 
      AND up.id = auth.uid()
      AND ar.status = 'aktif'
    ) OR EXISTS (
      SELECT 1 FROM public.barang b
      JOIN public.rumah r ON r.id_rumah = b.id_rumah
      JOIN public.user_profiles up ON up.pengguna_id = r.id_pengguna
      WHERE b.id_barang = riwayat_stok.id_barang 
      AND up.id = auth.uid()
    )
  );

CREATE POLICY "Users can create stock history" ON public.riwayat_stok
  FOR INSERT WITH CHECK (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- RLS policies for rekomendasi_belanja
CREATE POLICY "House members can manage shopping recommendations" ON public.rekomendasi_belanja
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.daftar_belanja db
      JOIN public.anggota_rumah ar ON ar.id_rumah = db.id_rumah
      JOIN public.user_profiles up ON up.pengguna_id = ar.id_pengguna
      WHERE db.id_daftar = rekomendasi_belanja.id_daftar 
      AND up.id = auth.uid()
      AND ar.status = 'aktif'
    ) OR EXISTS (
      SELECT 1 FROM public.daftar_belanja db
      JOIN public.rumah r ON r.id_rumah = db.id_rumah
      JOIN public.user_profiles up ON up.pengguna_id = r.id_pengguna
      WHERE db.id_daftar = rekomendasi_belanja.id_daftar 
      AND up.id = auth.uid()
    )
  );

-- Public read access for katalog_produk and kategori_produk (product catalog)
CREATE POLICY "Anyone can view product catalog" ON public.katalog_produk
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view product categories" ON public.kategori_produk
  FOR SELECT USING (true);

-- RLS policies for langganan (subscriptions)
CREATE POLICY "Users can view their own subscriptions" ON public.langganan
  FOR SELECT USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own subscriptions" ON public.langganan
  FOR ALL USING (
    id_pengguna IN (
      SELECT pengguna_id FROM public.user_profiles WHERE id = auth.uid()
    )
  );

-- RLS policies for promo (public read access)
CREATE POLICY "Anyone can view promos" ON public.promo
  FOR SELECT USING (true);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_pengguna_id INTEGER;
BEGIN
  -- Insert into pengguna table first
  INSERT INTO public.pengguna (nama_pengguna, email_pengguna, kata_sandi)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'nama_pengguna', split_part(NEW.email, '@', 1)), 
    NEW.email, 
    'auth_managed'
  ) RETURNING id_pengguna INTO new_pengguna_id;
  
  -- Create user profile mapping
  INSERT INTO public.user_profiles (id, pengguna_id, nama_pengguna, email_pengguna)
  VALUES (
    NEW.id, 
    new_pengguna_id, 
    COALESCE(NEW.raw_user_meta_data->>'nama_pengguna', split_part(NEW.email, '@', 1)), 
    NEW.email
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();