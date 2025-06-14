import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { user, profile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          <h1>Automédon</h1>
        </Link>

        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-gray-300' : ''}`}
          >
            Accueil
          </Link>
          {user ? (
            <>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin-dashboard"
                  className={`hover:text-gray-300 ${location.pathname === '/admin-dashboard' ? 'text-gray-300' : ''}`}
                >
                  Admin
                </Link>
              )}
              <Link
                to="/account"
                className={`hover:text-gray-300 ${location.pathname === '/account' ? 'text-gray-300' : ''}`}
              >
                Mon Compte
              </Link>
              {/* Removed direct links to /concessionnaire and /convoyeur */}
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 focus:outline-none"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hover:text-gray-300 ${location.pathname === '/login' ? 'text-gray-300' : ''}`}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className={`hover:text-gray-300 ${location.pathname === '/register' ? 'text-gray-300' : ''}`}
              >
                S'inscrire
              </Link>
            </>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle mobile menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white text-black w-64">
              <nav className="flex flex-col space-y-4 mt-8">
                 <Link
                    to="/"
                    className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/' ? 'text-blue-600' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Accueil
                  </Link>
                {user ? (
                  <>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin-dashboard"
                        className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/admin-dashboard' ? 'text-blue-600' : ''}`}
                        onClick={closeMobileMenu}
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/account"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/account' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Mon Compte
                    </Link>
                    {/* Removed direct links to /concessionnaire and /convoyeur */}
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className="text-lg font-medium text-left hover:text-blue-600 focus:outline-none"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/login' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/register' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      S'inscrire
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;