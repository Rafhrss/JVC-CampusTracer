import { Link, useLocation } from 'react-router-dom';
import { Search, PlusCircle, UserCircle, MapPin, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <nav className="bg-slate-300 shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-colors duration-300">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                isActive('/') 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md' 
                  : 'text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Cari Barang</span>
            </Link>
            
            <Link 
              to="/report" 
              className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                isActive('/report') 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md' 
                  : 'text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Lapor Baru</span>
            </Link>

            <Link 
              to="/heroes" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                isActive('/heroes') 
                  ? 'text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md' 
                  : 'text-slate-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Pahlawan</span>
            </Link>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 sm:pl-3 ml-2 border-l border-slate-300">
                <div className="flex items-center gap-2 bg-slate-300 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm" title={user.email}>
                  {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full" />
                  ) : (
                    <UserCircle className="h-7 w-7 text-slate-400" />
                  )}
                  <span className="hidden sm:inline text-sm font-bold text-slate-700 max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <button 
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-md hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pl-2 sm:pl-3 ml-2 border-l border-slate-300">
                <button 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 bg-white border border-slate-200 transition-all duration-300 hover:border-transparent hover:text-white hover:bg-gradient-to-r hover:from-orange-400 hover:to-amber-400 hover:shadow-md hover:-translate-y-0.5"
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
      <div className="sm:hidden fixed bottom-8 right-8 z-50">
        <Link
          to="/report"
          className="flex items-center justify-center w-18 h-18 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 border-4 border-white"
          title="Lapor Baru"
        >
          <PlusCircle className="h-12 w-12" />
        </Link>
      </div>
    )}
    </>
  );
}
