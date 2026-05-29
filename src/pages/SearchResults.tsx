import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ItemCard from '../components/dashboard/ItemCard';
import { supabase } from '../lib/supabase';
import { generateEmbedding, analyzeMatch } from '../lib/gemini';
import type { AiMatchResult } from '../types';
import { ArrowLeft, PackageSearch, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<AiMatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query) {
      runSearch(query);
    }
  }, [query]);

  const runSearch = async (q: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryEmbedding = await generateEmbedding(q);

      const { data: lostMatches, error: lostError } = await supabase.rpc('match_items', {
        query_embedding: queryEmbedding,
        match_threshold: -1.0,
        match_count: 5,
        filter_status: 'LOST',
      });

      const { data: foundMatches, error: foundError } = await supabase.rpc('match_items', {
        query_embedding: queryEmbedding,
        match_threshold: -1.0,
        match_count: 5,
        filter_status: 'FOUND',
      });

      if (lostError && foundError) throw lostError || foundError;

      const combinedMatches = [...(lostMatches || []), ...(foundMatches || [])]
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 8);

      if (!combinedMatches || combinedMatches.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const aiAnalysis = await analyzeMatch(q, combinedMatches);

      const finalResults: AiMatchResult[] = combinedMatches
        .map((dbItem: any) => {
          const analysis = aiAnalysis.find((a: any) => a.id === dbItem.id);
          return {
            id: dbItem.id,
            similarity: dbItem.similarity,
            match_percentage: analysis?.match_percentage ?? Math.round(dbItem.similarity * 100),
            justification: analysis?.justification,
            item: dbItem,
          };
        })
        .filter((r) => r.match_percentage >= 30)
        .sort((a, b) => (b.match_percentage ?? 0) - (a.match_percentage ?? 0));

      setResults(finalResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Terjadi kesalahan saat mencari. Pastikan koneksi dan konfigurasi AI sudah benar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative z-10">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-brand-500 shrink-0" />
            <p className="text-sm text-slate-600 truncate">
              Hasil pencarian untuk:{' '}
              <span className="font-semibold text-slate-900">"{query}"</span>
            </p>
          </div>

          {!isLoading && !error && (
            <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full shrink-0">
              {results.length} hasil
            </span>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-brand-500" />
              </div>
              <Loader2 className="h-5 w-5 text-brand-500 animate-spin absolute -bottom-1 -right-1" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-800 text-lg">AI sedang menganalisis...</p>
              <p className="text-slate-500 text-sm mt-1">Mencari kecocokan semantik dari database</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">Pencarian gagal</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">{error}</p>
            </div>
            <Link to="/" className="mt-2 px-5 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
              Coba Lagi dari Beranda
            </Link>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
              <PackageSearch className="h-7 w-7 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">Tidak ada hasil ditemukan</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Coba gunakan kata kunci lain, atau{' '}
                <Link to="/report" className="text-brand-600 hover:underline">buat laporan baru</Link>.
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-500" />
                <h1 className="text-xl font-bold text-slate-900">Hasil Pencarian AI</h1>
              </div>
              <div className="h-px flex-1 bg-slate-200" />
              <p className="text-sm text-slate-400">Diurutkan berdasarkan kemiripan semantik</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((result) => (
                <ItemCard key={result.id} matchResult={result} />
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-10">
              Tidak menemukan yang tepat?{' '}
              <Link to="/report" className="text-brand-600 hover:underline">Lapor barang hilang Anda</Link>
              {' '}agar orang lain dapat membantu.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
