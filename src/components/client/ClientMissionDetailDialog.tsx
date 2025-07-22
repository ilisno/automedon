import React from "react";
import ReactDOM from 'react-dom/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mission, MissionUpdate, Expense, useMissions } from "@/context/MissionsContext";
import { format } from "date-fns";
import { generatePdf } from "@/utils/pdfGenerator";
import DepartureSheetDisplay from "@/components/pdf/DepartureSheetDisplay";
import ArrivalSheetDisplay from "@/components/pdf/ArrivalSheetDisplay";

interface ClientMissionDetailDialogProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

type MissionHistoryItem = (MissionUpdate & { type: 'update' }) | (Expense & { type: 'expense' });

const ClientMissionDetailDialog: React.FC<ClientMissionDetailDialogProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  const { useDepartureSheet, useArrivalSheet } = useMissions();

  const { sheet: departureSheet, isLoading: isLoadingDepartureSheet } = useDepartureSheet(mission?.id);
  const { sheet: arrivalSheet, isLoading: isLoadingArrivalSheet } = useArrivalSheet(mission?.id);

  const handleDownloadDeparturePdf = async () => {
    if (!mission || !departureSheet) return;
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    const root = ReactDOM.createRoot(tempDiv);
    root.render(
      <DepartureSheetDisplay 
        sheet={departureSheet} 
        missionDetails={{ 
          immatriculation: mission.immatriculation, 
          modele: mission.modele, 
          lieu_depart: mission.lieu_depart, 
          lieu_arrivee: mission.lieu_arrivee 
        }} 
      />
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    await generatePdf(tempDiv.children[0].id, `fiche_depart_${mission.immatriculation}.pdf`);
    
    root.unmount();
    document.body.removeChild(tempDiv);
  };

  const handleDownloadArrivalPdf = async () => {
    if (!mission || !arrivalSheet) return;
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    const root = ReactDOM.createRoot(tempDiv);
    root.render(
      <ArrivalSheetDisplay 
        sheet={arrivalSheet} 
        missionDetails={{ 
          immatriculation: mission.immatriculation, 
          modele: mission.modele, 
          lieu_depart: mission.lieu_depart, 
          lieu_arrivee: mission.lieu_arrivee 
        }} 
      />
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    await generatePdf(tempDiv.children[0].id, `fiche_arrivee_${mission.immatriculation}.pdf`);
    
    root.unmount();
    document.body.removeChild(tempDiv);
  };

  if (!mission) return null;

  const combinedHistory: MissionHistoryItem[] = [];
  if (mission.updates) {
    mission.updates.forEach(update => combinedHistory.push({ ...update, type: 'update' }));
  }
  if (mission.expenses) {
    mission.expenses.forEach(expense => combinedHistory.push({ ...expense, type: 'expense' }));
  }
  const sortedHistory = combinedHistory.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Détails de la Mission</DialogTitle>
          <DialogDescription>
            {mission.modele} ({mission.immatriculation}) - De {mission.lieu_depart} à {mission.lieu_arrivee}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p><strong>Statut:</strong> <span className={`font-medium ${
            mission.statut === 'Disponible' ? 'text-blue-600 dark:text-blue-400' :
            mission.statut === 'en attente' ? 'text-yellow-600 dark:text-yellow-400' :
            mission.statut === 'en cours' ? 'text-orange-600 dark:text-orange-400' :
            'text-green-600 dark:text-green-400'
          }`}>{mission.statut}</span></p>
          <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
          {mission.convoyeur_first_name && mission.convoyeur_last_name && (
            <p><strong>Convoyeur:</strong> {mission.convoyeur_first_name} {mission.convoyeur_last_name}</p>
          )}
          {mission.client_price && <p><strong>Prix Client:</strong> {mission.client_price.toFixed(2)} €</p>}

          {/* Section Fiche de Départ */}
          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-xl font-semibold">Fiche de Départ</h3>
            {isLoadingDepartureSheet ? (
              <p>Chargement de la fiche de départ...</p>
            ) : departureSheet ? (
              <>
                <DepartureSheetDisplay 
                  sheet={departureSheet} 
                  missionDetails={{ 
                    immatriculation: mission.immatriculation, 
                    modele: mission.modele, 
                    lieu_depart: mission.lieu_depart, 
                    lieu_arrivee: mission.lieu_arrivee 
                  }} 
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleDownloadDeparturePdf} className="flex-1">Télécharger PDF</Button>
                </div>
              </>
            ) : (
              <p>Aucune fiche de départ enregistrée pour cette mission.</p>
            )}
          </div>

          {/* Section Fiche d'Arrivée */}
          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-xl font-semibold">Fiche d'Arrivée</h3>
            {isLoadingArrivalSheet ? (
              <p>Chargement de la fiche d'arrivée...</p>
            ) : arrivalSheet ? (
              <>
                <ArrivalSheetDisplay 
                  sheet={arrivalSheet} 
                  missionDetails={{ 
                    immatriculation: mission.immatriculation, 
                    modele: mission.modele, 
                    lieu_depart: mission.lieu_depart, 
                    lieu_arrivee: mission.lieu_arrivee 
                  }} 
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleDownloadArrivalPdf} className="flex-1">Télécharger PDF</Button>
                </div>
              </>
            ) : (
              <p>Aucune fiche d'arrivée enregistrée pour cette mission.</p>
            )}
          </div>

          {/* Historique unifié des mises à jour et des frais */}
          {sortedHistory.length > 0 && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-xl font-semibold">Historique de la Mission</h3>
              {sortedHistory.map((item, index) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {format(new Date(item.timestamp), "dd/MM/yyyy HH:mm")}
                  </p>
                  {item.type === 'update' ? (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Mise à jour:</p>
                      {item.comment && <p className="mb-2">{item.comment}</p>}
                      {item.photos && item.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.photos.map((photoUrl, photoIndex) => (
                            <img
                              key={photoIndex}
                              src={photoUrl}
                              alt={`Mission update photo ${photoIndex + 1}`}
                              className="w-24 h-24 object-cover rounded-md shadow-sm"
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">Frais ({item.type}):</p>
                      <p><strong>Montant:</strong> {item.amount.toFixed(2)} €</p>
                      {item.description && <p><strong>Description:</strong> {item.description}</p>}
                      {item.photo_url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Preuve:</p>
                          <img
                            src={item.photo_url}
                            alt={`Expense photo for ${item.type}`}
                            className="w-32 h-32 object-cover rounded-md shadow-sm mt-1"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientMissionDetailDialog;