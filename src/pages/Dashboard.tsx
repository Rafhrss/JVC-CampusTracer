import { useState, useEffect } from 'react';
import AiSearchBar from '../components/dashboard/AiSearchBar';
import StatCard from '../components/dashboard/StatCard';
import ItemCard from '../components/dashboard/ItemCard';
import { supabase } from '../lib/supabase';
import { generateEmbedding, analyzeMatch } from '../lib/gemini';
import type { AiMatchResult, Item } from '../types';
import { ArchiveRestore, PackageSearch, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AiMatchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [stats, setStats] = useState({
    lostActive: 0,
    foundActive: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchStats();
    fetchRecentItems();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real app, this might be a single RPC call or multiple quick queries
      const { count: lostCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'LOST').eq('is_resolved', false);
      const { count: foundCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'FOUND').eq('is_resolved', false);
      const { count: resolvedCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('is_resolved', true);

      setStats({
        lostActive: lostCount || 0,
        foundActive: foundCount || 0,
        resolved: resolvedCount || 0
      });
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
        .limit(21);

      if (error) throw error;
      
      if (data) {
        setSearchResults(data.map(item => ({
          id: item.id,
          similarity: 0,
          item: item as Item
        })));
      }
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // 1. Generate Embedding from query
      const queryEmbedding = await generateEmbedding(query);
      
      // Karena beberapa versi RPC di Supabase gagal menangani filter_status: null, 
      // kita memanggilnya 2 kali (untuk LOST dan FOUND) lalu menggabungkannya.
      const { data: lostMatches, error: lostError } = await supabase.rpc('match_items', {
        query_embedding: queryEmbedding,
        match_threshold: -1.0,
        match_count: 5,
        filter_status: 'LOST'
      });

      const { data: foundMatches, error: foundError } = await supabase.rpc('match_items', {
        query_embedding: queryEmbedding,
        match_threshold: -1.0,
        match_count: 5,
        filter_status: 'FOUND'
      });

      if (lostError && foundError) throw lostError || foundError;

      const combinedMatches = [...(lostMatches || []), ...(foundMatches || [])]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);

      if (!combinedMatches || combinedMatches.length === 0) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      // 3. AI Justification & Percentage via Gemini Flash
      // Pass all combinedMatches to get analysis for everything
      const aiAnalysis = await analyzeMatch(query, combinedMatches); 
      
      // Combine results and filter out very low matches
      const finalResults = combinedMatches.map((dbItem: any) => {
        const analysis = aiAnalysis.find(a => a.id === dbItem.id);
        return {
          id: dbItem.id,
          similarity: dbItem.similarity,
          match_percentage: analysis?.match_percentage || Math.round(dbItem.similarity * 100),
          justification: analysis?.justification,
          item: dbItem as Item
        };
      }).filter((result) => result.match_percentage >= 40);

      // Sort by match_percentage descending
      finalResults.sort((a: AiMatchResult, b: AiMatchResult) => (b.match_percentage || 0) - (a.match_percentage || 0));

      setSearchResults(finalResults);

    } catch (error) {
      console.error('Search error:', error);
      alert('Terjadi kesalahan saat mencari. Pastikan konfigurasi Supabase dan Gemini benar.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard 
          title="Sedang Dicari" 
          value={stats.lostActive} 
          icon={<PackageSearch className="w-6 h-6" />} 
          trend="Bantu temukan" 
        />
        <StatCard 
          title="Mencari Pemilik" 
          value={stats.foundActive} 
          icon={<ArchiveRestore className="w-6 h-6" />} 
          trend="Menunggu diambil" 
          trendUp={true}
        />
        <StatCard 
          title="Berhasil Kembali" 
          value={stats.resolved} 
          icon={<CheckCircle className="w-6 h-6" />} 
          trend="Bukti web ini bermanfaat!" 
          trendUp={true}
        />
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Kehilangan Sesuatu? Atau Menemukan Sesuatu?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Gunakan AI pencarian semantik kami. Cukup ketik dengan gaya bahasa sehari-hari, sistem akan mencocokkan makna deskripsi Anda dengan database kami.
          </p>
        </div>
        
        <AiSearchBar onSearch={handleSearch} isLoading={isSearching} />
      </div>

      {/* Results Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {hasSearched ? 'Hasil Pencarian AI' : 'Laporan Terbaru'}
          </h2>
          {hasSearched && !isSearching && searchResults.length > 0 && (
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {searchResults.length} hasil ditemukan
            </span>
          )}
        </div>

        {isSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <ItemCard key={result.id} matchResult={result} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed">
            <PackageSearch className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">Tidak ada hasil</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-1">
              Coba deskripsikan dengan kata lain atau buat laporan baru jika Anda kehilangan barang ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
