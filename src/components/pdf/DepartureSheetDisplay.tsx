import React from "react";
import { DepartureSheet } from "@/context/MissionsContext";

interface DepartureSheetDisplayProps {
  sheet: DepartureSheet;
  missionDetails: {
    immatriculation: string;
    modele: string;
    lieu_depart: string;
    lieu_arrivee: string;
  };
}

const DepartureSheetDisplay: React.FC<DepartureSheetDisplayProps> = ({ sheet, missionDetails }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md print-area" id="departure-sheet-pdf">
      <h2 className="text-2xl font-bold text-center mb-6">Fiche de Départ</h2>
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">{missionDetails.modele} ({missionDetails.immatriculation})</p>
        <p className="text-md text-gray-600 dark:text-gray-400">De: {missionDetails.lieu_depart} à {missionDetails.lieu_arrivee}</p>
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