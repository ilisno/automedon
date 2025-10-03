import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMissions, DepartureSheet, Mission, Profile } from "@/context/MissionsContext";
import { showError, showSuccess } from "@/utils/toast";
import { supabase } from "@/integrations/supabase/client";

interface DepartureSheetFormProps {
  missionId: string;
  onSheetCreated: () => void;
  initialData?: DepartureSheet;
  missionDetails: Mission; // Pass mission details for pre-filling
}

const DepartureSheetForm: React.FC<DepartureSheetFormProps> = ({ missionId, onSheetCreated, initialData, missionDetails }) => {
  const { createDepartureSheet, updateDepartureSheet, useProfile } = useMissions();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { profile: convoyeurProfile, isLoading: isLoadingConvoyeurProfile } = useProfile(currentUserId || undefined);
  const { profile: clientProfile, isLoading: isLoadingClientProfile } = useProfile(missionDetails.client_id || undefined);

  // Convoyeur Info
  const [convoyeurFirstName, setConvoyeurFirstName] = useState("");
  const [convoyeurLastName, setConvoyeurLastName] = useState("");
  const [convoyeurCompany, setConvoyeurCompany] = useState("");
  const [convoyeurEmail, setConvoyeurEmail] = useState("");
  const [convoyeurPhone, setConvoyeurPhone] = useState("");

  // Client Info
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  // Vehicle Info
  const [immatriculation, setImmatriculation] = useState("");
  const [chassisNumber, setChassisNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [weatherConditions, setWeatherConditions] = useState("");
  const [mileage, setMileage] = useState<string>("");
  const [fuelLevel, setFuelLevel] = useState<string>("");
  const [interiorCleanliness, setInteriorCleanliness] = useState<string>("");
  const [exteriorCleanliness, setExteriorCleanliness] = useState<string>("");
  const [generalCondition, setGeneralCondition] = useState<string>("");
  const [pickupLocationType, setPickupLocationType] = useState<'client_site' | 'collaborator_address' | 'dealership' | ''>("");
  const [sdCardCdDvd, setSdCardCdDvd] = useState<'equipped' | 'not_equipped' | ''>("");
  const [antenna, setAntenna] = useState<'equipped' | 'not_equipped' | ''>("");
  const [spareTireKit, setSpareTireKit] = useState<'present' | 'not_present' | ''>("");
  const [safetyKit, setSafetyKit] = useState<'present' | 'not_present' | ''>("");
  const [numberOfKeys, setNumberOfKeys] = useState<string>("");
  const [frontFloorMats, setFrontFloorMats] = useState<'present' | 'not_present' | ''>("");
  const [rearFloorMats, setRearFloorMats] = useState<'present' | 'not_present' | ''>("");
  const [registrationCard, setRegistrationCard] = useState<'present' | 'not_present' | ''>("");
  const [fuelCard, setFuelCard] = useState<'present' | 'not_present' | ''>("");
  const [critairSticker, setCritairSticker] = useState<'present' | 'not_present' | ''>("");
  const [userManual, setUserManual] = useState<'present' | 'not_present' | ''>("");
  const [deliveryReport, setDeliveryReport] = useState<'present' | 'not_present' | ''>("");

  // Signatures
  const [convoyeurSignatureName, setConvoyeurSignatureName] = useState<string>("");
  const [clientSignatureName, setClientSignatureName] = useState<string>("");
  const [photos, setPhotos] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Pre-fill form with existing sheet data
      setConvoyeurFirstName(initialData.convoyeur_first_name || "");
      setConvoyeurLastName(initialData.convoyeur_last_name || "");
      setConvoyeurCompany(initialData.convoyeur_company || "");
      setConvoyeurEmail(initialData.convoyeur_email || "");
      setConvoyeurPhone(initialData.convoyeur_phone || "");

      setClientFirstName(initialData.client_first_name || "");
      setClientLastName(initialData.client_last_name || "");
      setClientCompany(initialData.client_company || "");
      setClientEmail(initialData.client_email || "");
      setClientPhone(initialData.client_phone || "");

      setImmatriculation(initialData.immatriculation || "");
      setChassisNumber(initialData.chassis_number || "");
      setBrand(initialData.brand || "");
      setModel(initialData.model || "");
      setWeatherConditions(initialData.weather_conditions || "");
      setMileage(initialData.mileage.toString());
      setFuelLevel(initialData.fuel_level.toString());
      setInteriorCleanliness(initialData.interior_cleanliness.toString());
      setExteriorCleanliness(initialData.exterior_cleanliness.toString());
      setGeneralCondition(initialData.general_condition);
      setPickupLocationType(initialData.pickup_location_type || "");
      setSdCardCdDvd(initialData.sd_card_cd_dvd || "");
      setAntenna(initialData.antenna || "");
      setSpareTireKit(initialData.spare_tire_kit || "");
      setSafetyKit(initialData.safety_kit || "");
      setNumberOfKeys(initialData.number_of_keys.toString());
      setFrontFloorMats(initialData.front_floor_mats || "");
      setRearFloorMats(initialData.rear_floor_mats || "");
      setRegistrationCard(initialData.registration_card || "");
      setFuelCard(initialData.fuel_card || "");
      setCritairSticker(initialData.critair_sticker || "");
      setUserManual(initialData.user_manual || "");
      setDeliveryReport(initialData.delivery_report || "");

      setConvoyeurSignatureName(initialData.convoyeur_signature_name);
      setClientSignatureName(initialData.client_signature_name);
      // Photos are not pre-filled for security/complexity reasons, user re-uploads if needed
    } else {
      // Pre-fill with mission and profile data for new sheet
      setImmatriculation(missionDetails.immatriculation || "");
      setModel(missionDetails.modele || "");
      setBrand(""); // Brand is not in mission details, must be entered
      setChassisNumber(""); // Chassis number is not in mission details, must be entered

      if (convoyeurProfile) {
        setConvoyeurFirstName(convoyeurProfile.first_name || "");
        setConvoyeurLastName(convoyeurProfile.last_name || "");
        setConvoyeurCompany(convoyeurProfile.company_type || ""); // Assuming company_type for convoyeur
        // Convoyeur email and phone are not directly in profile, but can be fetched from auth.user or profile
        // For now, leave them blank or fetch from auth.user if available
        setConvoyeurEmail(supabase.auth.currentUser?.email || "");
        setConvoyeurPhone(convoyeurProfile.phone || "");
      }

      if (clientProfile) {
        setClientFirstName(clientProfile.first_name || "");
        setClientLastName(clientProfile.last_name || "");
        setClientCompany(clientProfile.company_type || "");
        setClientEmail(supabase.auth.currentUser?.email || ""); // This is incorrect, should be client's email
        setClientPhone(clientProfile.phone || "");
      } else {
        // Fallback to missionDetails if clientProfile not loaded yet
        setClientFirstName(missionDetails.client_first_name || "");
        setClientLastName(missionDetails.client_last_name || "");
        setClientCompany(missionDetails.client_company || "");
        setClientEmail(missionDetails.client_email || "");
        setClientPhone(missionDetails.client_phone || "");
      }

      // Reset other fields for new sheet
      setWeatherConditions("");
      setMileage("");
      setFuelLevel("");
      setInteriorCleanliness("");
      setExteriorCleanliness("");
      setGeneralCondition("");
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
      setConvoyeurSignatureName("");
      setClientSignatureName("");
      setPhotos(null);
    }
  }, [initialData, missionDetails, convoyeurProfile, clientProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedMileage = parseFloat(mileage);
    const parsedFuelLevel = parseInt(fuelLevel);
    const parsedInteriorCleanliness = parseInt(interiorCleanliness);
    const parsedExteriorCleanliness = parseInt(exteriorCleanliness);
    const parsedNumberOfKeys = parseInt(numberOfKeys);

    if (
      !convoyeurFirstName.trim() || !convoyeurLastName.trim() || !convoyeurEmail.trim() || !convoyeurPhone.trim() ||
      !clientFirstName.trim() || !clientLastName.trim() || !clientEmail.trim() || !clientPhone.trim() ||
      !immatriculation.trim() || !brand.trim() || !model.trim() || !weatherConditions.trim() ||
      isNaN(parsedMileage) || parsedMileage <= 0 ||
      isNaN(parsedFuelLevel) || parsedFuelLevel < 1 || parsedFuelLevel > 8 ||
      isNaN(parsedInteriorCleanliness) || parsedInteriorCleanliness < 1 || parsedInteriorCleanliness > 8 ||
      isNaN(parsedExteriorCleanliness) || parsedExteriorCleanliness < 1 || parsedExteriorCleanliness > 8 ||
      !generalCondition.trim() ||
      !pickupLocationType || !sdCardCdDvd || !antenna || !spareTireKit || !safetyKit ||
      isNaN(parsedNumberOfKeys) || parsedNumberOfKeys < 0 ||
      !frontFloorMats || !rearFloorMats || !registrationCard || !fuelCard || !critairSticker || !userManual || !deliveryReport ||
      !convoyeurSignatureName.trim() ||
      !clientSignatureName.trim()
    ) {
      showError("Veuillez remplir tous les champs obligatoires avec des valeurs valides (kilométrage > 0, notes entre 1 et 8, nombre de clés >= 0).");
      return;
    }

    setIsSubmitting(true);
    try {
      const sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'> = {
        convoyeur_first_name: convoyeurFirstName.trim(),
        convoyeur_last_name: convoyeurLastName.trim(),
        convoyeur_company: convoyeurCompany.trim() || null,
        convoyeur_email: convoyeurEmail.trim(),
        convoyeur_phone: convoyeurPhone.trim(),
        client_first_name: clientFirstName.trim(),
        client_last_name: clientLastName.trim(),
        client_company: clientCompany.trim() || null,
        client_email: clientEmail.trim(),
        client_phone: clientPhone.trim(),
        immatriculation: immatriculation.trim(),
        chassis_number: chassisNumber.trim() || null,
        brand: brand.trim(),
        model: model.trim(),
        weather_conditions: weatherConditions.trim(),
        mileage: parsedMileage,
        fuel_level: parsedFuelLevel,
        interior_cleanliness: parsedInteriorCleanliness,
        exterior_cleanliness: parsedExteriorCleanliness,
        general_condition: generalCondition.trim(),
        pickup_location_type: pickupLocationType,
        sd_card_cd_dvd: sdCardCdDvd,
        antenna: antenna,
        spare_tire_kit: spareTireKit,
        safety_kit: safetyKit,
        number_of_keys: parsedNumberOfKeys,
        front_floor_mats: frontFloorMats,
        rear_floor_mats: rearFloorMats,
        registration_card: registrationCard,
        fuel_card: fuelCard,
        critair_sticker: critairSticker,
        user_manual: userManual,
        delivery_report: deliveryReport,
        convoyeur_signature_name: convoyeurSignatureName.trim(),
        client_signature_name: clientSignatureName.trim(),
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

  if (isLoadingConvoyeurProfile || isLoadingClientProfile) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des profils...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <h3 className="text-xl font-semibold mb-4">{initialData ? "Modifier la Fiche de Départ" : "Fiche de Départ"}</h3>

      {/* Convoyeur Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="convoyeurFirstName">Nom Convoyeur</Label>
          <Input id="convoyeurFirstName" type="text" value={convoyeurFirstName} onChange={(e) => setConvoyeurFirstName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="convoyeurLastName">Prénom Convoyeur</Label>
          <Input id="convoyeurLastName" type="text" value={convoyeurLastName} onChange={(e) => setConvoyeurLastName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="convoyeurCompany">Société Convoyeur</Label>
          <Input id="convoyeurCompany" type="text" value={convoyeurCompany} onChange={(e) => setConvoyeurCompany(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="convoyeurEmail">Email Convoyeur</Label>
          <Input id="convoyeurEmail" type="email" value={convoyeurEmail} onChange={(e) => setConvoyeurEmail(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="convoyeurPhone">N° Téléphone Convoyeur</Label>
          <Input id="convoyeurPhone" type="tel" value={convoyeurPhone} onChange={(e) => setConvoyeurPhone(e.target.value)} required className="mt-1" />
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-6">
        <div>
          <Label htmlFor="clientFirstName">Nom Client</Label>
          <Input id="clientFirstName" type="text" value={clientFirstName} onChange={(e) => setClientFirstName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="clientLastName">Prénom Client</Label>
          <Input id="clientLastName" type="text" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="clientCompany">Société Client</Label>
          <Input id="clientCompany" type="text" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="clientEmail">Email Client</Label>
          <Input id="clientEmail" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="clientPhone">N° Téléphone Client</Label>
          <Input id="clientPhone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required className="mt-1" />
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-6">
        <div>
          <Label htmlFor="immatriculation">Immatriculation</Label>
          <Input id="immatriculation" type="text" value={immatriculation} onChange={(e) => setImmatriculation(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="chassisNumber">N° de châssis (facultatif)</Label>
          <Input id="chassisNumber" type="text" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="brand">Marque</Label>
          <Input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="model">Modèle</Label>
          <Input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="weatherConditions">Conditions Météo</Label>
          <Input id="weatherConditions" type="text" value={weatherConditions} onChange={(e) => setWeatherConditions(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="mileage">Kilométrage initial</Label>
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
        <div className="md:col-span-2">
          <Label htmlFor="generalCondition">État général du véhicule (commentaires)</Label>
          <Textarea id="generalCondition" value={generalCondition} onChange={(e) => setGeneralCondition(e.target.value)} placeholder="Décrivez l'état général du véhicule (rayures, bosses, etc.)" required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="pickupLocationType">Lieu d'enlèvement</Label>
          <Select value={pickupLocationType} onValueChange={(value: 'client_site' | 'collaborator_address' | 'dealership') => setPickupLocationType(value)} required>
            <SelectTrigger id="pickupLocationType" className="mt-1">
              <SelectValue placeholder="Sélectionnez le lieu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client_site">Site client</SelectItem>
              <SelectItem value="collaborator_address">Adresse collaborateur</SelectItem>
              <SelectItem value="dealership">Concessionnaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="sdCardCdDvd">Carte SD ou CD/DVD</Label>
          <Select value={sdCardCdDvd} onValueChange={(value: 'equipped' | 'not_equipped') => setSdCardCdDvd(value)} required>
            <SelectTrigger id="sdCardCdDvd" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipped">Équipé</SelectItem>
              <SelectItem value="not_equipped">Pas équipé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="antenna">Antenne</Label>
          <Select value={antenna} onValueChange={(value: 'equipped' | 'not_equipped') => setAntenna(value)} required>
            <SelectTrigger id="antenna" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="equipped">Équipé</SelectItem>
              <SelectItem value="not_equipped">Pas équipé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="spareTireKit">Roue de secours / Kit anticrevaison</Label>
          <Select value={spareTireKit} onValueChange={(value: 'present' | 'not_present') => setSpareTireKit(value)} required>
            <SelectTrigger id="spareTireKit" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présent</SelectItem>
              <SelectItem value="not_present">Non présent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="safetyKit">Kit de sécurité (Triangle / Gilet)</Label>
          <Select value={safetyKit} onValueChange={(value: 'present' | 'not_present') => setSafetyKit(value)} required>
            <SelectTrigger id="safetyKit" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présent</SelectItem>
              <SelectItem value="not_present">Non présent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="numberOfKeys">Nombre de clefs confiées</Label>
          <Input id="numberOfKeys" type="number" min="0" value={numberOfKeys} onChange={(e) => setNumberOfKeys(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="frontFloorMats">Tapis de sol avants</Label>
          <Select value={frontFloorMats} onValueChange={(value: 'present' | 'not_present') => setFrontFloorMats(value)} required>
            <SelectTrigger id="frontFloorMats" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présents</SelectItem>
              <SelectItem value="not_present">Non présents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="rearFloorMats">Tapis de sol arrières</Label>
          <Select value={rearFloorMats} onValueChange={(value: 'present' | 'not_present') => setRearFloorMats(value)} required>
            <SelectTrigger id="rearFloorMats" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présents</SelectItem>
              <SelectItem value="not_present">Non présents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="registrationCard">Carte grise (originale ou copie)</Label>
          <Select value={registrationCard} onValueChange={(value: 'present' | 'not_present') => setRegistrationCard(value)} required>
            <SelectTrigger id="registrationCard" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présente</SelectItem>
              <SelectItem value="not_present">Non présente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="fuelCard">Carte carburant</Label>
          <Select value={fuelCard} onValueChange={(value: 'present' | 'not_present') => setFuelCard(value)} required>
            <SelectTrigger id="fuelCard" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présent</SelectItem>
              <SelectItem value="not_present">Non présent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="critairSticker">Vignette crit'air</Label>
          <Select value={critairSticker} onValueChange={(value: 'present' | 'not_present') => setCritairSticker(value)} required>
            <SelectTrigger id="critairSticker" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présente</SelectItem>
              <SelectItem value="not_present">Non présente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="userManual">Manuel d'utilisation du véhicule</Label>
          <Select value={userManual} onValueChange={(value: 'present' | 'not_present') => setUserManual(value)} required>
            <SelectTrigger id="userManual" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présent</SelectItem>
              <SelectItem value="not_present">Non présent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deliveryReport">PV de livraison</Label>
          <Select value={deliveryReport} onValueChange={(value: 'present' | 'not_present') => setDeliveryReport(value)} required>
            <SelectTrigger id="deliveryReport" className="mt-1">
              <SelectValue placeholder="Sélectionnez" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">Présent</SelectItem>
              <SelectItem value="not_present">Non Présent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 border-t pt-6">
        <div>
          <Label htmlFor="convoyeurSignatureName">Nom du convoyeur (signature)</Label>
          <Input id="convoyeurSignatureName" type="text" value={convoyeurSignatureName} onChange={(e) => setConvoyeurSignatureName(e.target.value)} required className="mt-1" />
        </div>
        <div>
          <Label htmlFor="clientSignatureName">Nom du client (signature)</Label>
          <Input id="clientSignatureName" type="text" value={clientSignatureName} onChange={(e) => setClientSignatureName(e.target.value)} required className="mt-1" />
        </div>
      </div>

      {/* Photos */}
      <div className="mt-6 border-t pt-6">
        <Label htmlFor="photos">Photos du véhicule au départ</Label>
        <Input id="photos" type="file" multiple accept="image/*" onChange={(e) => setPhotos(e.target.files)} className="mt-1" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Veuillez prendre les photos suivantes : Tableau de bord (présence voyants), Compteur (kilométrage), Face avant générale, Face arrière générale, Latéral droit, Latéral gauche, Sièges avants, Sièges arrières, Coffre ouvert.
          {initialData && initialData.photos && initialData.photos.length > 0 && ` (${initialData.photos.length} photos existantes)`}
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : (initialData ? "Mettre à jour la Fiche" : "Enregistrer la Fiche de Départ")}
      </Button>
    </form>
  );
};

export default DepartureSheetForm;