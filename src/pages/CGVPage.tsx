import React from 'react';

const CGVPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 mt-8 mb-8">
        <div className="text-center mb-8">
          <img src="/automedon-logo.png" alt="Automédon Logo" className="mx-auto mb-4 h-20" /> {/* Assuming a logo exists or can be added */}
          <p className="text-sm text-gray-600">www.automedon.net Conditions Générales de Vente</p>
        </div>

        <h1 className="text-3xl font-bold text-center mb-6">Conditions Générales de Vente</h1>

        <p className="mb-4"><strong>AUTOMEDON est un service proposé par URUK SAS</strong></p>

        <h2 className="text-2xl font-bold mb-3">PRÉAMBULE</h2>
        <p className="mb-4">
          La prestation « convoyeur AUTOMEDON » consiste en la mise à disposition d'un « convoyeur qualifié » pour la conduite des véhicules de nos donneurs d'ordre depuis le lieu de prise en charge jusqu'au lieu de destination convenus lors de la commande de prestation.
        </p>
        <p className="mb-4">
          Les convoyages de véhicules peuvent être effectués entre l'île de France et toute région de France ou à l'étranger.
        </p>
        <p className="mb-4">
          Le terme « Donneur d'ordre » désigne le demandeur de la prestation, particulier ou association, agissant en tant que propriétaire (ou loueur) du véhicule.
        </p>
        <p className="mb-6">
          L'achat d'une prestation « AUTOMEDON » implique l'acceptation des conditions générales de ventes ci-après dont le Donneur d'ordre reconnaît avoir pris connaissance et en accepter le contenu sans réserve.
        </p>

        <h2 className="text-2xl font-bold mb-3">CAPACITÉ</h2>
        <p className="mb-4">
          Le Donneur d'ordre reconnaît avoir la capacité de contracter aux conditions décrites, c'est-à-dire être âgé d'au moins 18 ans, être capable juridiquement de contracter et ne pas être sous tutelle ou curatelle.
        </p>
        <p className="mb-6">
          Le Donneur d'ordre garantit la véracité des informations fournies à AUTOMEDON pour le calcul du devis préalable, sur l'état mécanique de son véhicule et de son attelage éventuel (caravane ou remorque).
        </p>

        <p className="mb-4">
          <strong>AVERTISSEMENT :</strong> Rappel des termes de l'article L313-1 du Code Pénal :
        </p>
        <p className="mb-6 italic">
          « L'escroquerie est le fait, soit par l'usage d'un faux nom ou d'une fausse qualité, soit par l'abus d'une qualité vraie, soit par l'emploi de manœuvres frauduleuses de tromper, une personne physique ou morale et de la déterminer ainsi, à son préjudice ou au préjudice d'un tiers, à remettre des fonds, des valeurs ou un bien quelconque, à fournir un service ou à consentir un acte opérant, à fournir obligation ou décharge. L'escroquerie est punie de cinq ans d'emprisonnement et de 375.000 € d'amende. »
        </p>

        <h2 className="text-2xl font-bold mb-3">1/ DISPOSITIONS ADMINISTRATIVES ET FINANCIÈRES</h2>
        <h3 className="text-xl font-semibold mb-3">1.1. Demande de prestation et devis préalable.</h3>

        <div className="mt-12 text-center text-sm text-gray-600">
          <p>URUK SAS</p>
          <p>SIRET : 97759264100012</p>
          <p>79 RUE D'ORADOUR 51000 CHALONS-EN-CHAMPAGNE, France,</p>
          <p>+33 6 50 78 84 87 <a href="mailto:contact@uruk.best" className="text-blue-500 hover:underline">contact@uruk.best</a></p>
        </div>
      </div>
    </div>
  );
};

export default CGVPage;