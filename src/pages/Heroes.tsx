import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Medal, Award, User, Loader2 } from 'lucide-react';

interface HeroStats {
  name: string;
  count: number;
}

export default function Heroes() {
  const [heroes, setHeroes] = useState<HeroStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('reporter_name')
        .eq('status', 'FOUND')
        .eq('is_resolved', true);

      if (error) throw error;

      if (data) {
        const counts: Record<string, number> = {};
        data.forEach((item) => {
          let name = item.reporter_name?.trim();
          if (!name) name = 'Anonim';

          const lowerName = name.toLowerCase();
          const displayKey =
            counts[lowerName]
              ? Object.keys(counts).find((k) => k.toLowerCase() === lowerName) || name
              : name;

          counts[displayKey] = (counts[displayKey] || 0) + 1;
        });

        const sortedHeroes = Object.entries(counts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setHeroes(sortedHeroes);
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMedalIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-8 h-8 text-amber-500 drop-shadow-md" />;
      case 1: return <Medal className="w-7 h-7 text-slate-400 drop-shadow-md" />;
      case 2: return <Award className="w-7 h-7 text-amber-700 drop-shadow-md" />;
      default: return <span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span>;
    }
  };

  const getRowStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-gradient-to-r from-amber-50 to-white border-amber-200 shadow-amber-100/50 shadow-sm transform scale-[1.02] z-10';
      case 1: return 'bg-gradient-to-r from-slate-50 to-white border-slate-200';
      case 2: return 'bg-gradient-to-r from-orange-50 to-white border-orange-100';
      default: return 'bg-white border-slate-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 rounded-full mb-4 shadow-inner">
          <Trophy className="w-12 h-12 text-amber-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Pahlawan Kampus
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Penghargaan khusus untuk orang-orang jujur dan baik hati yang telah menemukan dan mengembalikan barang milik orang lain.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-500 font-medium">Memuat daftar pahlawan...</p>
        </div>
      ) : heroes.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />

          <div className="p-2 sm:p-6 space-y-3">
            {heroes.map((hero, index) => (
              <div
                key={hero.name}
                className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${getRowStyle(index)}`}
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 shrink-0">
                    {getMedalIcon(index)}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full hidden sm:flex ${index < 3 ? 'bg-white/50 shadow-sm' : 'bg-slate-100'}`}>
                      <User className={`w-5 h-5 ${index < 3 ? 'text-slate-700' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold sm:text-lg tracking-tight ${index === 0 ? 'text-amber-900 text-xl' : 'text-slate-800'}`}>
                        {hero.name}
                      </h3>
                      {index === 0 && (
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Top Contributor
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-end gap-1.5 justify-end">
                    <span className={`font-black text-2xl sm:text-4xl leading-none ${index === 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                      {hero.count}
                    </span>
                  </div>
                  <span className={`text-xs sm:text-sm font-medium ${index === 0 ? 'text-amber-700/70' : 'text-slate-500'}`}>
                    Barang Dikembalikan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
          <Trophy className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Belum Ada Data</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Jadilah pahlawan pertama! Jika Anda menemukan barang yang hilang, laporkan di web ini dan kembalikan ke pemiliknya.
          </p>
        </div>
      )}
    </div>
  );
}
