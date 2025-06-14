import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="text-lg mb-8 max-w-prose">
          Pour toute question, suggestion ou demande de partenariat, n'hésitez pas à nous contacter.
          Nous sommes là pour vous aider !
        </p>
        <div className="space-y-4">
          <p className="text-md">Email: <a href="mailto:contact@automedon.com" className="text-blue-500 hover:underline">contact@automedon.com</a></p>
          <p className="text-md">Téléphone: +33 1 23 45 67 89</p>
          <Link to="/">
            <Button variant="outline" className="px-8 py-4 text-lg mt-4">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;