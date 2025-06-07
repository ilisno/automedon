import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Section Marque et Réseaux Sociaux */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-bold text-white mb-2">Automédon</h2>
            <p className="text-sm mb-4">&copy; {new Date().getFullYear()} Automédon. Tous droits réservés.</p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
            <Select defaultValue="fr">
              <SelectTrigger className="w-[180px] bg-blue-800 text-gray-300 border-blue-700 hover:border-blue-600">
                <SelectValue placeholder="Langue" />
              </SelectTrigger>
              <SelectContent className="bg-blue-800 text-gray-300 border-blue-700">
                <SelectItem value="fr">FR - Français</SelectItem>
                <SelectItem value="en">EN - English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Section Aide */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Aide</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">CGU</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Presse</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Jobs</Link></li>
            </ul>
          </div>

          {/* Section Infos pratiques */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Infos pratiques</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Assurance</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Témoignages</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Application mobile</Link></li>
            </ul>
          </div>

          {/* Section Nos services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Nos services</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-white transition-colors">Location à 1 euro</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Livraison de véhicule</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Devenez chauffeur</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Solutions entreprise</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700 mb-8" />

        {/* Texte descriptif en bas */}
        <p className="text-center text-sm text-gray-500">
          Avec plus de 1 000 000 transports opérés depuis 2012, Automédon révolutionne la logistique automobile en Europe en digitalisant l'ensemble du processus.
        </p>
      </div>
    </footer>
  );
};

export default Footer;