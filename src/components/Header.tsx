import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Import Sheet components
import { Button } from '@/components/ui/button'; // Import Button component
import { MenuIcon } from 'lucide-react'; // Import Menu icon

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally close mobile menu after logout
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Make title clickable */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          <h1>Automédon</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-gray-300' : ''}`}
          >
            Accueil
          </Link>
          {user ? (
            <>
              <Link
                to="/concessionnaire"
                className={`hover:text-gray-300 ${location.pathname === '/concessionnaire' ? 'text-gray-300' : ''}`}
              >
                Concessionnaire
              </Link>
              <Link
                to="/convoyeur"
                className={`hover:text-gray-300 ${location.pathname === '/convoyeur' ? 'text-gray-300' : ''}`}
              >
                Convoyeur
              </Link>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 focus:outline-none"
              >
                Déconnexion {/* Translated Logout */}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hover:text-gray-300 ${location.pathname === '/login' ? 'text-gray-300' : ''}`}
              >
                Connexion {/* Translated Login */}
              </Link>
              <Link
                to="/register"
                className={`hover:text-gray-300 ${location.pathname === '/register' ? 'text-gray-300' : ''}`}
              >
                S'inscrire {/* Translated Register */}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
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
                    onClick={closeMobileMenu} // Close menu on click
                  >
                    Accueil
                  </Link>
                {user ? (
                  <>
                    <Link
                      to="/concessionnaire"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/concessionnaire' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu} // Close menu on click
                    >
                      Concessionnaire
                    </Link>
                    <Link
                      to="/convoyeur"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/convoyeur' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu} // Close menu on click
                    >
                      Convoyeur
                    </Link>
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }} // Logout and close menu
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
                      onClick={closeMobileMenu} // Close menu on click
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/register' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu} // Close menu on click
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