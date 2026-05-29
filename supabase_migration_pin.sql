-- ================================================================
-- CampusTracer: Migrasi PIN System
-- Jalankan seluruh SQL ini di Supabase SQL Editor
-- ================================================================

-- 1. Tambah kolom secret_pin ke tabel items (jika belum ada)
ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS secret_pin TEXT;

-- 2. Buat atau ganti function resolve_item
-- Function ini dipanggil dari frontend untuk menandai kasus selesai
CREATE OR REPLACE FUNCTION public.resolve_item(p_item_id BIGINT, p_pin TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_pin TEXT;
BEGIN
  -- Ambil PIN yang tersimpan di database
  SELECT secret_pin INTO v_stored_pin
  FROM public.items
  WHERE id = p_item_id;

  -- Jika item tidak ditemukan
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Cocokkan PIN
  IF v_stored_pin = p_pin THEN
    UPDATE public.items
    SET is_resolved = TRUE
    WHERE id = p_item_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$;

-- 3. (Opsional) Pastikan kolom is_resolved ada dengan default false
ALTER TABLE public.items
ALTER COLUMN is_resolved SET DEFAULT FALSE;

-- Selesai! Cek hasilnya:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'items' AND table_schema = 'public'
ORDER BY ordinal_position;
