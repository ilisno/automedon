import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Presentation = () => {
  const handleDownload = () => {
    const pdfFileName = "automedon presentation officielle 062025.pdf"; // Nom de fichier corrigé
    const pdfUrl = `/${pdfFileName}`; // Chemin correct pour les fichiers dans le répertoire public
    
    console.log("Tentative de téléchargement du PDF depuis :", pdfUrl); // Log l'URL pour le débogage

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', pdfFileName); // Utilise le nom du fichier pour l'attribut de téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Présentation Automedon</h1>
        <p className="text-lg mb-8 max-w-prose">
          Découvrez Automedon, notre vision, nos services et comment nous révolutionnons le convoyage de véhicules.
        </p>
        <Button onClick={handleDownload} className="px-8 py-4 text-lg">
          Télécharger la présentation (PDF)
        </Button>
        <div className="mt-8">
          <Link to="/">
            <Button variant="outline" className="px-8 py-4 text-lg">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Presentation;