import React from "react";
import { ArrivalSheet, Profile } from "@/context/MissionsContext";

interface ArrivalSheetDisplayProps {
  sheet: ArrivalSheet;
  missionDetails: {
    immatriculation: string;
    modele: string;
    lieu_depart: string;
    lieu_arrivee: string;
  };
  clientProfile: Profile | null;
  convoyeurProfile: Profile | null;
}

const ArrivalSheetDisplay: React.FC<ArrivalSheetDisplayProps> = ({ sheet, missionDetails, clientProfile, convoyeurProfile }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md print-area" id="arrival-sheet-pdf">
      <h2 className="text-2xl font-bold text-center mb-6">Fiche d'Arrivée</h2>
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">{missionDetails.modele} ({missionDetails.immatriculation})</p>
        <p className="text-md text-gray-600 dark:text-gray-400">De: {missionDetails.lieu_depart} à {missionDetails.lieu_arrivee}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {clientProfile && (
          <div className="border p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2">Informations Client</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="font-semibold pr-2">Nom:</td><td>{clientProfile.last_name || 'N/A'}</td></tr>
                <tr><td className="font-semibold pr-2">Prénom:</td><td>{clientProfile.first_name || 'N/A'}</td></tr>
                <tr><td className="font-semibold pr-2">Société:</td><td>{clientProfile.company_type || 'N/A'}</td></tr>
                <tr><td className="font-semibold pr-2">N° téléphone:</td><td>{clientProfile.phone || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
        {convoyeurProfile && (
          <div className="border p-4 rounded-md">
            <h3 className="font-bold text-lg mb-2">Informations Convoyeur</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr><td className="font-semibold pr-2">Nom:</td><td>{convoyeurProfile.last_name || 'N/A'}</td></tr>
                <tr><td className="font-semibold pr-2">Prénom:</td><td>{convoyeurProfile.first_name || 'N/A'}</td></tr>
                <tr><td className="font-semibold pr-2">N° téléphone:</td><td>{convoyeurProfile.phone || 'N/A'}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <table className="w-full border-collapse mb-6">
        <tbody>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left w-1/2">Date de création:</td>
            <td className="p-2 text-left w-1/2">{new Date(sheet.created_at).toLocaleString()}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Kilométrage à l'arrivée:</td>
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
          <p className="font-semibold mb-2">Photos à l'arrivée:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {sheet.photos.map((photoUrl, index) => (
              <img
                key={index}
                src={photoUrl}
                alt={`Photo d'arrivée ${index + 1}`}
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

export default ArrivalSheetDisplay;