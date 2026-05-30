import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import ReportItem from './pages/ReportItem';
import SearchResults from './pages/SearchResults';
import Heroes from './pages/Heroes';
import Particles from './components/ui/Particles';

function App() {
  return (
    <AuthProvider>
      <Router>
      {/* Global Dark Particles Layer for all pages */}
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-0">
        <Particles
          particleCount={150}
          particleSpread={10}
          speed={0.04}
          particleColors={['#000000', '#1a1a1a']}
          alphaParticles={false}
          particleBaseSize={80}
          sizeRandomness={1}
          cameraDistance={22}
          disableRotation={false}
        />
      </div>

      <div className="min-h-screen flex flex-col font-sans relative z-10">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={<ReportItem />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/heroes" element={<Heroes />} />
          </Routes>
        </main>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
