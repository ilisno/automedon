import React from "react";
import { ArrivalSheet } from "@/context/MissionsContext";

interface ArrivalSheetDisplayProps {
  sheet: ArrivalSheet;
  missionDetails: {
    immatriculation: string;
    modele: string;
    lieu_depart: string;
    lieu_arrivee: string;
  };
}

const ArrivalSheetDisplay: React.FC<ArrivalSheetDisplayProps> = ({ sheet, missionDetails }) => {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md print-area" id="arrival-sheet-pdf">
      <h2 className="text-2xl font-bold text-center mb-6">Fiche d'Arrivée</h2>
      <div className="mb-4 text-center">
        <p className="text-lg font-semibold">{missionDetails.modele} ({missionDetails.immatriculation})</p>
        <p className="text-md text-gray-600 dark:text-gray-400">De: {missionDetails.lieu_depart} à {missionDetails.lieu_arrivee}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Date de création:</p>
          <p>{new Date(sheet.created_at).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">Kilométrage à l'arrivée:</p>
          <p>{sheet.mileage} km</p>
        </div>
        <div>
          <p className="font-semibold">Niveau de carburant:</p>
          <p>{sheet.fuel_level} / 8</p>
        </div>
        <div>
          <p className="font-semibold">Propreté intérieure:</p>
          <p>{sheet.interior_cleanliness} / 8</p>
        </div>
        <div>
          <p className="font-semibold">Propreté extérieure:</p>
          <p>{sheet.exterior_cleanliness} / 8</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold">État général du véhicule:</p>
        <p className="whitespace-pre-wrap">{sheet.general_condition}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Signature Convoyeur:</p>
          <p className="border-b border-gray-300 pb-1">{sheet.convoyeur_signature_name}</p>
        </div>
        <div>
          <p className="font-semibold">Signature Client:</p>
          <p className="border-b border-gray-300 pb-1">{sheet.client_signature_name}</p>
        </div>
      </div>

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