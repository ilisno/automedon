import React from "react";
import { SheetDetails, Mission } from "@/context/MissionsContext";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { showSuccess, showError } from "@/utils/toast";

interface MissionSheetDisplayProps {
  mission: Mission;
  type: 'departure' | 'arrival';
  details: SheetDetails;
}

const MissionSheetDisplay: React.FC<MissionSheetDisplayProps> = ({ mission, type, details }) => {
  const sheetTitle = type === 'departure' ? 'Fiche de Départ' : 'Fiche d\'Arrivée';

  const handleExportPdf = async () => {
    const input = document.getElementById(`mission-sheet-${type}-${mission.id}`);
    if (!input) {
      showError("Impossible de générer le PDF. Élément non trouvé.");
      return;
    }

    try {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${type}_sheet_${mission.immatriculation}.pdf`);
      showSuccess("PDF généré avec succès !");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showError("Erreur lors de la génération du PDF.");
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{sheetTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div id={`mission-sheet-${type}-${mission.id}`} className="p-4"> {/* ID for PDF export */}
          <h3 className="text-lg font-bold mb-4 text-center">Fiche {type === 'departure' ? 'de Départ' : 'd\'Arrivée'} du Véhicule</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <p><strong>Date & Heure:</strong> {format(new Date(details.timestamp), "dd/MM/yyyy HH:mm")}</p>
            <p><strong>Immatriculation:</strong> {mission.immatriculation}</p>
            <p><strong>Modèle:</strong> {mission.modele}</p>
            <p><strong>Lieu {type === 'departure' ? 'de Départ' : 'd\'Arrivée'}:</strong> {type === 'departure' ? mission.lieu_depart : mission.lieu_arrivee}</p>
            <p><strong>Kilométrage:</strong> {details.mileage} km</p>
            <p><strong>Niveau de carburant:</strong> {details.fuel_level}</p>
            <p><strong>Propreté intérieure:</strong> {details.interior_cleanliness}</p>
            <p><strong>Propreté extérieure:</strong> {details.exterior_cleanliness}</p>
            <div className="col-span-2">
              <p><strong>État général:</strong> {details.general_condition}</p>
            </div>
          </div>

          {details.photos && details.photos.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Photos:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {details.photos.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`${sheetTitle} photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md shadow-sm"
                  />
                ))}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Signature Convoyeur:</p>
              <p className="border-b border-gray-300 dark:border-gray-600 pb-1 mt-2">{details.convoyeur_signature_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nom du convoyeur</p>
            </div>
            <div>
              <p className="font-semibold">Signature Client:</p>
              <p className="border-b border-gray-300 dark:border-gray-600 pb-1 mt-2">{details.client_signature_name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Nom du client</p>
            </div>
          </div>
        </div>
        <Button onClick={handleExportPdf} className="mt-4 w-full">
          Exporter en PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default MissionSheetDisplay;