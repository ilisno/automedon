import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMissions, DepartureSheet } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";

interface DepartureSheetFormProps {
  missionId: string;
  onSheetCreated: () => void;
}

const DepartureSheetForm: React.FC<DepartureSheetFormProps> = ({ missionId, onSheetCreated }) => {
  const { createDepartureSheet } = useMissions();
  const [mileage, setMileage] = useState<string>("");
  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>("");
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>("");
  const [generalCondition, setGeneralCondition] = useState<string>("");
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>("");
  const [clientSignatureName, setClientSignatureName] = useState<string>("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mileage || !fuelLevel || !interiorCleanliness || !exteriorCleanliness || !generalCondition || !convoyeurSignatureName || !clientSignatureName) {
      showError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (isNaN(parseFloat(mileage))) {
      showError("Le kilométrage doit être un nombre valide.");
      return;
    }

    setIsSubmitting(true);
    try {
      const sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'> = {
        mileage: parseFloat(mileage),
        fuel_level: fuelLevel,
        interior_cleanliness: interiorCleanliness,
        exterior_cleanliness: exteriorCleanliness,
        general_condition: generalCondition,
        convoyeur_signature_name: convoyeurSignatureName,
        client_signature_name: clientSignatureName,
      };
      await createDepartureSheet(missionId, sheetData, photos);
      onSheetCreated(); // Callback to notify parent component
    } catch (error) {
      console.error("Error creating departure sheet:", error);
      showError("Erreur lors de la création de la fiche de départ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-xl font-semibold mb-4">Fiche de Départ</h3>
      <div>
        <Label htmlFor="mileage">Kilométrage au départ</Label>
        <Input id="mileage" type="number" value={mileage} onChange={(e) => setMileage(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="fuelLevel">Niveau de carburant</Label>
        <Select value={fuelLevel} onValueChange={setFuelLevel} required>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sélectionnez le niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vide">Vide</SelectItem>
            <SelectItem value="quart">1/4</SelectItem>
            <SelectItem value="moitie">1/2</SelectItem>
            <SelectItem value="trois-quarts">3/4</SelectItem>
            <SelectItem value="plein">Plein</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="interiorCleanliness">Propreté intérieure</Label>
        <Select value={interiorCleanliness} onValueChange={setInteriorCleanliness} required>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impeccable">Impeccable</SelectItem>
            <SelectItem value="propre">Propre</SelectItem>
            <SelectItem value="moyen">Moyen</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="exteriorCleanliness">Propreté extérieure</Label>
        <Select value={exteriorCleanliness} onValueChange={setExteriorCleanliness} required>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="impeccable">Impeccable</SelectItem>
            <SelectItem value="propre">Propre</SelectItem>
            <SelectItem value="moyen">Moyen</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="generalCondition">État général du véhicule</Label>
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
        <Label htmlFor="photos">Photos du véhicule au départ</Label>
        <Input id="photos" type="file" multiple accept="image/*" onChange={(e) => setPhotos(e.target.files)} className="mt-1" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Veuillez prendre des photos de tous les côtés du véhicule.
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Enregistrer la Fiche de Départ"}
      </Button>
    </form>
  );
};

export default DepartureSheetForm;