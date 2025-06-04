import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Convoyeur = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Espace Convoyeur</h1>
      <p className="text-lg mb-8 text-center">
        Bienvenue dans votre espace dédié.
      </p>
      <Link to="/">
        <Button variant="outline">Retour à l'accueil</Button>
      </Link>
    </div>
  );
};

export default Convoyeur;