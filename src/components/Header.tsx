import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Handshake, MapPin, Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);
  const isAuthed = !!localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Barter Adverts</h1>
                <p className="text-xs text-gray-500">Media Marketplace</p>
              </div>
            </div>
          </Link>

          {/* Location */}
          <div className="hidden md:flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Mumbai, India</span>
          </div>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-700 hover:text-blue-600 font-medium">Marketplace</Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">How It Works</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
          </nav>

          {/* Right side: auth or profile */}
          {!isAuthed ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
              <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Sign In
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center relative">
              <button
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700"
                onClick={() => setMenuOpen(v => !v)}
              >
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white grid place-items-center">
                  {(user?.firstName?.[0] || 'U').toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <div className="font-medium">{user?.firstName || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-lg border bg-white shadow-md">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50">My Dashboard</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50">Settings</Link>
                  <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/marketplace" className="text-gray-700 hover:text-blue-600 font-medium">Marketplace</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-blue-600 font-medium">How It Works</Link>
              <Link to="/pricing" className="text-gray-700 hover:text-blue-600 font-medium">Pricing</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>

              {!isAuthed ? (
                <>
                  <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-center">Sign Up</Link>
                  <Link to="/login" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg text-center">Sign In</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="px-6 py-2 rounded-lg border text-center">My Dashboard</Link>
                  <Link to="/settings" className="px-6 py-2 rounded-lg border text-center">Settings</Link>
                  <button onClick={logout} className="px-6 py-2 rounded-lg bg-gray-100 text-center">Sign Out</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
