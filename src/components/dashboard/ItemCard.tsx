import { useState, useEffect } from 'react';
import type { AiMatchResult } from '../../types';
import {
  MapPin, Calendar, CheckCircle2, AlertCircle, X, AlignLeft,
  ShieldCheck, Loader2, Pencil, Trash2, Save, RotateCcw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ItemCardProps {
  matchResult: AiMatchResult;
  onUpdated?: () => void;
}

type ModalView = 'detail' | 'resolve' | 'edit' | 'delete';

export default function ItemCard({ matchResult, onUpdated }: ItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('detail');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(null);

  // Edit form state (mirrors item fields)
  const [editData, setEditData] = useState({
    title: '',
    raw_description: '',
    last_location: '',
    category: '',
    status: 'LOST' as 'LOST' | 'FOUND',
    date_event: '',
  });

  const { item, match_percentage, justification } = matchResult;

  useEffect(() => {
    if (isModalOpen && item) {
      const pins = JSON.parse(localStorage.getItem('campustracer_pins') || '{}');
      setSavedPin(pins[item.id] ?? null);
      // Pre-populate edit form
      setEditData({
        title: item.title,
        raw_description: item.raw_description,
        last_location: item.last_location,
        category: item.category,
        status: item.status,
        date_event: item.date_event?.split('T')[0] ?? '',
      });
    }
  }, [isModalOpen, item]);

  if (!item) return null;

  const isResolved = item.is_resolved;
  const isLost = item.status === 'LOST';
  const isOwner = !!savedPin;

  let statusColor = 'bg-emerald-100 text-emerald-700';
  let statusIcon = <CheckCircle2 className="w-4 h-4" />;
  let statusText = 'SELESAI';
  if (!isResolved) {
    statusColor = isLost ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700';
    statusIcon = isLost ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />;
    statusText = isLost ? 'HILANG' : 'DITEMUKAN';
  }

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return 'bg-brand-500';
    if (pct >= 50) return 'bg-amber-500';
    return 'bg-slate-500';
  };
  const matchColor = match_percentage !== undefined ? getMatchColor(match_percentage) : 'bg-slate-500';

  const formatContact = (c: string) => c.replace(/[^0-9]/g, '');

  const closeModal = () => {
    setIsModalOpen(false);
    setModalView('detail');
    setPinValue('');
    setShowPinInput(false);
  };

  // ── ACTIONS ──────────────────────────────────────────────────
  const handleResolve = async (pin: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.rpc('resolve_item', { p_item_id: item.id, p_pin: pin });
      if (error) throw error;
      if (data === true) {
        closeModal();
        onUpdated ? onUpdated() : window.location.reload();
      } else {
        alert('❌ PIN salah. Coba lagi.');
      }
    } catch { alert('Terjadi kesalahan saat memproses.'); }
    finally { setIsProcessing(false); }
  };

  const handleEdit = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('items')
        .update({
          title: editData.title,
          raw_description: editData.raw_description,
          last_location: editData.last_location,
          category: editData.category,
          status: editData.status,
          date_event: editData.date_event,
        })
        .eq('id', item.id);
      if (error) throw error;
      closeModal();
      onUpdated ? onUpdated() : window.location.reload();
    } catch { alert('Gagal menyimpan perubahan.'); }
    finally { setIsProcessing(false); }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.from('items').delete().eq('id', item.id);
      if (error) throw error;
      closeModal();
      onUpdated ? onUpdated() : window.location.reload();
    } catch { alert('Gagal menghapus laporan.'); }
    finally { setIsProcessing(false); }
  };

  // ── CARD ─────────────────────────────────────────────────────
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col h-full relative cursor-pointer group"
      >
        {isResolved && (
          <div className="absolute inset-0 bg-white/75 z-10 flex items-center justify-center rounded-xl">
            <span className="bg-slate-100 text-slate-500 text-xs font-bold uppercase px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Kasus Selesai
            </span>
          </div>
        )}

        {match_percentage !== undefined && (
          <div className={`absolute top-0 right-0 ${matchColor} text-white px-3 py-1 rounded-bl-xl font-bold text-xs z-10`}>
            {match_percentage}% Match
          </div>
        )}

        <div className="p-5 flex-grow">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {statusIcon}{statusText}
            </span>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-full border border-slate-100">
              {item.category}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.raw_description}</p>

          <div className="space-y-1.5 text-xs text-slate-400">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{item.last_location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{new Date(item.date_event).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>

          {justification && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
              <p className="font-semibold text-slate-400 uppercase tracking-wide mb-1">✨ Analisis AI</p>
              <p className="text-slate-600 italic line-clamp-2">"{justification}"</p>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs bg-slate-50">
          <span className="text-slate-500">
            <span className="font-medium text-slate-700">{item.reporter_name || 'Anonim'}</span>
          </span>
          {item.reporter_contact && (
            <a
              href={`https://wa.me/${formatContact(item.reporter_contact)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-brand-600 font-medium hover:underline"
            >
              Hubungi
            </a>
          )}
        </div>
      </div>

      {/* ── MODAL ───────────────────────────────────────────────── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                  {statusIcon}{statusText}
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider px-2.5 py-1 bg-white border border-slate-200 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {/* Owner actions removed from header, moved to bottom */}
                <button
                  onClick={closeModal}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">

              {/* ── DELETE CONFIRM VIEW ── */}
              {modalView === 'delete' ? (
                <div className="text-center py-4">
                  <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-7 h-7 text-rose-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Hapus Laporan Ini?</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Tindakan ini tidak dapat dibatalkan. Laporan <span className="font-medium text-slate-700">"{item.title}"</span> akan dihapus permanen.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalView('detail')}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={handleDelete}
                      className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      Ya, Hapus
                    </button>
                  </div>
                </div>

              /* ── EDIT VIEW ── */
              ) : modalView === 'edit' ? (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-brand-500" /> Edit Laporan
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Judul</label>
                    <input
                      type="text"
                      value={editData.title}
                      onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status</label>
                      <select
                        value={editData.status}
                        onChange={e => setEditData(p => ({ ...p, status: e.target.value as 'LOST' | 'FOUND' }))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 outline-none bg-white"
                      >
                        <option value="LOST">HILANG</option>
                        <option value="FOUND">DITEMUKAN</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Kategori</label>
                      <select
                        value={editData.category}
                        onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 outline-none bg-white"
                      >
                        <option value="Elektronik">Elektronik</option>
                        <option value="Dompet & Tas">Dompet & Tas</option>
                        <option value="Kunci">Kunci</option>
                        <option value="Dokumen">Dokumen</option>
                        <option value="Pakaian">Pakaian</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Deskripsi</label>
                    <textarea
                      rows={3}
                      value={editData.raw_description}
                      onChange={e => setEditData(p => ({ ...p, raw_description: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 focus:border-transparent outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Lokasi</label>
                      <input
                        type="text"
                        value={editData.last_location}
                        onChange={e => setEditData(p => ({ ...p, last_location: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tanggal</label>
                      <input
                        type="date"
                        value={editData.date_event}
                        onChange={e => setEditData(p => ({ ...p, date_event: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setModalView('detail')}
                      className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Batal
                    </button>
                    <button
                      disabled={isProcessing}
                      onClick={handleEdit}
                      className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan
                    </button>
                  </div>
                </div>

              /* ── DETAIL VIEW (default) ── */
              ) : (
                <>
                  {match_percentage !== undefined && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-bold text-xs ${matchColor}`}>
                      ✨ {match_percentage}% Match
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-slate-900 leading-snug">{item.title}</h2>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlignLeft className="w-3.5 h-3.5" /> Deskripsi Lengkap
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {item.raw_description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Lokasi
                      </h4>
                      <p className="text-sm text-slate-800 font-medium">{item.last_location}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Tanggal
                      </h4>
                      <p className="text-sm text-slate-800 font-medium">
                        {new Date(item.date_event).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {justification && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Analisis AI</h4>
                      <div className="bg-brand-50 border border-brand-100 p-3 rounded-xl">
                        <p className="text-sm text-brand-900 italic font-medium">"{justification}"</p>
                      </div>
                    </div>
                  )}

                  {/* Resolve */}
                  {!isResolved && (
                    <div className="pt-3 border-t border-slate-100">
                      {isOwner ? (
                        <div className="space-y-3">
                          <button
                            disabled={isProcessing}
                            onClick={() => handleResolve(savedPin!)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
                          >
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                            {isLost ? 'Alhamdulillah, Barang Sudah Ketemu!' : 'Barang Sudah Diserahkan ke Pemilik!'}
                          </button>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => setModalView('edit')}
                              className="flex-1 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-brand-200"
                            >
                              <Pencil className="w-4 h-4" /> Edit Laporan
                            </button>
                            <button
                              onClick={() => setModalView('delete')}
                              className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-rose-200"
                            >
                              <Trash2 className="w-4 h-4" /> Hapus
                            </button>
                          </div>
                        </div>
                      ) : showPinInput ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder="PIN"
                              value={pinValue}
                              onChange={e => setPinValue(e.target.value.replace(/\D/g, ''))}
                              className="flex-1 min-w-0 px-4 py-2.5 border border-slate-300 rounded-xl text-center font-black text-xl tracking-widest focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                            />
                            <button
                              disabled={isProcessing || pinValue.length !== 4}
                              onClick={() => handleResolve(pinValue)}
                              className="shrink-0 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-semibold text-sm hover:bg-brand-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                            >
                              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Konfirmasi'}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 text-center">Masukkan PIN 4 digit yang Anda terima saat laporan dibuat.</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowPinInput(true)}
                          className="w-full py-2.5 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-xl font-medium text-sm hover:border-brand-400 hover:text-brand-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Tandai Kasus Selesai (Butuh PIN)
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-2xl shrink-0">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pelapor</p>
                <p className="font-bold text-slate-900 text-sm">{item.reporter_name || 'Anonim'}</p>
              </div>
              {item.reporter_contact ? (
                <a
                  href={`https://wa.me/${formatContact(item.reporter_contact)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-colors"
                >
                  Hubungi via WA
                </a>
              ) : (
                <span className="text-slate-400 text-xs font-medium italic">Kontak tidak tersedia</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
