import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface AiSearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  dark?: boolean;
}

const QUICK_SEARCHES = [
  { emoji: '🔑', label: 'Kunci motor Honda' },
  { emoji: '📱', label: 'iPhone Biru' },
  { emoji: '👛', label: "Dompet kulit Levi's" },
  { emoji: '🏷️', label: 'Tumbler Corkcicle' },
];

export default function AiSearchBar({ onSearch, isLoading, dark = false }: AiSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  const handleQuickSearch = (label: string) => {
    setQuery(label);
    onSearch(label);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className={`flex items-center w-full rounded-2xl overflow-hidden shadow-md transition-all ${
        dark
          ? 'bg-white/10 backdrop-blur border border-white/20 focus-within:bg-white/15'
          : 'bg-white border border-slate-200 focus-within:ring-2 focus-within:ring-amber-400 focus-within:border-transparent'
      }`}>
        <div className="pl-5">
          {isLoading
            ? <Loader2 className={`h-5 w-5 animate-spin ${dark ? 'text-white/60' : 'text-brand-500'}`} />
            : <Search className={`h-5 w-5 ${dark ? 'text-white/60' : 'text-slate-400'}`} />
          }
        </div>
        <input
          type="text"
          className={`w-full py-4 pl-4 pr-4 text-base bg-transparent outline-none ${
            dark
              ? 'text-white placeholder:text-white/50'
              : 'text-slate-900 placeholder:text-slate-400'
          }`}
          placeholder="Deskripsikan barang Anda (contoh: 'kunci honda gantungan jaket kulit')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="mr-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors shrink-0 shadow-sm"
        >
          Cari
        </button>
      </form>

      {/* Quick search suggestions */}
      <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
        <span className={`flex items-center gap-1.5 text-sm ${dark ? 'text-white/50' : 'text-slate-400'}`}>
          <Sparkles className="h-3.5 w-3.5" />
          Coba cari:
        </span>
        {QUICK_SEARCHES.map((s) => (
          <button
            key={s.label}
            onClick={() => handleQuickSearch(s.label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
              dark
                ? 'text-white/80 bg-white/10 hover:bg-white/20 border border-white/10'
                : 'text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
