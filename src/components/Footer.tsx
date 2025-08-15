import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-primary text-primary-foreground p-6 shadow-inner mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
        <div className="flex space-x-4 mb-4 md:mb-0">
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/cgv" className="hover:underline">
            CGV
          </Link>
          <Link to="/" className="hover:underline">
            Automedon
          </Link>
        </div>
        <p className="text-center md:text-right">
          © 2025 Automedon. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;