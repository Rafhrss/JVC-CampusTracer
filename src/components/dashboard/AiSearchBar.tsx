import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface AiSearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function AiSearchBar({ onSearch, isLoading }: AiSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-teal-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
        <form onSubmit={handleSubmit} className="relative flex items-center w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
          <div className="pl-6 text-slate-400">
            <Sparkles className="h-6 w-6 text-brand-500" />
          </div>
          <input
            type="text"
            className="w-full py-5 pl-4 pr-16 text-lg text-slate-900 bg-transparent outline-none placeholder:text-slate-400"
            placeholder="Ketik apa yang Anda hilangkan secara kasual... (Cth: Dompet kulit hitam lipat di kantin)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 p-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          </button>
        </form>
      </div>
      <p className="text-center text-sm text-slate-500 mt-3 font-medium">
        ✨ Powered by Semantic AI Search
      </p>
    </div>
  );
}
