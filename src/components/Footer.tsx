import React from 'react';
import { Link } from 'react-router-dom';
// Removed social media icons imports as they are no longer needed

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"> {/* Adjusted grid columns */}
          {/* Section Marque */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-white mb-2">Automédon</h2>
            <p className="text-sm mb-4">&copy; {new Date().getFullYear()} Automédon. Tous droits réservés.</p>
            {/* Removed social media icons */}
            {/* Removed language selector */}
          </div>

          {/* Section Aide */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Aide</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">CGU</Link></li>
              {/* Removed Presse and Jobs links */}
            </ul>
          </div>

          {/* Removed Section Infos pratiques */}
          {/* Removed Section Nos services */}
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Removed descriptive text */}
      </div>
    </footer>
  );
};

export default Footer;