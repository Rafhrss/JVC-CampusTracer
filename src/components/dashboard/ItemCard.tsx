import type { AiMatchResult } from '../../types';
import { MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

interface ItemCardProps {
  matchResult: AiMatchResult;
}

export default function ItemCard({ matchResult }: ItemCardProps) {
  const { item, match_percentage, justification } = matchResult;

  if (!item) return null;

  const isLost = item.status === 'LOST';
  const statusColor = isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700';
  const statusIcon = isLost ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />;
  const statusText = isLost ? 'HILANG' : 'DITEMUKAN';

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-brand-500';
    if (percentage >= 50) return 'bg-amber-500';
    return 'bg-slate-500';
  };

  const matchColor = match_percentage !== undefined ? getMatchColor(match_percentage) : 'bg-slate-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full relative">
      
      {/* AI Match Badge */}
      {match_percentage !== undefined && (
        <div className={`absolute top-0 right-0 ${matchColor} text-white px-4 py-1.5 rounded-bl-xl font-bold text-sm shadow-sm flex items-center gap-1 z-10`}>
          <span>{match_percentage}% Match</span>
        </div>
      )}

      <div className="p-5 flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {statusIcon}
            {statusText}
          </span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-2 py-1 bg-slate-100 rounded-full">
            {item.category}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">
          {item.title}
        </h3>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {item.raw_description}
        </p>

        <div className="space-y-2 text-sm text-slate-500 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="line-clamp-1">{item.last_location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{new Date(item.date_event).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* AI Justification Section */}
        {justification && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm">
            <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
              <span>✨ Analisis AI</span>
            </div>
            <p className="text-slate-600 italic">"{justification}"</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">
            Pelapor: <span className="font-medium text-slate-700">{item.reporter_name || 'Anonim'}</span>
          </span>
          {item.reporter_contact && (
            <a 
              href={`https://wa.me/${item.reporter_contact.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline"
            >
              Hubungi
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
