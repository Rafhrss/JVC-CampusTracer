import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, UserCircle, MapPin, Trophy } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-500 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">
                Campus<span className="text-brand-600">Tracer</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-1 md:space-x-2">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-brand-600 bg-brand-50' 
                  : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Cari Barang</span>
            </Link>
            
            <Link 
              to="/report" 
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors ${
                isActive('/report') 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Lapor Baru</span>
            </Link>

            <Link 
              to="/heroes" 
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/heroes') 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Pahlawan</span>
            </Link>

            {/* Guest Mode Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400">
              <UserCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Guest</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    {/* Mobile Floating Action Button (FAB) for Lapor Baru */}
    {(location.pathname === '/' || location.pathname === '/search') && (
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <Link
          to="/report"
          className="flex items-center justify-center w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 border-4 border-white"
          title="Lapor Baru"
        >
          <PlusCircle className="h-6 w-6" />
        </Link>
      </div>
    )}
    </>
  );
}
