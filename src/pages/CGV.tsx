import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CGV = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Conditions Générales de Vente (CGV)</h1>
        <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            Bienvenue sur Automédon. Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation de nos services.
            En utilisant notre plateforme, vous acceptez de vous conformer à ces conditions.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">1. Objet</h2>
          <p>
            Automédon est une plateforme de mise en relation entre concessionnaires et convoyeurs pour la gestion et le convoyage de véhicules.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">2. Inscription et Compte Utilisateur</h2>
          <p>
            L'accès à certains services nécessite la création d'un compte. Vous êtes responsable de la confidentialité de vos identifiants.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">3. Obligations des Utilisateurs</h2>
          <p>
            Les utilisateurs s'engagent à fournir des informations exactes et à respecter les lois en vigueur.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">4. Responsabilité</h2>
          <p>
            Automédon s'efforce d'assurer la qualité de ses services mais ne peut garantir l'absence d'erreurs ou d'interruptions.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">5. Propriété Intellectuelle</h2>
          <p>
            Tous les contenus de la plateforme sont la propriété d'Automédon ou de ses partenaires.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-2">6. Droit Applicable et Litiges</h2>
          <p>
            Les présentes CGV sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents.
          </p>
          <p className="text-sm italic mt-8">
            Ces CGV sont un exemple et doivent être adaptées par un professionnel du droit.
          </p>
        </div>
        <Link to="/">
          <Button variant="outline" className="px-8 py-4 text-lg mt-8">Retour à l'accueil</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CGV;