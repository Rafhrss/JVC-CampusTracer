import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';
import { CampusTracerIcon } from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <CampusTracerIcon className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              Campus<span className="text-brand-600">Tracer</span>
            </span>
          </div>
          
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> untuk mempermudah kita
          </p>
          
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-brand-600 transition-colors">Cari Barang</Link>
            <Link to="/report" className="hover:text-brand-600 transition-colors">Lapor Baru</Link>
            <Link to="/heroes" className="hover:text-brand-600 transition-colors">Pahlawan</Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} CampusTracer. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Syarat & Ketentuan</span>
            <span className="hover:text-slate-600 cursor-pointer transition-colors">Kebijakan Privasi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
