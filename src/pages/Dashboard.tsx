import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AiSearchBar from '../components/dashboard/AiSearchBar';
import StatCard from '../components/dashboard/StatCard';
import ItemCard from '../components/dashboard/ItemCard';
import { supabase } from '../lib/supabase';
import type { AiMatchResult, Item } from '../types';
import { ArchiveRestore, PackageSearch, CheckCircle, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [recentItems, setRecentItems] = useState<AiMatchResult[]>([]);
  const [stats, setStats] = useState({
    lostActive: 0,
    foundActive: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchStats();
    fetchRecentItems();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: lostCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'LOST').eq('is_resolved', false);
      const { count: foundCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'FOUND').eq('is_resolved', false);
      const { count: resolvedCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('is_resolved', true);
      setStats({ lostActive: lostCount || 0, foundActive: foundCount || 0, resolved: resolvedCount || 0 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error;
      if (data) {
        setRecentItems(data.map(item => ({ id: item.id, similarity: 0, item: item as Item })));
      }
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  // Navigate to /search page instead of running search inline
  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div>
      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden">
        {/* soft glow accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-100 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 mb-8 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Pencarian Semantik Berbasis AI Kampus
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-extrabold text-blue-900 leading-tight tracking-tight mb-4">
            Kehilangan sesuatu?
          </h1>
          <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            <span className="text-brand-600">Mari temukan </span>
            <span className="text-amber-500">bersama.</span>
          </h2>

          <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Platform Lost &amp; Found digital cerdas untuk civitas akademika. Gunakan
            pencarian bahasa kasual, AI kami akan menganalisis relevansi kecocokan barang
            secara semantik.
          </p>

          <AiSearchBar onSearch={handleSearch} isLoading={false} />
        </div>
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* How It Works */}
        <div className="mb-12 bg-white rounded-3xl border border-slate-200 shadow-md p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Bagaimana CampusTracer Bekerja?</h2>
            <p className="text-slate-500">Platform Lost &amp; Found modern untuk mempermudah pencarian barang hilang di area universitas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-1.5">Laporkan Kejadian</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Laporkan kehilangan barang atau penemuan barang melalui tombol pelaporan di pojok kanan atas.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-1.5">Klasifikasi AI</h3>
                <p className="text-slate-500 text-sm leading-relaxed">AI kami melakukan pemetaan kategori barang serta tagging semantik secara instan berdasarkan deskripsi Anda.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg font-bold shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-1.5">Hubungi &amp; Klaim</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Cari barang dengan bahasa sehari-hari Anda, klaim kecocokan, dan lakukan verifikasi serah-terima fisik.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          <StatCard title="Barang Hilang Aktif" value={stats.lostActive} icon={<PackageSearch className="w-5 h-5" />} trend="Perlu Bantuan" />
          <StatCard title="Barang Ditemukan" value={stats.foundActive} icon={<ArchiveRestore className="w-5 h-5" />} trend="Menunggu Diambil" trendUp={true} />
          <StatCard title="Kasus Selesai" value={stats.resolved} icon={<CheckCircle className="w-5 h-5" />} trend="Berhasil Kembali" trendUp={true} />
        </div>

        {/* Recent Items */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Laporan Terbaru</h2>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentItems.map((result) => (
                <ItemCard key={result.id} matchResult={result} onUpdated={fetchRecentItems} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
              <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-900">Belum ada laporan</h3>
              <p className="text-slate-500 max-w-md mx-auto mt-1">Jadilah yang pertama melaporkan barang hilang atau ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
