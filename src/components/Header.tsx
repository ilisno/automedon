import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

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
        </nav>
        <div className="md:hidden">
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