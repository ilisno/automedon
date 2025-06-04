import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Concessionnaire = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Espace Concessionnaire</h1>
        <p className="text-lg mb-8 text-center">
          Bienvenue dans votre espace dédié.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/create-mission">
            <Button className="px-8 py-4 text-lg">Créer une nouvelle mission</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="px-8 py-4 text-lg">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Concessionnaire;