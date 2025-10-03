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
            <td className="font-semibold p-2 text-left">Conditions Météo:</td>
            <td className="p-2 text-left">{sheet.weather_conditions || 'N/A'}</td>
          </tr>
          {/* NEW FIELDS DISPLAY */}
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Lieu d'enlèvement:</td>
            <td className="p-2 text-left">{sheet.pickup_location_type || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Carte SD ou CD/DVD:</td>
            <td className="p-2 text-left">{sheet.sd_card_cd_dvd || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Antenne:</td>
            <td className="p-2 text-left">{sheet.antenna || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Roue de secours / Kit anticrevaison:</td>
            <td className="p-2 text-left">{sheet.spare_tire_kit || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Kit de sécurité (Triangle / Gilet):</td>
            <td className="p-2 text-left">{sheet.safety_kit || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Nombre de clefs confiées:</td>
            <td className="p-2 text-left">{sheet.number_of_keys !== null ? sheet.number_of_keys : 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Tapis de sol avants:</td>
            <td className="p-2 text-left">{sheet.front_floor_mats || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Tapis de sol arrières:</td>
            <td className="p-2 text-left">{sheet.rear_floor_mats || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Carte grise (originale ou copie):</td>
            <td className="p-2 text-left">{sheet.registration_card || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Carte carburant:</td>
            <td className="p-2 text-left">{sheet.fuel_card || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Vignette crit'air:</td>
            <td className="p-2 text-left">{sheet.critair_sticker || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">Manuel d'utilisation du véhicule:</td>
            <td className="p-2 text-left">{sheet.user_manual || 'N/A'}</td>
          </tr>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <td className="font-semibold p-2 text-left">PV de livraison:</td>
            <td className="p-2 text-left">{sheet.delivery_report || 'N/A'}</td>
          </tr>
          {/* END NEW FIELDS DISPLAY */}
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
        Document généré par Automedon le {new Date().toLocaleDateString()}.
      </p>
    </div>
  );
};

export default ArrivalSheetDisplay;