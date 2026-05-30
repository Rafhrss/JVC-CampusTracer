-- ================================================================
-- CampusTracer: Fitur Upload Gambar (Supabase Storage)
-- Jalankan skrip ini di Supabase SQL Editor
-- ================================================================

-- 1. Tambahkan kolom image_url ke tabel items
ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. Buat Storage Bucket baru untuk menampung gambar (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Hapus policy lama (mencegah error jika dijalankan berulang)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;

-- 4. Policy: Semua orang (publik) bisa melihat (SELECT) gambar di bucket item-images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'item-images' );

-- 5. Policy: Hanya pengguna yang sudah login (Authenticated) yang bisa mengunggah (INSERT) gambar
CREATE POLICY "Auth Insert"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'item-images' AND auth.role() = 'authenticated' );

-- 6. Policy: Hanya pemilik gambar (berdasarkan UUID di awal nama file) yang bisa UPDATE gambar mereka
CREATE POLICY "Auth Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1] );

-- 7. Policy: Hanya pemilik gambar (berdasarkan UUID di awal nama file) yang bisa DELETE gambar mereka
CREATE POLICY "Auth Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'item-images' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Selesai!
