import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CGU = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Conditions Générales d'Utilisation (CGU) d’Automedon</h1>
        <div className="text-left max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
          <p className="font-bold">Date de dernière mise à jour : 01/10/2025</p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 1 : Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (ci-après les « <strong>CGU</strong> ») ont pour objet de définir les règles et modalités d'utilisation
            de la plateforme de convoyage automobile Automedon.net (ci-après la « <strong>Plateforme</strong> »), accessible via le site web
            <a href="https://automedon.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> https://automedon.vercel.app/</a> et l'application mobile, éditée par la société URUK SAS, immatriculée au RCS de Châlons-en-Champagne sous le numéro 977 592 641, dont le siège social est situé au 79 rue d’Oradour, 51000 Châlons-en-Champagne (ci-après « <strong>Automedon</strong> »).
          </p>
          <p>
            En accédant et en utilisant la Plateforme, tout utilisateur (ci-après l'« <strong>Utilisateur</strong> ») accepte sans réserve l'intégralité des présentes
            CGU.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 2 : Définitions</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Plateforme :</strong> Désigne l'ensemble des services et fonctionnalités offerts par Automedon via le site web et/ou l'application mobile Automedon.</li>
            <li><strong>Utilisateur :</strong> Toute personne physique ou morale qui accède et utilise la Plateforme.</li>
            <li><strong>Client :</strong> Utilisateur qui sollicite, via la Plateforme, les services de convoyage d'un véhicule.</li>
            <li><strong>Convoyeur :</strong> Utilisateur professionnel, partenaire d’Automedon, qui exécute les prestations convoyage de véhicules via la Plateforme.</li>
            <li><strong>Service :</strong> Désigne la mise en relation entre un Client et un Convoyeur pour l'exécution d'une prestation de convoyage automobile.</li>
            <li><strong>Commande :</strong> Contrat de prestation de service conclu directement entre un Client et Automedon à la suite de leur mise en relation via la Plateforme.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 3 : Description des Services</h2>
          <p>La Plateforme Automedon est un service de mise en relation qui permet :</p>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Aux Clients de déposer une annonce de convoyage pour un véhicule, en précisant les caractéristiques du véhicule, le lieu de prise en charge, le lieu de livraison, et les dates souhaitées.</li>
            <li>Aux Convoyeurs professionnels partenaires de consulter les annonces et de soumettre leurs profils pour les missions qui les intéressent.</li>
            <li>À Automedon de choisir un convoyeur sur la base des profils présentés et des missions à réaliser.</li>
          </ol>
          <p>
            Le contrat de convoyage est conclu directement et uniquement entre Automedon et le client. Automedon fait partie intégrante au
            contrat de transport et endosse la qualité de transporteur. Il est ainsi tenu par une obligation de moyens lui nécessitant de fournir
            tous les efforts nécessaires pour faciliter la réalisation du contrat de convoyage entre le client et le convoyeur. Toutefois
            Automedon se réserve le droit de contester sa responsabilité, si le client ou le convoyeur ne respectait pas le cahier des charges
            (ex : véhicule non conforme à la législation, non-respect du code de la route par le convoyeur… liste non exhaustive).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 4 : Inscription et Compte Utilisateur</h2>
          <p>
            L'utilisation de certains Services, notamment la passation et la réception de commandes, nécessite la création d'un compte personnel.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour.</li>
            <li>L'accès au compte se fait à l'aide d'un identifiant et d'un mot de passe, qui sont confidentiels. L'Utilisateur est responsable de leur conservation.</li>
            <li>L'Utilisateur est responsable de toutes les activités effectuées à partir de son compte. Il s'engage à informer immédiatement l'Éditeur en cas d'utilisation non autorisée.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 5 : Obligations des Utilisateurs</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">5.1. Obligations du Client :</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Fournir une description précise et complète du véhicule à convoyer (marque, modèle, état, dimensions, présence d'options particulières, etc.).</li>
            <li>S'assurer que le véhicule est en état de marche, assuré et en conformité avec la réglementation.</li>
            <li>Préparer le véhicule pour le transport (vidange partielle du réservoir, désactivation des alarmes, remise des doubles de clés, etc.).</li>
            <li>Être présent ou se faire représenter aux lieux et heures convenus pour la remise et la réception du véhicule.</li>
            <li>Régler Automedon conformément aux conditions financières convenues dans le devis.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-4 mb-2">5.2. Obligations du Convoyeur :</h3>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Justifier de tous les documents légaux requis pour exercer l'activité de convoyeur (licence de transport, assurance professionnelle spécifique au convoyage, etc.).</li>
            <li>Exécuter la prestation avec professionnalisme, diligence et dans le respect des règles de sécurité comme de la charte d’engagement conducteur.</li>
            <li>Présenter les justificatifs originaux de paiement pour les frais engendrés dans le cadre des missions de convoyage en vue des remboursements (péage, au carburant, à la restauration, l’hébergement, etc…).</li>
            <li>Assurer la sécurité et l'intégrité du véhicule tout au long du transport.</li>
            <li>Souscrire une assurance responsabilité civile professionnelle couvrant les dommages éventuels causés au véhicule durant le transport.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 6 : Processus de Commande et Responsabilités</h2>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            <li>Le Client dépose une annonce.</li>
            <li>Les Convoyeurs soumettent leurs profils et Automedon désigne un convoyeur pour la mission.</li>
            <li>Le Client valide le tarif proposé et accepte la commande.</li>
            <li>Un contrat est formé directement entre le Client et Automedon.</li>
            <li>Automedon s’assure du bon fonctionnement technique de la Plateforme de mise en relation.</li>
            <li>Automedon est responsable des actes, omissions, retards, ou dommages causés par un Convoyeur, ou des litiges nés entre un Client et un Convoyeur concernant l'exécution de la prestation (retard, dégât, litige financier, etc.). Dans le cadre du cahier des charges sinon Automedon se réserve le droit de contester sa responsabilité.</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 7 : Tarifs, Paiement et Facturation</h2>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Les prix des prestations sont librement fixés par Automedon et indiqués dans devis (prix HT et TTC).</li>
            <li>Le paiement de la prestation s'effectue directement entre le Client et l’éditeur Automedon, selon les modalités convenues entre eux (virement, chèque, etc.). La Plateforme peut proposer un service de paiement sécurisé intégré.</li>
            <li>La facture pour la prestation de convoyage est établie et délivrée par Automedon sur la base du devis accepté en amont par le client.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 8 : Propriété intellectuelle</h2>
          <p>
            La structure, le contenu (textes, graphismes, images, logos) et les fonctionnalités de la Plateforme sont la propriété exclusive
            d’<strong>Automedon</strong> et sont protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est
            strictement interdite.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 9 : Données personnelles</h2>
          <p>
            Les données personnelles collectées sur la Plateforme sont traitées conformément à notre <Link to="/politique-de-confidentialite" className="text-blue-500 hover:underline">Politique de Confidentialité</Link>, accessible
            depuis la Plateforme, et en accord avec le Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 10 : Modification des CGU</h2>
          <p>
            Automedon se réserve le droit de modifier à tout moment les présentes CGU. Les Utilisateurs seront informés des modifications
            par tout moyen utile (email, notification sur la Plateforme). Les nouvelles CGU s'appliqueront dès leur mise en ligne. En cas de
            désaccord, l'Utilisateur doit cesser d'utiliser la Plateforme.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 11 : Durée et Résiliation</h2>
          <p>
            Les présentes CGU sont conclues pour une durée indéterminée. L'Utilisateur peut résilier son compte à tout moment. Automedon
            se réserve le droit de suspendre ou résilier l'accès d'un Utilisateur en cas de manquement aux présentes CGU.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Article 12 : Litiges et Droit applicable</h2>
          <p>
            Les présentes CGU sont régies par le droit français. En cas de litige, et après une tentative de résolution amiable, les tribunaux
            compétents seront ceux du lieu du siège social de l'Éditeur.
          </p>

          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p><strong>URUK SAS</strong></p>
            <p><strong>SIRET :</strong> 97759264100012</p>
            <p>79 RUE D'ORADOUR 51000 CHÂLONS-EN-CHAMPAGNE, France</p>
            <p><strong>Téléphone :</strong> +33 6 50 78 84 87</p>
            <p><strong>Email :</strong> <a href="mailto:contact@uruk.best" className="text-blue-500 hover:underline">contact@uruk.best</a></p>
          </div>
        </div>
        <Link to="/">
          <Button variant="outline" className="px-8 py-4 text-lg mt-8">Retour à l'accueil</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default CGU;