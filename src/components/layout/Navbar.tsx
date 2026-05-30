import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, UserCircle, MapPin, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();

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

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2" title={user.email}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                  ) : (
                    <UserCircle className="h-7 w-7 text-brand-600" />
                  )}
                  <span className="hidden sm:inline text-sm font-semibold text-slate-700 max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <button 
                  onClick={signOut}
                  className="text-xs text-rose-600 hover:text-white hover:bg-rose-500 font-bold px-2.5 py-1.5 bg-rose-50 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pl-2 sm:pl-3 border-l border-slate-200">
                <button 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 transition-colors shadow-sm"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 shrink-0" alt="Google" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              </div>
            )}
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
