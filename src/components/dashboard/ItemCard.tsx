import { useState } from 'react';
import type { AiMatchResult } from '../../types';
import { MapPin, Calendar, CheckCircle2, AlertCircle, X, AlignLeft } from 'lucide-react';

interface ItemCardProps {
  matchResult: AiMatchResult;
}

export default function ItemCard({ matchResult }: ItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const formatContact = (contact: string) => contact.replace(/[^0-9]/g, '');

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col h-full relative cursor-pointer group"
      >
        
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

          <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight group-hover:text-brand-600 transition-colors">
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
            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm group-hover:bg-brand-50 transition-colors">
              <div className="font-semibold text-slate-700 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wide">
                <span>✨ Analisis AI</span>
              </div>
              <p className="text-slate-600 italic">"{justification}"</p>
            </div>
          )}
        </div>

        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 mt-auto flex justify-between items-center text-sm">
          <span className="text-slate-500">
            Pelapor: <span className="font-medium text-slate-700">{item.reporter_name || 'Anonim'}</span>
          </span>
          {item.reporter_contact && (
            <a 
              href={`https://wa.me/${formatContact(item.reporter_contact)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // Prevent opening modal when clicking contact
              className="text-brand-600 hover:text-brand-700 font-medium hover:underline inline-flex items-center gap-1"
            >
              Hubungi
            </a>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setIsModalOpen(false)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
          
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${statusColor}`}>
                  {statusIcon}
                  {statusText}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-1.5 bg-white border border-slate-200 rounded-full">
                  {item.category}
                </span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
              {match_percentage !== undefined && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-bold text-sm mb-4 ${matchColor}`}>
                  <span>✨ {match_percentage}% Match</span>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                {item.title}
              </h2>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlignLeft className="w-4 h-4" /> Deskripsi Lengkap
                  </h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {item.raw_description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Lokasi
                    </h4>
                    <p className="text-slate-800 font-medium">{item.last_location}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Tanggal
                    </h4>
                    <p className="text-slate-800 font-medium">
                      {new Date(item.date_event).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {justification && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Analisis Kecerdasan Buatan
                    </h4>
                    <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl">
                      <p className="text-brand-900 italic font-medium">"{justification}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Modal */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Pelapor</p>
                <p className="font-bold text-slate-900">{item.reporter_name || 'Anonim'}</p>
              </div>
              
              {item.reporter_contact ? (
                <a 
                  href={`https://wa.me/${formatContact(item.reporter_contact)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-sm shadow-brand-500/30"
                >
                  Hubungi via WA
                </a>
              ) : (
                <span className="text-slate-400 text-sm font-medium italic">Kontak tidak tersedia</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
