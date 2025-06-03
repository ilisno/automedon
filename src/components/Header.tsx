import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-ui-react'; // Import useSupabaseClient
import { useAuth } from '@/context/AuthContext'; // Import the new AuthContext for profile

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { user, profile } = useAuth(); // Get user and profile from our AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsMobileMenuOpen(false);
      navigate('/auth'); // Redirect to auth page after logout
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
          {user ? ( // Check for user from AuthContext
            <>
              <Link
                to="/account"
                className={`hover:text-gray-300 ${location.pathname === '/account' ? 'text-gray-300' : ''}`}
              >
                Mon Compte
              </Link>
              {profile?.role === 'concessionnaire' && (
                <Link
                  to="/concessionnaire"
                  className={`hover:text-gray-300 ${location.pathname === '/concessionnaire' ? 'text-gray-300' : ''}`}
                >
                  Concessionnaire
                </Link>
              )}
              {profile?.role === 'convoyeur' && (
                <Link
                  to="/convoyeur"
                  className={`hover:text-gray-300 ${location.pathname === '/convoyeur' ? 'text-gray-300' : ''}`}
                >
                  Convoyeur
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 focus:outline-none"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/auth" // Link to the new unified auth page
              className={`hover:text-gray-300 ${location.pathname === '/auth' ? 'text-gray-300' : ''}`}
            >
              Connexion / S'inscrire
            </Link>
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
                {user ? ( // Check for user from AuthContext
                  <>
                    <Link
                      to="/account"
                      className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/account' ? 'text-blue-600' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      Mon Compte
                    </Link>
                    {profile?.role === 'concessionnaire' && (
                      <Link
                        to="/concessionnaire"
                        className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/concessionnaire' ? 'text-blue-600' : ''}`}
                        onClick={closeMobileMenu}
                      >
                        Concessionnaire
                      </Link>
                    )}
                    {profile?.role === 'convoyeur' && (
                      <Link
                        to="/convoyeur"
                        className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/convoyeur' ? 'text-blue-600' : ''}`}
                        onClick={closeMobileMenu}
                      >
                        Convoyeur
                      </Link>
                    )}
                    <button
                      onClick={() => { handleLogout(); closeMobileMenu(); }}
                      className="text-lg font-medium text-left hover:text-blue-600 focus:outline-none"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth" // Link to the new unified auth page
                    className={`text-lg font-medium hover:text-blue-600 ${location.pathname === '/auth' ? 'text-blue-600' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    Connexion / S'inscrire
                  </Link>
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