import React, { useState } from "react";
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mission, MissionUpdate, Expense, useMissions } from "@/context/MissionsContext";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";
import { generatePdf } from "@/utils/pdfGenerator"; // Import PDF generator
import DepartureSheetDisplay from "@/components/pdf/DepartureSheetDisplay"; // Import display component
import ArrivalSheetDisplay from "@/components/pdf/ArrivalSheetDisplay"; // Import display component
import DepartureSheetForm from "./DepartureSheetForm"; // Import form for editing
import ArrivalSheetForm from "./ArrivalSheetForm"; // Import form for editing

interface MissionDetailDialogProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

// Define a union type for combined history items
type MissionHistoryItem = (MissionUpdate & { type: 'update' }) | (Expense & { type: 'expense' });

const MissionDetailDialog: React.FC<MissionDetailDialogProps> = ({
  mission,
  isOpen,
  onClose,
  userId,
}) => {
  const { addMissionUpdate, completeMission, useDepartureSheet, useArrivalSheet } = useMissions();
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingDepartureSheet, setIsEditingDepartureSheet] = useState(false); // NEW state for editing
  const [isEditingArrivalSheet, setIsEditingArrivalSheet] = useState(false); // NEW state for editing

  const { sheet: departureSheet, isLoading: isLoadingDepartureSheet } = useDepartureSheet(mission?.id);
  const { sheet: arrivalSheet, isLoading: isLoadingArrivalSheet } = useArrivalSheet(mission?.id);

  React.useEffect(() => {
    if (!isOpen) {
      setComment("");
      setPhotos(null);
      setIsSubmitting(false);
      setIsEditingDepartureSheet(false); // Reset edit state
      setIsEditingArrivalSheet(false); // Reset edit state
    }
  }, [isOpen]);

  const handleAddUpdate = async () => {
    if (!mission) return;
    setIsSubmitting(true);
    try {
      await addMissionUpdate(mission.id, comment, photos);
      showSuccess("Mise à jour ajoutée avec succès !");
      setComment("");
      setPhotos(null);
    } catch (error) {
      console.error("Error adding mission update:", error);
      showError("Erreur lors de l'ajout de la mise à jour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarquerCommeLivree = async () => {
    if (!mission) return;
    setIsSubmitting(true);
    try {
      await addMissionUpdate(mission.id, finalComment, finalPhotos); // Add final update before completing
      await completeMission(mission.id); // Complete mission without passing comment/photos again
      showSuccess("Mission marquée comme livrée !");
      onClose(); // Close dialog after completion
    } catch (error) {
      console.error("Error completing mission:", error);
      showError("Erreur lors de la finalisation de la mission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadDeparturePdf = async () => {
    if (!mission || !departureSheet) return;
    // Temporarily render the component to a hidden div to capture its content
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

    // Wait for the component to render
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to ensure render

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

  // Combine updates and expenses into a single chronological history
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
          <p>
            <strong>Rémunération Convoyeur:</strong>{" "}
            {mission.convoyeur_payout ? `${mission.convoyeur_payout.toFixed(2)} €` : "Non définie"}
          </p>

          {/* Section Fiche de Départ */}
          <div className="space-y-4 border-t pt-4 mt-4">
            <h3 className="text-xl font-semibold">Fiche de Départ</h3>
            {isLoadingDepartureSheet ? (
              <p>Chargement de la fiche de départ...</p>
            ) : departureSheet ? (
              <>
                {isEditingDepartureSheet ? (
                  <DepartureSheetForm 
                    missionId={mission.id} 
                    onSheetCreated={() => { 
                      setIsEditingDepartureSheet(false); 
                      showSuccess("Fiche de départ mise à jour !");
                    }} 
                    initialData={departureSheet} // Pass existing data
                  />
                ) : (
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
                      {mission.statut === 'en cours' && ( // Only allow edit if mission is in progress
                        <Button onClick={() => setIsEditingDepartureSheet(true)} variant="outline" className="flex-1">Modifier la Fiche</Button>
                      )}
                    </div>
                  </>
                )}
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
                {isEditingArrivalSheet ? (
                  <ArrivalSheetForm 
                    missionId={mission.id} 
                    onSheetCreated={() => { 
                      setIsEditingArrivalSheet(false); 
                      showSuccess("Fiche d'arrivée mise à jour !");
                    }} 
                    initialData={arrivalSheet} // Pass existing data
                  />
                ) : (
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
                      {mission.statut === 'en cours' && ( // Only allow edit if mission is in progress
                        <Button onClick={() => setIsEditingArrivalSheet(true)} variant="outline" className="flex-1">Modifier la Fiche</Button>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <p>Aucune fiche d'arrivée enregistrée pour cette mission.</p>
            )}
          </div>

          {/* Section pour ajouter une nouvelle mise à jour */}
          {mission.statut === 'en cours' && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-xl font-semibold">Ajouter une étape</h3>
              <div>
                <Label htmlFor="new-comment">Commentaire</Label>
                <Textarea
                  id="new-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ajouter un commentaire pour cette étape..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-photos">Photos</Label>
                <Input
                  id="new-photos"
                  type="file"
                  multiple
                  onChange={(e) => setPhotos(e.target.files)}
                  className="mt-1"
                />
                {photos && photos.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    Fichiers sélectionnés: {Array.from(photos).map(f => f.name).join(', ')}
                  </p>
                )}
              </div>
              <Button onClick={handleAddUpdate} disabled={isSubmitting || (!comment && (!photos || photos.length === 0))}>
                {isSubmitting ? "Ajout en cours..." : "Ajouter cette étape"}
              </Button>
              <Button onClick={handleMarquerCommeLivree} className="w-full bg-green-600 hover:bg-green-700 mt-4" disabled={isSubmitting}>
                {isSubmitting ? "Finalisation..." : "Marquer comme livrée"}
              </Button>
            </div>
          )}

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
                          <p className="text-sm text-gray-500 dark:text-gray-400">Justificatif:</p>
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

export default MissionDetailDialog;