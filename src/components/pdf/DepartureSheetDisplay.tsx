import React from "react";
import { DepartureSheet, PartyDetails } from "@/context/MissionsContext";

interface DepartureSheetDisplayProps {
  sheet: DepartureSheet;
  missionDetails: {
    immatriculation: string;
    modele: string;
    lieu_depart: string;
    lieu_arrivee: string;
  };
  clientDetails: PartyDetails;
  convoyeurDetails: PartyDetails;
}

const DepartureSheetDisplay: React.FC<DepartureSheetDisplayProps> = ({ sheet, missionDetails, clientDetails, convoyeurDetails }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md print-area" id="departure-sheet-pdf">
      <h2 className="text-2xl font-bold text-center mb-6">Fiche de Départ</h2>
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">{missionDetails.modele} ({missionDetails.immatriculation})</p>
        <p className="text-md text-gray-600 dark:text-gray-400">De: {missionDetails.lieu_depart} à {missionDetails.lieu_arrivee}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client Details */}
        <div className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-3">Détails Client</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-semibold p-1 text-left">Nom:</td>
                <td className="p-1 text-left">{clientDetails.lastName || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-semibold p-1 text-left">Prénom:</td>
                <td className="p-1 text-left">{clientDetails.firstName || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-semibold p-1 text-left">Société:</td>
                <td className="p-1 text-left">{clientDetails.companyType || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-semibold p-1 text-left">N° téléphone:</td>
                <td className="p-1 text-left">{clientDetails.phone || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Convoyeur Details */}
        <div className="border p-4 rounded-md">
          <h3 className="text-xl font-semibold mb-3">Détails Convoyeur</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-semibold p-1 text-left">Nom:</td>
                <td className="p-1 text-left">{convoyeurDetails.lastName || 'N/A'}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-semibold p-1 text-left">Prénom:</td>
                <td className="p-1 text-left">{convoyeurDetails.firstName || 'N/A'}</td>
              </tr>
              <tr>
                <td className="font-semibold p-1 text-left">N° téléphone:</td>
                <td className="p-1 text-left">{convoyeurDetails.phone || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table className="w-full border-collapse mb-6">
        <tbody>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left w-1/2">Date de création:</td>
            <td className="p-2 text-left w-1/2">{new Date(sheet.created_at).toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Kilométrage au départ:</td>
            <td className="p-2 text-left">{sheet.mileage} km</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Niveau de carburant:</td>
            <td className="p-2 text-left">{sheet.fuel_level} / 8</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Propreté intérieure:</td>
            <td className="p-2 text-left">{sheet.interior_cleanliness} / 8</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Propreté extérieure:</td>
            <td className="p-2 text-left">{sheet.exterior_cleanliness} / 8</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">État général du véhicule:</td>
            <td className="p-2 text-left whitespace-pre-wrap">{sheet.general_condition}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Signature Convoyeur:</td>
            <td className="p-2 text-left">{sheet.convoyeur_signature_name}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Signature Client:</td>
            <td className="p-2 text-left">{sheet.client_signature_name}</td>
          </tr>
        </tbody>
      </table>

      {sheet.photos && sheet.photos.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Photos au départ:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sheet.photos.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`Photo de départ ${index + 1}`}
                className="w-full h-32 object-cover rounded-md shadow-sm"
              />
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-8">
        Document généré par Automédon le {new Date().toLocaleDateString()}.
      </p>
    </div>
  );
};

export default DepartureSheetDisplay;