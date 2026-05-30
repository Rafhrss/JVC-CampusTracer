import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { generateEmbedding } from '../lib/gemini';
import { Package, MapPin, Calendar, FileText, User, Phone, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ReportItem() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    status: 'LOST',
    title: '',
    category: 'Elektronik',
    raw_description: '',
    last_location: '',
    date_event: new Date().toISOString().split('T')[0],
    reporter_name: '',
    reporter_contact: ''
  });

  useEffect(() => {
    if (user && !formData.reporter_name) {
      setFormData(prev => ({
        ...prev,
        reporter_name: user.user_metadata?.full_name || ''
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Generate Embedding
      const textToEmbed = `${formData.title}. ${formData.raw_description}. Kategori: ${formData.category}. Lokasi: ${formData.last_location}`;
      const embedding = await generateEmbedding(textToEmbed);

      // 2. Insert into Supabase
      const { error } = await supabase.from('items').insert([
        {
          status: formData.status,
          title: formData.title,
          category: formData.category,
          raw_description: formData.raw_description,
          last_location: formData.last_location,
          date_event: formData.date_event,
          description_embedding: embedding,
          reporter_name: formData.reporter_name,
          reporter_contact: formData.reporter_contact,
          is_resolved: false,
          user_id: user.id
        }
      ]);

      if (error) throw error;

      alert('Laporan berhasil disimpan!');
      navigate('/');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      alert(`Gagal menyimpan laporan.\n\nDetail Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-12">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Terkunci</h2>
          <p className="text-slate-500 mb-8">
            Anda harus login menggunakan akun Google terlebih dahulu untuk bisa membuat laporan kehilangan atau penemuan barang.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold shadow-sm transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Laporkan Barang</h1>
        <p className="mt-2 text-slate-600">Bantu komunitas kampus dengan melaporkan barang yang Anda temukan atau hilangkan.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          {/* Status Toggle */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">Jenis Laporan</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`
                relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all
                ${formData.status === 'LOST' 
                  ? 'border-rose-500 ring-1 ring-rose-500 bg-rose-50' 
                  : 'border-slate-200 hover:bg-slate-50'}
              `}>
                <input type="radio" name="status" value="LOST" className="sr-only" 
                  checked={formData.status === 'LOST'} onChange={handleChange} />
                <span className="flex flex-col">
                  <span className={`block text-sm font-semibold ${formData.status === 'LOST' ? 'text-rose-900' : 'text-slate-900'}`}>Saya Kehilangan</span>
                  <span className={`block text-sm mt-1 ${formData.status === 'LOST' ? 'text-rose-700' : 'text-slate-500'}`}>Barang saya hilang dan sedang mencarinya.</span>
                </span>
              </label>
              
              <label className={`
                relative flex cursor-pointer rounded-xl border p-4 focus:outline-none transition-all
                ${formData.status === 'FOUND' 
                  ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50' 
                  : 'border-slate-200 hover:bg-slate-50'}
              `}>
                <input type="radio" name="status" value="FOUND" className="sr-only" 
                  checked={formData.status === 'FOUND'} onChange={handleChange} />
                <span className="flex flex-col">
                  <span className={`block text-sm font-semibold ${formData.status === 'FOUND' ? 'text-emerald-900' : 'text-slate-900'}`}>Saya Menemukan</span>
                  <span className={`block text-sm mt-1 ${formData.status === 'FOUND' ? 'text-emerald-700' : 'text-slate-500'}`}>Saya menemukan barang orang lain.</span>
                </span>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Detail Barang</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Judul Laporan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-slate-400" />
                  </div>
                  <input required type="text" name="title" value={formData.title} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Cth: Dompet Kulit Hitam" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Kategori</label>
                <select name="category" value={formData.category} onChange={handleChange}
                  className="block w-full py-2.5 px-3 border border-slate-300 bg-white rounded-lg focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm">
                  <option value="Elektronik">Elektronik</option>
                  <option value="Dompet & Tas">Dompet & Tas</option>
                  <option value="Kunci">Kunci</option>
                  <option value="Dokumen">Dokumen Pribadi</option>
                  <option value="Pakaian">Pakaian / Aksesoris</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi Detail</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
                <textarea required name="raw_description" value={formData.raw_description} onChange={handleChange} rows={4}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                  placeholder="Jelaskan ciri-ciri barang (warna, merek, isi, dsb) sedetail mungkin agar AI mudah mencocokkan." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lokasi Terakhir / Ditemukan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input required type="text" name="last_location" value={formData.last_location} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Cth: Kantin Fakultas Teknik" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Kejadian</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input required type="date" name="date_event" value={formData.date_event} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-2">Kontak Pelapor (Guest)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input required type="text" name="reporter_name" value={formData.reporter_name} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="Nama Anda" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">No. WhatsApp</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input required type="tel" name="reporter_contact" value={formData.reporter_contact} onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                    placeholder="081234567890" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 mr-4 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Memproses AI...
                </>
              ) : (
                'Simpan Laporan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
