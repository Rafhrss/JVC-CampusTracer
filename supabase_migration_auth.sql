-- ================================================================
-- CampusTracer: Migrasi ke Autentikasi Supabase & RLS
-- Jalankan seluruh SQL ini di Supabase SQL Editor
-- ================================================================

-- 1. Tambahkan kolom user_id yang merujuk ke tabel auth.users bawaan Supabase
ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Mengaktifkan Row Level Security (RLS) di tabel items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 3. Hapus policy lama jika ada (mencegah error saat menjalankan ulang skrip)
DROP POLICY IF EXISTS "Public can read all items" ON public.items;
DROP POLICY IF EXISTS "Authenticated users can insert items" ON public.items;
DROP POLICY IF EXISTS "Users can update their own items" ON public.items;
DROP POLICY IF EXISTS "Users can delete their own items" ON public.items;

-- 4. Buat Policy: Siapapun (termasuk yang belum login) bisa melihat laporan (SELECT)
CREATE POLICY "Public can read all items"
ON public.items FOR SELECT
USING (true);

-- 5. Buat Policy: Hanya user yang sudah login (Authenticated) yang bisa membuat laporan (INSERT)
CREATE POLICY "Authenticated users can insert items"
ON public.items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Buat Policy: Hanya pemilik laporan yang bisa mengubah datanya (UPDATE)
CREATE POLICY "Users can update their own items"
ON public.items FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Buat Policy: Hanya pemilik laporan yang bisa menghapus datanya (DELETE)
CREATE POLICY "Users can delete their own items"
ON public.items FOR DELETE
USING (auth.uid() = user_id);

-- 8. Menghapus fungsi RPC lama (resolve_item) karena sekarang di-handle oleh RLS
DROP FUNCTION IF EXISTS public.resolve_item(BIGINT, TEXT);

-- 9. (Opsional) Jika kolom secret_pin ingin dibuang agar database lebih bersih
-- ALTER TABLE public.items DROP COLUMN IF EXISTS secret_pin;

-- Selesai! Cek hasilnya:
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'items';
