import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const Header = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // Use the useAuth hook

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Automédon</h1>
        <nav className="hidden md:flex space-x-4">
          <Link
            to="/"
            className={`hover:text-gray-300 ${location.pathname === '/' ? 'text-gray-300' : ''}`}
          >
            Accueil
          </Link>
          {user ? ( // Conditionally render links based on user state
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
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hover:text-gray-300 ${location.pathname === '/login' ? 'text-gray-300' : ''}`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`hover:text-gray-300 ${location.pathname === '/register' ? 'text-gray-300' : ''}`}
              >
                Register
              </Link>
            </>
          )}
        </nav>
        <div className="md:hidden">
          {/* Mobile menu button - consider implementing a mobile menu */}
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;