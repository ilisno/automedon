import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, ArrivalSheet } from "@/context/MissionsContext";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client"; // Import supabase

interface ArrivalSheetFormProps {
  missionId: string;
  onSheetCreated: () => void;
  initialData?: ArrivalSheet; // NEW: Optional prop for initial data
}

const ArrivalSheetForm: React.FC<ArrivalSheetFormProps> = ({ missionId, onSheetCreated, initialData }) => {
  const { createArrivalSheet, updateMission } = useMissions(); // Add updateMission
  const [mileage, setMileage] = useState<string>("");
  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>("");
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>("");
  const [generalCondition, setGeneralCondition] = useState<string>("");
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>("");
  const [clientSignatureName, setClientSignatureName] = useState<string>("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMileage(initialData.mileage.toString());
      setFuelLevel(initialData.fuel_level.toString());
      setInteriorCleanliness(initialData.interior_cleanliness.toString());
      setExteriorCleanliness(initialData.exterior_cleanliness.toString());
      setGeneralCondition(initialData.general_condition);
      setConvoyeurSignatureName(initialData.convoyeur_signature_name);
      setClientSignatureName(initialData.client_signature_name);
      // Note: Photos are not pre-filled for security/complexity reasons, user re-uploads if needed
    } else {
      // Reset form if no initial data (for new sheet creation)
      setMileage("");
      setFuelLevel("");
      setInteriorCleanliness("");
      setExteriorCleanliness("");
      setGeneralCondition("");
      setConvoyeurSignatureName("");
      setClientSignatureName("");
      setPhotos(null);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedMileage = parseFloat(mileage);
    const parsedFuelLevel = parseInt(fuelLevel);
    const parsedInteriorCleanliness = parseInt(interiorCleanliness);
    const parsedExteriorCleanliness = parseInt(exteriorCleanliness);

    if (
      isNaN(parsedMileage) ||
      isNaN(parsedFuelLevel) || parsedFuelLevel < 1 || parsedFuelLevel > 8 ||
      isNaN(parsedInteriorCleanliness) || parsedInteriorCleanliness < 1 || parsedInteriorCleanliness > 8 ||
      isNaN(parsedExteriorCleanliness) || parsedExteriorCleanliness < 1 || parsedExteriorCleanliness > 8 ||
      !generalCondition ||
      !convoyeurSignatureName ||
      !clientSignatureName
    ) {
      showError("Veuillez remplir tous les champs obligatoires avec des valeurs valides (notes entre 1 et 8).");
      return;
    }

    setIsSubmitting(true);
    try {
      const sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'> = {
        mileage: parsedMileage,
        fuel_level: parsedFuelLevel,
        interior_cleanliness: parsedInteriorCleanliness,
        exterior_cleanliness: parsedExteriorCleanliness,
        general_condition: generalCondition,
        convoyeur_signature_name: convoyeurSignatureName,
        client_signature_name: clientSignatureName,
      };

      if (initialData) {
        // Update existing sheet
        let photoUrls = initialData.photos;
        if (photos && photos.length > 0) {
          photoUrls = await useMissions().uploadSheetPhotos(missionId, 'arrival', photos);
        }
        const { error } = await supabase.from('arrival_sheets').update({ ...sheetData, photos: photoUrls }).eq('id', initialData.id);
        if (error) throw error;
        showSuccess("Fiche d'arrivée mise à jour avec succès !");
      } else {
        // Create new sheet
        await createArrivalSheet(missionId, sheetData, photos);
      }
      onSheetCreated(); // Callback to notify parent component
    } catch (error) {
      console.error("Error processing arrival sheet:", error);
      showError("Erreur lors de l'enregistrement de la fiche d'arrivée.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-xl font-semibold mb-4">{initialData ? "Modifier la Fiche d'Arrivée" : "Fiche d'Arrivée"}</h3>
      <div>
        <Label htmlFor="mileage">Kilométrage à l'arrivée</Label>
        <Input id="mileage" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="fuelLevel">Niveau de carburant (1-8)</Label>
        <Input 
          id="fuelLevel" 
          type="number" 
          min="1" 
          max="8" 
          value={fuelLevel} 
          onChange={(e) => setFuelLevel(e.target.value)} 
          required 
          className="mt-1" 
        />
      </div>
      <div>
        <Label htmlFor="interiorCleanliness">Propreté intérieure (1-8)</Label>
        <Input 
          id="interiorCleanliness" 
          type="number" 
          min="1" 
          max="8" 
          value={interiorCleanliness} 
          onChange={(e) => setInteriorCleanliness(e.target.value)} 
          required 
          className="mt-1" 
        />
      </div>
      <div>
        <Label htmlFor="exteriorCleanliness">Propreté extérieure (1-8)</Label>
        <Input 
          id="exteriorCleanliness" 
          type="number" 
          min="1" 
          max="8" 
          value={exteriorCleanliness} 
          onChange={(e) => setExteriorCleanliness(e.target.value)} 
          required 
          className="mt-1" 
        />
      </div>
      <div>
        <Label htmlFor="generalCondition">État général du véhicule (commentaires)</Label>
        <Textarea id="generalCondition" value={generalCondition} onChange={(e) => setGeneralCondition(e.target.value)} placeholder="Décrivez l'état général du véhicule (rayures, bosses, etc.)" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="convoyeurSignatureName">Nom du convoyeur (signature)</Label>
        <Input id="convoyeurSignatureName" type="text" value={convoyeurSignatureName} onChange={(e) => setConvoyeurSignatureName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="clientSignatureName">Nom du client (signature)</Label>
        <Input id="clientSignatureName" type="text" value={clientSignatureName} onChange={(e) => setClientSignatureName(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="photos">Photos du véhicule à l'arrivée</Label>
        <Input id="photos" type="file" multiple accept="image/*" onChange={(e) => setPhotos(e.target.files)} className="mt-1" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Veuillez prendre des photos de tous les côtés du véhicule. {initialData && initialData.photos && initialData.photos.length > 0 && `(${initialData.photos.length} photos existantes)`}
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : (initialData ? "Mettre à jour la Fiche" : "Enregistrer la Fiche d'Arrivée")}
      </Button>
    </form>
  );
};

export default ArrivalSheetForm;