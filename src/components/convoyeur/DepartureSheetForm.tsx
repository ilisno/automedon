import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [customFuelLevel, setCustomFuelLevel] = useState<string>("");
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>("");
  const [customInteriorCleanliness, setCustomInteriorCleanliness] = useState<string>("");
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>("");
  const [customExteriorCleanliness, setCustomExteriorCleanliness] = useState<string>("");
  const [generalCondition, setGeneralCondition] = useState<string>("");
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>("");
  const [clientSignatureName, setClientSignatureName] = useState<string>("");
  const [weatherConditions, setWeatherConditions] = useState<string>("");
  
  const [pickupLocationType, setPickupLocationType] = useState<string>("");
  const [customPickupLocationType, setCustomPickupLocationType] = useState<string>("");
  const [sdCardCdDvd, setSdCardCdDvd] = useState<string>("");
  const [customSdCardCdDvd, setCustomSdCardCdDvd] = useState<string>("");
  const [antenna, setAntenna] = useState<string>("");
  const [customAntenna, setCustomAntenna] = useState<string>("");
  const [spareTireKit, setSpareTireKit] = useState<string>("");
  const [customSpareTireKit, setCustomSpareTireKit] = useState<string>("");
  const [safetyKit, setSafetyKit] = useState<string>("");
  const [customSafetyKit, setCustomSafetyKit] = useState<string>("");
  const [numberOfKeys, setNumberOfKeys] = useState<string>("");
  const [frontFloorMats, setFrontFloorMats] = useState<string>("");
  const [customFrontFloorMats, setCustomFrontFloorMats] = useState<string>("");
  const [rearFloorMats, setRearFloorMats] = useState<string>("");
  const [customRearFloorMats, setCustomRearFloorMats] = useState<string>("");
  const [registrationCard, setRegistrationCard] = useState<string>("");
  const [customRegistrationCard, setCustomRegistrationCard] = useState<string>("");
  const [fuelCard, setFuelCard] = useState<string>("");
  const [customFuelCard, setCustomFuelCard] = useState<string>("");
  const [critairSticker, setCritairSticker] = useState<string>("");
  const [customCritairSticker, setCustomCritairSticker] = useState<string>("");
  const [userManual, setUserManual] = useState<string>("");
  const [customUserManual, setCustomUserManual] = useState<string>("");
  const [deliveryReport, setDeliveryReport] = useState<string>("");
  const [customDeliveryReport, setCustomDeliveryReport] = useState<string>("");

  const [photos, setPhotos] = useState<FileList | null>(null);
  const [existingPhotosUrls, setExistingPhotosUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ratingOptions = Array.from({ length: 8 }, (_, i) => String(i + 1));
  const presentAbsentOptions = ["Présent", "Absent"];
  const antennaOptions = ["Présente", "Absente"];
  const spareTireKitOptions = ["Roue de secours", "Kit anticrevaison", "Absent"];
  const floorMatsOptions = ["Présents", "Absents"];
  const registrationCardOptions = ["Originale", "Copie", "Absente"];

  const setSelectAndCustomValue = (setter: React.Dispatch<React.SetStateAction<string>>, customSetter: React.Dispatch<React.SetStateAction<string>>, options: string[], value: string | number | null | undefined) => {
    const stringValue = String(value || "");
    if (stringValue && !options.includes(stringValue)) {
      setter("Autre");
      customSetter(stringValue);
    } else {
      setter(stringValue);
      customSetter("");
    }
  };

  useEffect(() => {
    if (initialData) {
      setMileage(initialData.mileage.toString());
      setSelectAndCustomValue(setFuelLevel, setCustomFuelLevel, ratingOptions, initialData.fuel_level);
      setSelectAndCustomValue(setInteriorCleanliness, setCustomInteriorCleanliness, ratingOptions, initialData.interior_cleanliness);
      setSelectAndCustomValue(setExteriorCleanliness, setCustomExteriorCleanliness, ratingOptions, initialData.exterior_cleanliness);
      setGeneralCondition(initialData.general_condition);
      setConvoyeurSignatureName(initialData.convoyeur_signature_name);
      setClientSignatureName(initialData.client_signature_name);
      setWeatherConditions(initialData.weather_conditions || "");
      
      setSelectAndCustomValue(setPickupLocationType, setCustomPickupLocationType, [], initialData.pickup_location_type); // No fixed options for this one
      setSelectAndCustomValue(setSdCardCdDvd, setCustomSdCardCdDvd, presentAbsentOptions, initialData.sd_card_cd_dvd);
      setSelectAndCustomValue(setAntenna, setCustomAntenna, antennaOptions, initialData.antenna);
      setSelectAndCustomValue(setSpareTireKit, setCustomSpareTireKit, spareTireKitOptions, initialData.spare_tire_kit);
      setSelectAndCustomValue(setSafetyKit, setCustomSafetyKit, presentAbsentOptions, initialData.safety_kit);
      setNumberOfKeys(initialData.number_of_keys?.toString() || "");
      setSelectAndCustomValue(setFrontFloorMats, setCustomFrontFloorMats, floorMatsOptions, initialData.front_floor_mats);
      setSelectAndCustomValue(setRearFloorMats, setCustomRearFloorMats, floorMatsOptions, initialData.rear_floor_mats);
      setSelectAndCustomValue(setRegistrationCard, setCustomRegistrationCard, registrationCardOptions, initialData.registration_card);
      setSelectAndCustomValue(setFuelCard, setCustomFuelCard, presentAbsentOptions, initialData.fuel_card);
      setSelectAndCustomValue(setCritairSticker, setCustomCritairSticker, presentAbsentOptions, initialData.critair_sticker);
      setSelectAndCustomValue(setUserManual, setCustomUserManual, presentAbsentOptions, initialData.user_manual);
      setSelectAndCustomValue(setDeliveryReport, setCustomDeliveryReport, presentAbsentOptions, initialData.delivery_report);
      
      setExistingPhotosUrls(initialData.photos || []);
    } else {
      setMileage("");
      setFuelLevel(""); setCustomFuelLevel("");
      setInteriorCleanliness(""); setCustomInteriorCleanliness("");
      setExteriorCleanliness(""); setCustomExteriorCleanliness("");
      setGeneralCondition("");
      setConvoyeurSignatureName("");
      setClientSignatureName("");
      setWeatherConditions("");
      
      setPickupLocationType(""); setCustomPickupLocationType("");
      setSdCardCdDvd(""); setCustomSdCardCdDvd("");
      setAntenna(""); setCustomAntenna("");
      setSpareTireKit(""); setCustomSpareTireKit("");
      setSafetyKit(""); setCustomSafetyKit("");
      setNumberOfKeys("");
      setFrontFloorMats(""); setCustomFrontFloorMats("");
      setRearFloorMats(""); setCustomRearFloorMats("");
      setRegistrationCard(""); setCustomRegistrationCard("");
      setFuelCard(""); setCustomFuelCard("");
      setCritairSticker(""); setCustomCritairSticker("");
      setUserManual(""); setCustomUserManual("");
      setDeliveryReport(""); setCustomDeliveryReport("");
      
      setPhotos(null);
      setExistingPhotosUrls([]);
    }
  }, [initialData]);

  const getFinalValue = (selectValue: string, customValue: string) => {
    return selectValue === "Autre" ? customValue.trim() : selectValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalFuelLevel = getFinalValue(fuelLevel, customFuelLevel);
    const finalInteriorCleanliness = getFinalValue(interiorCleanliness, customInteriorCleanliness);
    const finalExteriorCleanliness = getFinalValue(exteriorCleanliness, customExteriorCleanliness);
    const finalPickupLocationType = getFinalValue(pickupLocationType, customPickupLocationType);
    const finalSdCardCdDvd = getFinalValue(sdCardCdDvd, customSdCardCdDvd);
    const finalAntenna = getFinalValue(antenna, customAntenna);
    const finalSpareTireKit = getFinalValue(spareTireKit, customSpareTireKit);
    const finalSafetyKit = getFinalValue(safetyKit, customSafetyKit);
    const finalFrontFloorMats = getFinalValue(frontFloorMats, customFrontFloorMats);
    const finalRearFloorMats = getFinalValue(rearFloorMats, customRearFloorMats);
    const finalRegistrationCard = getFinalValue(registrationCard, customRegistrationCard);
    const finalFuelCard = getFinalValue(fuelCard, customFuelCard);
    const finalCritairSticker = getFinalValue(critairSticker, customCritairSticker);
    const finalUserManual = getFinalValue(userManual, customUserManual);
    const finalDeliveryReport = getFinalValue(deliveryReport, customDeliveryReport);

    const parsedMileage = parseFloat(mileage);
    const parsedNumberOfKeys = parseInt(numberOfKeys);

    // Validation for 1-8 fields
    const isValidRating = (value: string) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 1 && num <= 8;
    };

    if (
      isNaN(parsedMileage) || parsedMileage <= 0 ||
      !isValidRating(finalFuelLevel) ||
      !isValidRating(finalInteriorCleanliness) ||
      !isValidRating(finalExteriorCleanliness) ||
      !generalCondition.trim() ||
      !convoyeurSignatureName.trim() ||
      !clientSignatureName.trim() ||
      !weatherConditions.trim() ||
      !finalPickupLocationType ||
      !finalSdCardCdDvd ||
      !finalAntenna ||
      !finalSpareTireKit ||
      !finalSafetyKit ||
      isNaN(parsedNumberOfKeys) || parsedNumberOfKeys < 0 ||
      !finalFrontFloorMats ||
      !finalRearFloorMats ||
      !finalRegistrationCard ||
      !finalFuelCard ||
      !finalCritairSticker ||
      !finalUserManual ||
      !finalDeliveryReport
    ) {
      showError("Veuillez remplir tous les champs obligatoires avec des valeurs valides (kilométrage > 0, notes entre 1 et 8, et tous les autres champs).");
      return;
    }

    setIsSubmitting(true);
    try {
      const sheetData = {
        mileage: parsedMileage,
        fuel_level: parseInt(finalFuelLevel),
        interior_cleanliness: parseInt(finalInteriorCleanliness),
        exterior_cleanliness: parseInt(finalExteriorCleanliness),
        general_condition: generalCondition.trim(),
        convoyeur_signature_name: convoyeurSignatureName.trim(),
        client_signature_name: clientSignatureName.trim(),
        weather_conditions: weatherConditions.trim(),
        pickup_location_type: finalPickupLocationType,
        sd_card_cd_dvd: finalSdCardCdDvd,
        antenna: finalAntenna,
        spare_tire_kit: finalSpareTireKit,
        safety_kit: finalSafetyKit,
        number_of_keys: parsedNumberOfKeys,
        front_floor_mats: finalFrontFloorMats,
        rear_floor_mats: finalRearFloorMats,
        registration_card: finalRegistrationCard,
        fuel_card: finalFuelCard,
        critair_sticker: finalCritairSticker,
        user_manual: finalUserManual,
        delivery_report: finalDeliveryReport,
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
        <Select value={fuelLevel} onValueChange={setFuelLevel} required>
          <SelectTrigger id="fuelLevel" className="mt-1">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map(num => (
              <SelectItem key={num} value={num}>{num}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {fuelLevel === "Autre" && (
          <Input
            type="text"
            value={customFuelLevel}
            onChange={(e) => setCustomFuelLevel(e.target.value)}
            placeholder="Précisez le niveau de carburant"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="interiorCleanliness">Propreté intérieure (1-8)</Label>
        <Select value={interiorCleanliness} onValueChange={setInteriorCleanliness} required>
          <SelectTrigger id="interiorCleanliness" className="mt-1">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map(num => (
              <SelectItem key={num} value={num}>{num}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {interiorCleanliness === "Autre" && (
          <Input
            type="text"
            value={customInteriorCleanliness}
            onChange={(e) => setCustomInteriorCleanliness(e.target.value)}
            placeholder="Précisez la propreté intérieure"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="exteriorCleanliness">Propreté extérieure (1-8)</Label>
        <Select value={exteriorCleanliness} onValueChange={setExteriorCleanliness} required>
          <SelectTrigger id="exteriorCleanliness" className="mt-1">
            <SelectValue placeholder="Sélectionnez un niveau" />
          </SelectTrigger>
          <SelectContent>
            {ratingOptions.map(num => (
              <SelectItem key={num} value={num}>{num}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {exteriorCleanliness === "Autre" && (
          <Input
            type="text"
            value={customExteriorCleanliness}
            onChange={(e) => setCustomExteriorCleanliness(e.target.value)}
            placeholder="Précisez la propreté extérieure"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="generalCondition">État général du véhicule (commentaires)</Label>
        <Textarea id="generalCondition" value={generalCondition} onChange={(e) => setGeneralCondition(e.target.value)} placeholder="Décrivez l'état général du véhicule (rayures, bosses, etc.)" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="weatherConditions">Conditions Météo</Label>
        <Input id="weatherConditions" type="text" value={weatherConditions} onChange={(e) => setWeatherConditions(e.target.value)} placeholder="Ex: Ensoleillé, Pluie légère" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="pickupLocationType">Lieu d'enlèvement</Label>
        <Select value={pickupLocationType} onValueChange={setPickupLocationType} required>
          <SelectTrigger id="pickupLocationType" className="mt-1">
            <SelectValue placeholder="Sélectionnez le type de lieu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Domicile">Domicile</SelectItem>
            <SelectItem value="Concession">Concession</SelectItem>
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {pickupLocationType === "Autre" && (
          <Input
            type="text"
            value={customPickupLocationType}
            onChange={(e) => setCustomPickupLocationType(e.target.value)}
            placeholder="Précisez le lieu d'enlèvement"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="sdCardCdDvd">Carte SD ou CD/DVD</Label>
        <Select value={sdCardCdDvd} onValueChange={setSdCardCdDvd} required>
          <SelectTrigger id="sdCardCdDvd" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {sdCardCdDvd === "Autre" && (
          <Input
            type="text"
            value={customSdCardCdDvd}
            onChange={(e) => setCustomSdCardCdDvd(e.target.value)}
            placeholder="Précisez l'état de la carte SD/CD/DVD"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="antenna">Antenne</Label>
        <Select value={antenna} onValueChange={setAntenna} required>
          <SelectTrigger id="antenna" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {antennaOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {antenna === "Autre" && (
          <Input
            type="text"
            value={customAntenna}
            onChange={(e) => setCustomAntenna(e.target.value)}
            placeholder="Précisez l'état de l'antenne"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="spareTireKit">Roue de secours / Kit anticrevaison</Label>
        <Select value={spareTireKit} onValueChange={setSpareTireKit} required>
          <SelectTrigger id="spareTireKit" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {spareTireKitOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {spareTireKit === "Autre" && (
          <Input
            type="text"
            value={customSpareTireKit}
            onChange={(e) => setCustomSpareTireKit(e.target.value)}
            placeholder="Précisez l'état de la roue de secours/kit"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="safetyKit">Kit de sécurité (Triangle / Gilet)</Label>
        <Select value={safetyKit} onValueChange={setSafetyKit} required>
          <SelectTrigger id="safetyKit" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {safetyKit === "Autre" && (
          <Input
            type="text"
            value={customSafetyKit}
            onChange={(e) => setCustomSafetyKit(e.target.value)}
            placeholder="Précisez l'état du kit de sécurité"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="numberOfKeys">Nombre de clefs confiées</Label>
        <Input id="numberOfKeys" type="number" min="0" value={numberOfKeys} onChange={(e) => setNumberOfKeys(e.target.value)} required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="frontFloorMats">Tapis de sol avants</Label>
        <Select value={frontFloorMats} onValueChange={setFrontFloorMats} required>
          <SelectTrigger id="frontFloorMats" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {floorMatsOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {frontFloorMats === "Autre" && (
          <Input
            type="text"
            value={customFrontFloorMats}
            onChange={(e) => setCustomFrontFloorMats(e.target.value)}
            placeholder="Précisez l'état des tapis avants"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="rearFloorMats">Tapis de sol arrières</Label>
        <Select value={rearFloorMats} onValueChange={setRearFloorMats} required>
          <SelectTrigger id="rearFloorMats" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {floorMatsOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {rearFloorMats === "Autre" && (
          <Input
            type="text"
            value={customRearFloorMats}
            onChange={(e) => setCustomRearFloorMats(e.target.value)}
            placeholder="Précisez l'état des tapis arrières"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="registrationCard">Certificat d'immatriculation (carte grise) (originale ou copie)</Label>
        <Select value={registrationCard} onValueChange={setRegistrationCard} required>
          <SelectTrigger id="registrationCard" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {registrationCardOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {registrationCard === "Autre" && (
          <Input
            type="text"
            value={customRegistrationCard}
            onChange={(e) => setCustomRegistrationCard(e.target.value)}
            placeholder="Précisez l'état du certificat"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="fuelCard">Carte carburant</Label>
        <Select value={fuelCard} onValueChange={setFuelCard} required>
          <SelectTrigger id="fuelCard" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {fuelCard === "Autre" && (
          <Input
            type="text"
            value={customFuelCard}
            onChange={(e) => setCustomFuelCard(e.target.value)}
            placeholder="Précisez l'état de la carte carburant"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="critairSticker">Vignette crit'air</Label>
        <Select value={critairSticker} onValueChange={setCritairSticker} required>
          <SelectTrigger id="critairSticker" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {critairSticker === "Autre" && (
          <Input
            type="text"
            value={customCritairSticker}
            onChange={(e) => setCustomCritairSticker(e.target.value)}
            placeholder="Précisez l'état de la vignette crit'air"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="userManual">Manuel d'utilisation du véhicule</Label>
        <Select value={userManual} onValueChange={setUserManual} required>
          <SelectTrigger id="userManual" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {userManual === "Autre" && (
          <Input
            type="text"
            value={customUserManual}
            onChange={(e) => setCustomUserManual(e.target.value)}
            placeholder="Précisez l'état du manuel d'utilisation"
            className="mt-2"
            required
          />
        )}
      </div>
      <div>
        <Label htmlFor="deliveryReport">PV de livraison</Label>
        <Select value={deliveryReport} onValueChange={setDeliveryReport} required>
          <SelectTrigger id="deliveryReport" className="mt-1">
            <SelectValue placeholder="Sélectionnez l'état" />
          </SelectTrigger>
          <SelectContent>
            {presentAbsentOptions.map(option => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
            <SelectItem value="Autre">Autre (préciser)</SelectItem>
          </SelectContent>
        </Select>
        {deliveryReport === "Autre" && (
          <Input
            type="text"
            value={customDeliveryReport}
            onChange={(e) => setCustomDeliveryReport(e.target.value)}
            placeholder="Précisez l'état du PV de livraison"
            className="mt-2"
            required
          />
        )}
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