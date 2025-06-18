import React, { useState } from "react";
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
import { Mission, MissionUpdate, useMissions } from "@/context/MissionsContext";
import { format } from "date-fns";
import { showSuccess, showError } from "@/utils/toast";

interface MissionDetailDialogProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const MissionDetailDialog: React.FC<MissionDetailDialogProps> = ({
  mission,
  isOpen,
  onClose,
  userId,
}) => {
  const { addMissionUpdate, completeMission } = useMissions();
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setComment("");
      setPhotos(null);
      setIsSubmitting(false);
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
      await completeMission(mission.id, comment, photos);
      showSuccess("Mission marquée comme livrée !");
      onClose(); // Close dialog after completion
    } catch (error) {
      console.error("Error completing mission:", error);
      showError("Erreur lors de la finalisation de la mission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mission) return null;

  const sortedUpdates = mission.updates
    ? [...mission.updates].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

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
            <strong>Prix:</strong>{" "}
            {mission.price ? `${mission.price.toFixed(2)} €` : "Prix non fixé"}
          </p>

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

          {/* Historique des mises à jour */}
          {sortedUpdates.length > 0 && (
            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="text-xl font-semibold">Historique des étapes</h3>
              {sortedUpdates.map((update, index) => (
                <div key={index} className="border p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {format(new Date(update.timestamp), "dd/MM/yyyy HH:mm")}
                  </p>
                  {update.comment && <p className="mb-2">{update.comment}</p>}
                  {update.photos && update.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {update.photos.map((photoUrl, photoIndex) => (
                        <img
                          key={photoIndex}
                          src={photoUrl}
                          alt={`Mission update photo ${photoIndex + 1}`}
                          className="w-24 h-24 object-cover rounded-md shadow-sm"
                        />
                      ))}
                    </div>
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