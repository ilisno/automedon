import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, DepartureSheet } from "@/context/MissionsContext";
import { showError, showSuccess } from "@/utils/toast";

interface DepartureSheetFormProps {
  missionId: string;
  onSheetCreated: () => void;
  initialData?: DepartureSheet;
}

const DepartureSheetForm: React.FC<DepartureSheetFormProps> = ({ missionId, onSheetCreated, initialData }) => {
  const { createDepartureSheet, updateDepartureSheet } = useMissions();
  const [mileage, setMileage] = useState<string>("");
  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>("");
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>("");
  const [generalCondition, setGeneralCondition] = useState<string>("");
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>("");
  const [clientSignatureName, setClientSignatureName] = useState<string>("");
  const [weatherConditions, setWeatherConditions] = useState<string>("");
  // NEW STATES FOR NEW FIELDS
  const [pickupLocationType, setPickupLocationType] = useState<string>("");
  const [sdCardCdDvd, setSdCardCdDvd] = useState<string>("");
  const [antenna, setAntenna] = useState<string>("");
  const [spareTireKit, setSpareTireKit] = useState<string>("");
  const [safetyKit, setSafetyKit] = useState<string>("");
  const [numberOfKeys, setNumberOfKeys] = useState<string>("");
  const [frontFloorMats, setFrontFloorMats] = useState<string>("");
  const [rearFloorMats, setRearFloorMats] = useState<string>("");
  const [registrationCard, setRegistrationCard] = useState<string>("");
  const [fuelCard, setFuelCard] = useState<string>("");
  const [critairSticker, setCritairSticker] = useState<string>("");
  const [userManual, setUserManual] = useState<string>("");
  const [deliveryReport, setDeliveryReport] = useState<string>("");

  const [photos, setPhotos] = useState<FileList | null>(null);
  const [existingPhotosUrls, setExistingPhotosUrls] = useState<string[]>([]); // NEW state for existing photos
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
      setWeatherConditions(initialData.weather_conditions || "");
      // NEW: Populate new fields
      setPickupLocationType(initialData.pickup_location_type || "");
      setSdCardCdDvd(initialData.sd_card_cd_dvd || "");
      setAntenna(initialData.antenna || "");
      setSpareTireKit(initialData.spare_tire_kit || "");
      setSafetyKit(initialData.safety_kit || "");
      setNumberOfKeys(initialData.number_of_keys?.toString() || "");
      setFrontFloorMats(initialData.front_floor_mats || "");
      setRearFloorMats(initialData.rear_floor_mats || "");
      setRegistrationCard(initialData.registration_card || "");
      setFuelCard(initialData.fuel_card || "");
      setCritairSticker(initialData.critair_sticker || "");
      setUserManual(initialData.user_manual || "");
      setDeliveryReport(initialData.delivery_report || "");
      setExistingPhotosUrls(initialData.photos || []); // NEW: Set existing photos
      // Photos are not pre-filled for security/complexity reasons, user re-uploads if needed
    } else {
      // Reset form if no initial data (for new sheet creation)
      setMileage("");
      setFuelLevel("");
      setInteriorCleanliness("");
      setExteriorCleanliness("");
      setGeneralCondition("");
      setConvoyeurSignatureName("");
      setClientSignatureName("");
      setWeatherConditions("");
      // NEW: Reset new fields
      setPickupLocationType("");
      setSdCardCdDvd("");
      setAntenna("");
      setSpareTireKit("");
      setSafetyKit("");
      setNumberOfKeys("");
      setFrontFloorMats("");
      setRearFloorMats("");
      setRegistrationCard("");
      setFuelCard("");
      setCritairSticker("");
      setUserManual("");
      setDeliveryReport("");
      setPhotos(null);
      setExistingPhotosUrls([]); // NEW: Reset existing photos
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedMileage = parseFloat(mileage);
    const parsedFuelLevel = parseInt(fuelLevel);
    const parsedInteriorCleanliness = parseInt(interiorCleanliness);
    const parsedExteriorCleanliness = parseInt(exteriorCleanliness);
    const parsedNumberOfKeys = parseInt(numberOfKeys); // NEW: Parse number of keys

    if (
      isNaN(parsedMileage) || parsedMileage <= 0 ||
      isNaN(parsedFuelLevel) || parsedFuelLevel < 1 || parsedFuelLevel > 8 ||
      isNaN(parsedInteriorCleanliness) || parsedInteriorCleanliness < 1 || parsedInteriorCleanliness > 8 ||
      isNaN(parsedExteriorCleanliness) || parsedExteriorCleanliness < 1 || parsedExteriorCleanliness > 8 ||
      !generalCondition.trim() ||
      !convoyeurSignatureName.trim() ||
      !clientSignatureName.trim() ||
      !weatherConditions.trim() ||
      !pickupLocationType.trim() || // NEW: Validate new fields
      !sdCardCdDvd.trim() ||
      !antenna.trim() ||
      !spareTireKit.trim() ||
      !safetyKit.trim() ||
      isNaN(parsedNumberOfKeys) || parsedNumberOfKeys < 0 || // Validate number of keys
      !frontFloorMats.trim() ||
      !rearFloorMats.trim() ||
      !registrationCard.trim() ||
      !fuelCard.trim() ||
      !critairSticker.trim() ||
      !userManual.trim() ||
      !deliveryReport.trim()
    ) {
      showError("Veuillez remplir tous les champs obligatoires avec des valeurs valides (kilométrage > 0, notes entre 1 et 8, conditions météo, et tous les nouveaux champs).");
      return;
    }

    setIsSubmitting(true);
    try {
      const sheetData = {
        mileage: parsedMileage,
        fuel_level: parsedFuelLevel,
        interior_cleanliness: parsedInteriorCleanliness,
        exterior_cleanliness: parsedExteriorCleanliness,
        general_condition: generalCondition.trim(),
        convoyeur_signature_name: convoyeurSignatureName.trim(),
        client_signature_name: clientSignatureName.trim(),
        weather_conditions: weatherConditions.trim(),
        // NEW: Include new fields in sheetData
        pickup_location_type: pickupLocationType.trim(),
        sd_card_cd_dvd: sdCardCdDvd.trim(),
        antenna: antenna.trim(),
        spare_tire_kit: spareTireKit.trim(),
        safety_kit: safetyKit.trim(),
        number_of_keys: parsedNumberOfKeys,
        front_floor_mats: frontFloorMats.trim(),
        rear_floor_mats: rearFloorMats.trim(),
        registration_card: registrationCard.trim(),
        fuel_card: fuelCard.trim(),
        critair_sticker: critairSticker.trim(),
        user_manual: userManual.trim(),
        delivery_report: deliveryReport.trim(),
      };

      if (initialData) {
        await updateDepartureSheet(initialData.id, missionId, sheetData, photos);
      } else {
        await createDepartureSheet(missionId, sheetData, photos);
      }
      onSheetCreated();
    } catch (error) {
      console.error("Error processing departure sheet:", error);
      showError("Erreur lors de l'enregistrement de la fiche de départ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h3 className="text-xl font-semibold mb-4">{initialData ? "Modifier la Fiche de Départ" : "Fiche de Départ"}</h3>
      <div>
        <Label htmlFor="mileage">Kilométrage au départ</Label>
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
        <Label htmlFor="weatherConditions">Conditions Météo</Label>
        <Input id="weatherConditions" type="text" value={weatherConditions} onChange={(e) => setWeatherConditions(e.target.value)} placeholder="Ex: Ensoleillé, Pluie légère" required className="mt-1" />
      </div>
      {/* NEW FIELDS */}
      <div>
        <Label htmlFor="pickupLocationType">Lieu d'enlèvement</Label>
        <Input id="pickupLocationType" type="text" value={pickupLocationType} onChange={(e) => setPickupLocationType(e.target.value)} placeholder="Ex: Domicile, Concession" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="sdCardCdDvd">Carte SD ou CD/DVD</Label>
        <Input id="sdCardCdDvd" type="text" value={sdCardCdDvd} onChange={(e) => setSdCardCdDvd(e.target.value)} placeholder="Ex: Présent, Absent" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="antenna">Antenne</Label>
        <Input id="antenna" type="text" value={antenna} onChange={(e) => setAntenna(e.target.value)} placeholder="Ex: Présente, Absente" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="spareTireKit">Roue de secours / Kit anticrevaison</Label>
        <Input id="spareTireKit" type="text" value={spareTireKit} onChange={(e) => setSpareTireKit(e.target.value)} placeholder="Ex: Roue de secours, Kit anticrevaison" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="safetyKit">Kit de sécurité (Triangle / Gilet)</Label>
        <Input id="safetyKit" type="text" value={safetyKit} onChange={(e) => setSafetyKit(e.target.value)} placeholder="Ex: Présent, Absent" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="numberOfKeys">Nombre de clefs confiées</Label>
        <Input id="numberOfKeys" type="number" min="0" value={numberOfKeys} onChange={(e) => setNumberOfKeys(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="frontFloorMats">Tapis de sol avants</Label>
        <Input id="frontFloorMats" type="text" value={frontFloorMats} onChange={(e) => setFrontFloorMats(e.target.value)} placeholder="Ex: Présents, Absents" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="rearFloorMats">Tapis de sol arrières</Label>
        <Input id="rearFloorMats" type="text" value={rearFloorMats} onChange={(e) => setRearFloorMats(e.target.value)} placeholder="Ex: Présents, Absents" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="registrationCard">Certificat d'immatriculation (carte grise) (originale ou copie)</Label>
        <Input id="registrationCard" type="text" value={registrationCard} onChange={(e) => setRegistrationCard(e.target.value)} placeholder="Ex: Originale, Copie" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="fuelCard">Carte carburant</Label>
        <Input id="fuelCard" type="text" value={fuelCard} onChange={(e) => setFuelCard(e.target.value)} placeholder="Ex: Présente, Absente" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="critairSticker">Vignette crit'air</Label>
        <Input id="critairSticker" type="text" value={critairSticker} onChange={(e) => setCritairSticker(e.target.value)} placeholder="Ex: Présente, Absente" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="userManual">Manuel d'utilisation du véhicule</Label>
        <Input id="userManual" type="text" value={userManual} onChange={(e) => setUserManual(e.target.value)} placeholder="Ex: Présent, Absent" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="deliveryReport">PV de livraison</Label>
        <Input id="deliveryReport" type="text" value={deliveryReport} onChange={(e) => setDeliveryReport(e.target.value)} placeholder="Ex: Présent, Absent" required className="mt-1" />
      </div>
      {/* END NEW FIELDS */}
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
          Veuillez inclure les photos suivantes : Tableau de bord (présence voyants), Compteur (kilométrage), Face avant générale, Face arrière générale, Latéral droit, Latéral gauche, Sièges avants, Sièges arrières, Coffre ouvert.
          {existingPhotosUrls.length > 0 && ` (${existingPhotosUrls.length} photos existantes. Les nouvelles photos seront ajoutées.)`}
        </p>
      </div>
      {existingPhotosUrls.length > 0 && (
        <div className="mb-4">
          <Label>Photos existantes:</Label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {existingPhotosUrls.map((url, index) => (
              <img key={index} src={url} alt={`Existing photo ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
            ))}
          </div>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : (initialData ? "Mettre à jour la Fiche" : "Enregistrer la Fiche de Départ")}
      </Button>
    </form>
  );
};

export default DepartureSheetForm;