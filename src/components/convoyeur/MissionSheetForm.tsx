import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mission, SheetDetails, useMissions, Profile } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface MissionSheetFormProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
  type: 'departure' | 'arrival'; // 'departure' or 'arrival'
  convoyeurProfile: Profile | null;
  clientProfile: Profile | null;
}

const fuelLevels = ['Plein', '3/4', '1/2', '1/4', 'Vide'];
const cleanlinessOptions = ['Propre', 'Moyen', 'Sale'];

const MissionSheetForm: React.FC<MissionSheetFormProps> = ({
  mission,
  isOpen,
  onClose,
  type,
  convoyeurProfile,
  clientProfile,
}) => {
  const { saveDepartureDetails, saveArrivalDetails } = useMissions();
  const [mileage, setMileage] = useState<number | ''>('');
  const [fuelLevel, setFuelLevel] = useState<string>('');
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>('');
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>('');
  const [generalCondition, setGeneralCondition] = useState<string>('');
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>('');
  const [clientSignatureName, setClientSignatureName] = useState<string>('');
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mission) {
      const details = type === 'departure' ? mission.departure_details : mission.arrival_details;
      if (details) {
        setMileage(details.mileage || '');
        setFuelLevel(details.fuel_level || '');
        setInteriorCleanliness(details.interior_cleanliness || '');
        setExteriorCleanliness(details.exterior_cleanliness || '');
        setGeneralCondition(details.general_condition || '');
        setConvoyeurSignatureName(details.convoyeur_signature_name || '');
        setClientSignatureName(details.client_signature_name || '');
        // Photos are not pre-filled as FileList, only URLs are stored
      } else {
        // Reset form if no existing details
        setMileage('');
        setFuelLevel('');
        setInteriorCleanliness('');
        setExteriorCleanliness('');
        setGeneralCondition('');
        setConvoyeurSignatureName(convoyeurProfile ? `${convoyeurProfile.first_name || ''} ${convoyeurProfile.last_name || ''}`.trim() : '');
        setClientSignatureName(clientProfile ? `${clientProfile.first_name || ''} ${clientProfile.last_name || ''}`.trim() : '');
      }
      setPhotos(null);
      setIsSubmitting(false);
    }
  }, [isOpen, mission, type, convoyeurProfile, clientProfile]);

  const handleSubmit = async () => {
    if (!mission) return;
    if (mileage === '' || !fuelLevel || !interiorCleanliness || !exteriorCleanliness || !generalCondition || !convoyeurSignatureName || !clientSignatureName) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    const details: Omit<SheetDetails, 'photos'> = {
      timestamp: new Date().toISOString(), // Will be overwritten by context function
      mileage: Number(mileage),
      fuel_level: fuelLevel,
      interior_cleanliness: interiorCleanliness,
      exterior_cleanliness: exteriorCleanliness,
      general_condition: generalCondition,
      convoyeur_signature_name: convoyeurSignatureName,
      client_signature_name: clientSignatureName,
    };

    try {
      if (type === 'departure') {
        await saveDepartureDetails(mission.id, details, photos);
        showSuccess("Fiche de départ enregistrée avec succès !");
      } else {
        await saveArrivalDetails(mission.id, details, photos);
        showSuccess("Fiche d'arrivée enregistrée avec succès !");
      }
      onClose();
    } catch (error) {
      console.error(`Error saving ${type} details:`, error);
      showError(`Erreur lors de l'enregistrement de la fiche de ${type}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type === 'departure' ? 'Fiche de Départ' : 'Fiche d\'Arrivée'}</DialogTitle>
          <DialogDescription>
            Mission: {mission.modele} ({mission.immatriculation}) - De {mission.lieu_depart} à {mission.lieu_arrivee}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timestamp" className="text-right">
              Date & Heure
            </Label>
            <Input
              id="timestamp"
              value={format(new Date(), "dd/MM/yyyy HH:mm")}
              disabled
              className="col-span-3 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mileage" className="text-right">
              Kilométrage
            </Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(Number(e.target.value))}
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fuelLevel" className="text-right">
              Niveau de carburant
            </Label>
            <Select value={fuelLevel} onValueChange={setFuelLevel} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez le niveau" />
              </SelectTrigger>
              <SelectContent>
                {fuelLevels.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="interiorCleanliness" className="text-right">
              Propreté intérieure
            </Label>
            <Select value={interiorCleanliness} onValueChange={setInteriorCleanliness} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez la propreté" />
              </SelectTrigger>
              <SelectContent>
                {cleanlinessOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exteriorCleanliness" className="text-right">
              Propreté extérieure
            </Label>
            <Select value={exteriorCleanliness} onValueChange={setExteriorCleanliness} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Sélectionnez la propreté" />
              </SelectTrigger>
              <SelectContent>
                {cleanlinessOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="generalCondition" className="text-right">
              État général
            </Label>
            <Textarea
              id="generalCondition"
              value={generalCondition}
              onChange={(e) => setGeneralCondition(e.target.value)}
              placeholder="Décrivez l'état général du véhicule (rayures, bosses, etc.)"
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="photos" className="text-right">
              Photos
            </Label>
            <Input
              id="photos"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setPhotos(e.target.files)}
              className="col-span-3"
            />
            {photos && photos.length > 0 && (
              <p className="col-span-4 text-sm text-gray-500 mt-1 text-center">
                Fichiers sélectionnés: {Array.from(photos).map(f => f.name).join(', ')}
              </p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="convoyeurSignatureName" className="text-right">
              Signature Convoyeur
            </Label>
            <Input
              id="convoyeurSignatureName"
              type="text"
              value={convoyeurSignatureName}
              onChange={(e) => setConvoyeurSignatureName(e.target.value)}
              placeholder="Nom du convoyeur"
              required
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientSignatureName" className="text-right">
              Signature Client
            </Label>
            <Input
              id="clientSignatureName"
              type="text"
              value={clientSignatureName}
              onChange={(e) => setClientSignatureName(e.target.value)}
              placeholder="Nom du client"
              required
              className="col-span-3"
            />
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : `Enregistrer la fiche de ${type === 'departure' ? 'départ' : 'arrivée'}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MissionSheetForm;