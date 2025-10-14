import React, { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// 1. Définition du type Mission (adapté à la table Supabase)
export type MissionUpdate = {
  timestamp: string;
  comment: string | null;
  photos: string[] | null; // URLs des photos
};

export type Expense = {
  id: string; // UUID for each expense
  type: string; // e.g., "Péage", "Carburant", "Repas"
  amount: number;
  description?: string;
  photo_url: string | null; // URL of the uploaded photo
  timestamp: string; // ISO string
};

// NEW: Define DepartureSheet type
export type DepartureSheet = {
  id: string;
  mission_id: string;
  created_at: string;
  mileage: number;
  fuel_level: number; // Changed from string to number (rating 1-8)
  interior_cleanliness: number; // Changed from string to number (rating 1-8)
  exterior_cleanliness: number; // Changed from string to number (rating 1-8)
  general_condition: string; // Remains string (Textarea)
  convoyeur_signature_name: string;
  client_signature_name: string;
  photos: string[];
  weather_conditions: string | null; // NEW: Add weather conditions field
  pickup_location_type: string | null; // NEW
  sd_card_cd_dvd: string | null; // NEW
  antenna: string | null; // NEW
  spare_tire_kit: string | null; // NEW
  safety_kit: string | null; // NEW
  number_of_keys: number | null; // NEW
  front_floor_mats: string | null; // NEW
  rear_floor_mats: string | null; // NEW
  registration_card: string | null; // NEW
  fuel_card: string | null; // NEW
  critair_sticker: string | null; // NEW
  user_manual: string | null; // NEW
  delivery_report: string | null; // NEW
};

// NEW: Define ArrivalSheet type
export type ArrivalSheet = {
  id: string;
  mission_id: string;
  created_at: string;
  mileage: number;
  fuel_level: number; // Changed from string to number (rating 1-8)
  interior_cleanliness: number; // Changed from string to number (rating 1-8)
  exterior_cleanliness: number; // Changed from string to number (rating 1-8)
  general_condition: string; // Remains string (Textarea)
  convoyeur_signature_name: string;
  client_signature_name: string;
  photos: string[];
  weather_conditions: string | null; // NEW: Add weather conditions field
  pickup_location_type: string | null; // NEW
  sd_card_cd_dvd: string | null; // NEW
  antenna: string | null; // NEW
  spare_tire_kit: string | null; // NEW
  safety_kit: string | null; // NEW
  number_of_keys: number | null; // NEW
  front_floor_mats: string | null; // NEW
  rear_floor_mats: string | null; // NEW
  registration_card: string | null; // NEW
  fuel_card: string | null; // NEW
  critair_sticker: string | null; // NEW
  user_manual: string | null; // NEW
  delivery_report: string | null; // NEW
};

export type Mission = {
  id: string;
  created_at: string;
  immatriculation: string;
  modele: string;
  lieu_depart: string;
  lieu_arrivee: string;
  statut: 'Disponible' | 'en attente' | 'en cours' | 'livrée'; // Statuts de la DB
  client_id: string | null; // Renommé de concessionnaire_id à client_id
  convoyeur_id: string | null;
  convoyeur_first_name?: string | null; // Nouveau champ pour le prénom du convoyeur
  convoyeur_last_name?: string | null;  // Nouveau champ pour le nom du convoyeur
  convoyeur_avatar_url?: string | null; // NEW: Add convoyeur_avatar_url
  heureLimite: string; // ISO string, from DB heure_limite
  commentaires?: string | null; // This will become deprecated, replaced by updates
  photos?: string[] | null; // This will become deprecated, replaced by updates
  client_price?: number | null; // NEW: Price paid by the client
  convoyeur_payout?: number | null; // RENAMED: Payout for the convoyeur
  updates?: MissionUpdate[] | null; // New field for step-by-step updates
  expenses?: Expense[] | null; // NEW: Add expenses array
  is_paid: boolean; // NEW: Add is_paid status
  is_hors_grille: boolean; // NEW: Add is_hors_grille status
  client_price_approved?: boolean | null; // NEW: Client approval for price
  departure_details?: DepartureSheet | null; // NEW: Link departure sheet
  arrival_details?: ArrivalSheet | null; // NEW: Link arrival sheet
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'client' | 'convoyeur' | 'admin' | null;
  phone: string | null;
  company_type: string | null;
  siret: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  date_of_birth: string | null;
  languages: string[] | null;
  driver_license_number: string | null;
  license_issue_date: string | null;
  license_issue_city: string | null;
  is_profile_complete: boolean;
  avatar_url: string | null; // NEW: Add avatar_url to Profile type
};

type UpdateMissionPayload = Partial<Omit<Mission, 'id' | 'created_at' | 'departure_details' | 'arrival_details'>>; // Removed departure_details and arrival_details
type UpdateProfilePayload = Partial<Omit<Profile, 'id' | 'role'>>; // Exclude 'role' from updatable fields

// Define a base type for sheet data that can be inserted/updated
type BaseSheetData = {
  mileage: number;
  fuel_level: number;
  interior_cleanliness: number;
  exterior_cleanliness: number;
  general_condition: string;
  convoyeur_signature_name: string;
  client_signature_name: string;
  weather_conditions: string | null; // NEW: Include weather_conditions
  pickup_location_type: string | null; // NEW
  sd_card_cd_dvd: string | null; // NEW
  antenna: string | null; // NEW
  spare_tire_kit: string | null; // NEW
  safety_kit: string | null; // NEW
  number_of_keys: number | null; // NEW
  front_floor_mats: string | null; // NEW
  rear_floor_mats: string | null; // NEW
  registration_card: string | null; // NEW
  fuel_card: string | null; // NEW
  critair_sticker: string | null; // NEW
  user_manual: string | null; // NEW
  delivery_report: string | null; // NEW
};

// 2. Définition du type du contexte
type MissionsContextType = {
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'client_price' | 'convoyeur_payout' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'is_hors_grille' | 'client_price_approved' | 'departure_details' | 'arrival_details' | 'convoyeur_avatar_url'> & { client_id: string }) => Promise<void>; // Mis à jour pour client_id
  updateMission: (id: string, payload: UpdateMissionPayload) => Promise<void>; // Generic update function
  updateProfile: (id: string, payload: UpdateProfilePayload) => Promise<void>; // NEW: Generic update function for profiles
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, finalComment: string | null, finalPhotos: FileList | null) => Promise<void>;
  addMissionUpdate: (missionId: string, comment: string | null, photos: FileList | null) => Promise<void>;
  uploadMissionPhotos: (missionId: string, files: FileList) => Promise<string[]>;
  uploadProfilePhoto: (userId: string, file: File) => Promise<string>; // NEW: Function to upload profile photo
  addMissionExpense: (missionId: string, type: string, amount: number, description: string | null, photoFile: File | null) => Promise<void>; // NEW: Function to add mission expense
  approveClientPrice: (missionId: string) => Promise<void>; // NEW: Function to approve client price
  
  // NEW: Functions for Departure and Arrival Sheets
  createDepartureSheet: (missionId: string, sheetData: BaseSheetData, photos: FileList | null) => Promise<void>;
  updateDepartureSheet: (sheetId: string, missionId: string, sheetData: BaseSheetData, newPhotos: FileList | null) => Promise<void>; // NEW
  createArrivalSheet: (missionId: string, sheetData: BaseSheetData, photos: FileList | null) => Promise<void>;
  updateArrivalSheet: (sheetId: string, missionId: string, sheetData: BaseSheetData, newPhotos: FileList | null) => Promise<void>; // NEW
  uploadSheetPhotos: (missionId: string, sheetType: 'departure' | 'arrival', files: FileList) => Promise<string[]>;
  
  // Hooks pour récupérer les missions et profils (maintenant avec refetch)
  useDepartureSheet: (missionId: string | undefined) => { sheet: DepartureSheet | null; isLoading: boolean; refetch: () => Promise<any>; };
  useArrivalSheet: (missionId: string | undefined) => { sheet: ArrivalSheet | null; isLoading: boolean; refetch: () => Promise<any>; };
  useClientMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; refetch: () => Promise<any>; };
  useAvailableMissions: () => { missions: Mission[] | undefined; isLoading: boolean; refetch: () => Promise<any>; };
  useConvoyeurMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; refetch: () => Promise<any>; };
  useMonthlyTurnover: (convoyeurId: string | undefined) => { turnover: number; isLoading: boolean; refetch: () => Promise<any>; };
  useAllMissions: () => { missions: Mission[] | undefined; isLoading: boolean; refetch: () => Promise<any>; }; // New hook for all missions
  useConvoyeurs: () => { profiles: Profile[] | undefined; isLoading: boolean; refetch: () => Promise<any>; }; // New hook for all convoyeurs
  useClients: () => { profiles: Profile[] | undefined; isLoading: boolean; refetch: () => Promise<any>; }; // New hook for all clients
};

// 3. Création du contexte
const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

// 4. Création du fournisseur de contexte (Provider)
export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Mutation for adding a mission
  const addMissionMutation = useMutation({
    mutationFn: async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'client_price' | 'convoyeur_payout' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'is_hors_grille' | 'client_price_approved' | 'departure_details' | 'arrival_details' | 'convoyeur_avatar_url'> & { client_id: string }) => { // Mis à jour pour client_id
      const { data, error } = await supabase.from('commandes').insert({
        immatriculation: missionData.immatriculation,
        modele: missionData.modele,
        lieu_depart: missionData.lieu_depart,
        lieu_arrivee: missionData.lieu_arrivee,
        heureLimite: missionData.heureLimite,
        client_id: missionData.client_id, // Mis à jour pour client_id
        statut: 'Disponible', // Default status for new missions
        client_price: null, // Initialize client_price as null
        convoyeur_payout: null, // Initialize convoyeur_payout as null
        updates: [], // Initialize updates as an empty array
        expenses: [], // Initialize expenses as an empty array
        is_paid: false, // NEW: Initialize is_paid to false
        is_hors_grille: false, // NEW: Initialize is_hors_grille to false
        client_price_approved: false, // NEW: Initialize client_price_approved to false
        // Removed departure_details and arrival_details from insert
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientMissions'] });
      queryClient.invalidateQueries({ queryKey: ['allMissions'] }); // Invalidate all missions for admin view
      showSuccess("Mission créée avec succès ✅");
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
      showError("Erreur lors de la création de la mission.");
    },
  });

  const addMission = async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'client_price' | 'convoyeur_payout' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'is_hors_grille' | 'client_price_approved' | 'departure_details' | 'arrival_details' | 'convoyeur_avatar_url'> & { client_id: string }) => { // Mis à jour pour client_id
    await addMissionMutation.mutateAsync(missionData);
  };

  // Generic mutation for updating any mission fields
  const updateMissionMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateMissionPayload }) => {
      const { data, error } = await supabase.from('commandes').update(payload).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allMissions'] });
      queryClient.invalidateQueries({ queryKey: ['availableMissions'] });
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] });
      queryClient.invalidateQueries({ queryKey: ['clientMissions'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyTurnover'] });
      queryClient.invalidateQueries({ queryKey: ['departureSheet'] }); // NEW
      queryClient.invalidateQueries({ queryKey: ['arrivalSheet'] }); // NEW
      showSuccess("Mission mise à jour avec succès !");
    },
    onError: (error) => {
      console.error("Error updating mission:", error);
      showError("Erreur lors de la mise à jour de la mission.");
    },
  });

  const updateMission = async (id: string, payload: UpdateMissionPayload) => {
    await updateMissionMutation.mutateAsync({ id, payload });
  };

  // NEW: Generic mutation for updating profile fields
  const updateProfileMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProfilePayload }) => {
      // Ensure 'role' is not updated
      const { role, ...updatablePayload } = payload;
      if (role !== undefined) {
        console.warn("Attempted to update 'role' field in profile, but role is immutable. Ignoring role update.");
      }
      const { data, error } = await supabase.from('profiles').update(updatablePayload).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurs'] }); // Invalidate convoyeurs for admin view
      queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalidate clients for admin view
      queryClient.invalidateQueries({ queryKey: ['profiles'] }); // Invalidate specific profile query if needed
      queryClient.invalidateQueries({ queryKey: ['clientMissions'] }); // Invalidate client missions to show updated convoyeur info
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] }); // Invalidate convoyeur missions to show updated convoyeur info
      showSuccess("Profil mis à jour avec succès !");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil.");
    },
  });

  const updateProfile = async (id: string, payload: UpdateProfilePayload) => {
    await updateProfileMutation.mutateAsync({ id, payload });
  };

  const takeMission = async (missionId: string, convoyeurId: string) => {
    await updateMission(missionId, { statut: 'en cours', convoyeur_id: convoyeurId });
  };

  const uploadMissionPhotos = async (missionId: string, files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `${missionId}/${uuidv4()}-${encodeURIComponent(file.name)}`; // Sanitize filename
      const { data, error } = await supabase.storage
        .from('mission-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error("Error uploading photo:", error);
        showError(`Erreur lors de l'upload de la photo ${file.name}.`);
        throw error;
      } else {
        const { data: publicUrlData } = supabase.storage.from('mission-photos').getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl);
      }
    }
    return uploadedUrls;
  };

  // NEW: Function to upload a single profile photo
  const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    // Normalize to NFD and remove diacritics (accents)
    const normalizedFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Replace problematic characters like spaces and apostrophes with hyphens
    const cleanedFileName = normalizedFileName.replace(/[' ]/g, '-');
    // Then encode the entire filename to handle any remaining special characters
    const sanitizedFileName = encodeURIComponent(cleanedFileName);
    const filePath = `avatars/${userId}/${uuidv4()}-${sanitizedFileName}`; // Unique path for each user's avatar
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Upsert to replace existing photo for the same user
      });

    if (error) {
      console.error("Error uploading profile photo:", error);
      showError(`Erreur lors de l'upload de la photo de profil.`);
      throw error;
    } else {
      const { data: publicUrlData } = supabase.storage.from('profile-photos').getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }
  };

  // NEW: Function to upload a single expense photo
  const uploadExpensePhoto = async (missionId: string, file: File): Promise<string> => {
    const normalizedFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanedFileName = normalizedFileName.replace(/[' ]/g, '-');
    const sanitizedFileName = encodeURIComponent(cleanedFileName);
    const filePath = `mission-expenses/${missionId}/${uuidv4()}-${sanitizedFileName}`;
    const { data, error } = await supabase.storage
      .from('mission-expenses')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error("Error uploading expense photo:", error);
      showError(`Erreur lors de l'upload de la photo de frais.`);
      throw error;
    } else {
      const { data: publicUrlData } = supabase.storage.from('mission-expenses').getPublicUrl(filePath);
      return publicUrlData.publicUrl;
    }
  };

  // NEW: Function to upload photos for departure/arrival sheets
  const uploadSheetPhotos = async (missionId: string, sheetType: 'departure' | 'arrival', files: FileList): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const normalizedFileName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const cleanedFileName = normalizedFileName.replace(/[' ]/g, '-');
      const sanitizedFileName = encodeURIComponent(cleanedFileName);
      const filePath = `${sheetType}-sheets/${missionId}/${uuidv4()}-${sanitizedFileName}`;
      const { data, error } = await supabase.storage
        .from('sheet-photos') // Assuming a new storage bucket for sheet photos
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`Error uploading ${sheetType} sheet photo:`, error);
        showError(`Erreur lors de l'upload de la photo de la fiche ${sheetType}.`);
        throw error;
      } else {
        const { data: publicUrlData } = supabase.storage.from('sheet-photos').getPublicUrl(filePath);
        uploadedUrls.push(publicUrlData.publicUrl); // Collect all URLs
      }
    }
    return uploadedUrls;
  };

  const addMissionUpdate = async (missionId: string, comment: string | null, photos: FileList | null) => {
    let photoUrls: string[] | null = null;
    if (photos && photos.length > 0) {
      try {
        photoUrls = await uploadMissionPhotos(missionId, photos);
      } catch (uploadError) {
        console.error("Failed to upload photos for mission update:", uploadError);
        showError("Échec de l'upload des photos pour la mise à jour.");
        return; // Stop if photo upload fails
      }
    }

    const newUpdate: MissionUpdate = {
      timestamp: new Date().toISOString(),
      comment: comment,
      photos: photoUrls,
    };

    // Fetch current updates, append new one, then update
    const { data: currentMission, error: fetchError } = await supabase
      .from('commandes')
      .select('updates')
      .eq('id', missionId)
      .single();

    if (fetchError) {
      console.error("Error fetching current mission updates:", fetchError);
      showError("Erreur lors de la récupération des mises à jour de la mission.");
      throw fetchError;
    }

    const existingUpdates = currentMission?.updates || [];
    const updatedUpdates = [...existingUpdates, newUpdate];

    await updateMission(missionId, { updates: updatedUpdates });
  };

  const addMissionExpense = async (missionId: string, type: string, amount: number, description: string | null, photoFile: File | null) => {
    let photoUrl: string | null = null;
    if (photoFile) {
      try {
        photoUrl = await uploadExpensePhoto(missionId, photoFile);
      } catch (uploadError) {
        console.error("Failed to upload expense photo:", uploadError);
        showError("Échec de l'upload de la photo de frais.");
        return;
      }
    }

    const newExpense: Expense = {
      id: uuidv4(),
      type: type,
      amount: amount,
      description: description,
      photo_url: photoUrl,
      timestamp: new Date().toISOString(),
    };

    const { data: currentMission, error: fetchError } = await supabase
      .from('commandes')
      .select('expenses')
      .eq('id', missionId)
      .single();

    if (fetchError) {
      console.error("Error fetching current mission expenses:", fetchError);
      showError("Erreur lors de la récupération des frais de la mission.");
      throw fetchError;
    }

    const existingExpenses = currentMission?.expenses || [];
    const updatedExpenses = [...existingExpenses, newExpense];

    await updateMission(missionId, { expenses: updatedExpenses });
  };

  const completeMission = async (missionId: string, finalComment: string | null, finalPhotos: FileList | null) => {
    // Add a final update entry
    await addMissionUpdate(missionId, finalComment, finalPhotos);
    // Then change the status to 'livrée'
    await updateMission(missionId, { statut: 'livrée' });
  };

  // NEW: Mutation for approving client price
  const approveClientPriceMutation = useMutation({
    mutationFn: async (missionId: string) => {
      const { data, error } = await supabase
        .from('commandes')
        .update({ client_price_approved: true })
        .eq('id', missionId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientMissions'] });
      queryClient.invalidateQueries({ queryKey: ['availableMissions'] });
      queryClient.invalidateQueries({ queryKey: ['allMissions'] });
      showSuccess("Prix de la mission approuvé avec succès !");
    },
    onError: (error) => {
      console.error("Error approving client price:", error);
      showError("Erreur lors de l'approbation du prix de la mission.");
    },
  });

  const approveClientPrice = async (missionId: string) => {
    await approveClientPriceMutation.mutateAsync(missionId);
  };

  // NEW: Mutation for creating a departure sheet
  const createDepartureSheetMutation = useMutation({
    mutationFn: async ({ missionId, sheetData, photos }: { missionId: string; sheetData: BaseSheetData; photos: FileList | null }) => {
      let photoUrls: string[] = [];
      if (photos && photos.length > 0) {
        photoUrls = await uploadSheetPhotos(missionId, 'departure', photos);
      }

      const { data, error } = await supabase.from('departure_sheets').insert({
        mission_id: missionId,
        mileage: sheetData.mileage,
        fuel_level: sheetData.fuel_level,
        interior_cleanliness: sheetData.interior_cleanliness,
        exterior_cleanliness: sheetData.exterior_cleanliness,
        general_condition: sheetData.general_condition,
        convoyeur_signature_name: sheetData.convoyeur_signature_name,
        client_signature_name: sheetData.client_signature_name,
        weather_conditions: sheetData.weather_conditions, // NEW: Add weather_conditions
        pickup_location_type: sheetData.pickup_location_type, // NEW
        sd_card_cd_dvd: sheetData.sd_card_cd_dvd, // NEW
        antenna: sheetData.antenna, // NEW
        spare_tire_kit: sheetData.spare_tire_kit, // NEW
        safety_kit: sheetData.safety_kit, // NEW
        number_of_keys: sheetData.number_of_keys, // NEW
        front_floor_mats: sheetData.front_floor_mats, // NEW
        rear_floor_mats: sheetData.rear_floor_mats, // NEW
        registration_card: sheetData.registration_card, // NEW
        fuel_card: sheetData.fuel_card, // NEW
        critair_sticker: sheetData.critair_sticker, // NEW
        user_manual: sheetData.user_manual, // NEW
        delivery_report: sheetData.delivery_report, // NEW
        photos: photoUrls,
      }).select().single(); // Select the inserted row to get its ID

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] });
      queryClient.invalidateQueries({ queryKey: ['departureSheet'] });
      showSuccess("Fiche de départ créée avec succès !");
    },
    onError: (error) => {
      console.error("Error creating departure sheet:", error);
      showError("Erreur lors de la création de la fiche de départ.");
    },
  });

  const createDepartureSheet = async (missionId: string, sheetData: BaseSheetData, photos: FileList | null) => {
    await createDepartureSheetMutation.mutateAsync({ missionId, sheetData, photos });
  };

  // NEW: Mutation for updating a departure sheet
  const updateDepartureSheetMutation = useMutation({
    mutationFn: async ({ sheetId, missionId, sheetData, newPhotos }: { sheetId: string; missionId: string; sheetData: BaseSheetData, newPhotos: FileList | null }) => {
      // 1. Fetch current sheet to get existing photos
      const { data: currentSheet, error: fetchError } = await supabase
        .from('departure_sheets')
        .select('photos')
        .eq('id', sheetId)
        .maybeSingle(); // Changed to maybeSingle()
      
      if (fetchError) {
        console.error("Error fetching current departure sheet for photo merge:", fetchError);
        throw fetchError;
      }

      let existingPhotoUrls: string[] = currentSheet?.photos || [];
      let uploadedNewPhotoUrls: string[] = [];

      // 2. If new photos are provided, upload them
      if (newPhotos && newPhotos.length > 0) {
        uploadedNewPhotoUrls = await uploadSheetPhotos(missionId, 'departure', newPhotos);
      }

      // 3. Combine existing photos with newly uploaded ones
      const combinedPhotoUrls = [...existingPhotoUrls, ...uploadedNewPhotoUrls];

      const { data, error } = await supabase.from('departure_sheets').update({
        ...sheetData,
        photos: combinedPhotoUrls, // Update with combined photos
      }).eq('id', sheetId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] });
      queryClient.invalidateQueries({ queryKey: ['departureSheet'] });
      showSuccess("Fiche de départ mise à jour avec succès !");
    },
    onError: (error) => {
      console.error("Error updating departure sheet:", error);
      showError("Erreur lors de la mise à jour de la fiche de départ.");
    },
  });

  const updateDepartureSheet = async (sheetId: string, missionId: string, sheetData: BaseSheetData, newPhotos: FileList | null) => {
    await updateDepartureSheetMutation.mutateAsync({ sheetId, missionId, sheetData, newPhotos });
  };

  // NEW: Mutation for creating an arrival sheet
  const createArrivalSheetMutation = useMutation({
    mutationFn: async ({ missionId, sheetData, photos }: { missionId: string; sheetData: BaseSheetData; photos: FileList | null }) => {
      let photoUrls: string[] = [];
      if (photos && photos.length > 0) {
        photoUrls = await uploadSheetPhotos(missionId, 'arrival', photos);
      }

      const { data, error } = await supabase.from('arrival_sheets').insert({
        mission_id: missionId,
        mileage: sheetData.mileage,
        fuel_level: sheetData.fuel_level,
        interior_cleanliness: sheetData.interior_cleanliness,
        exterior_cleanliness: sheetData.exterior_cleanliness,
        general_condition: sheetData.general_condition,
        convoyeur_signature_name: sheetData.convoyeur_signature_name,
        client_signature_name: sheetData.client_signature_name,
        weather_conditions: sheetData.weather_conditions, // NEW: Add weather_conditions
        pickup_location_type: sheetData.pickup_location_type, // NEW
        sd_card_cd_dvd: sheetData.sd_card_cd_dvd, // NEW
        antenna: sheetData.antenna, // NEW
        spare_tire_kit: sheetData.spare_tire_kit, // NEW
        safety_kit: sheetData.safety_kit, // NEW
        number_of_keys: sheetData.number_of_keys, // NEW
        front_floor_mats: sheetData.front_floor_mats, // NEW
        rear_floor_mats: sheetData.rear_floor_mats, // NEW
        registration_card: sheetData.registration_card, // NEW
        fuel_card: sheetData.fuel_card, // NEW
        critair_sticker: sheetData.critair_sticker, // NEW
        user_manual: sheetData.user_manual, // NEW
        delivery_report: sheetData.delivery_report, // NEW
        photos: photoUrls,
      }).select().single(); // Select the inserted row to get its ID

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] });
      queryClient.invalidateQueries({ queryKey: ['arrivalSheet'] });
      showSuccess("Fiche d'arrivée créée avec succès !");
    },
    onError: (error) => {
      console.error("Error creating arrival sheet:", error);
      showError("Erreur lors de la création de la fiche d'arrivée.");
    },
  });

  const createArrivalSheet = async (missionId: string, sheetData: BaseSheetData, photos: FileList | null) => {
    await createArrivalSheetMutation.mutateAsync({ missionId, sheetData, photos });
  };

  // NEW: Mutation for updating an arrival sheet
  const updateArrivalSheetMutation = useMutation({
    mutationFn: async ({ sheetId, missionId, sheetData, newPhotos }: { sheetId: string; missionId: string; sheetData: BaseSheetData, newPhotos: FileList | null }) => {
      // 1. Fetch current sheet to get existing photos
      const { data: currentSheet, error: fetchError } = await supabase
        .from('arrival_sheets')
        .select('photos')
        .eq('id', sheetId)
        .maybeSingle(); // Changed to maybeSingle()

      if (fetchError) {
        console.error("Error fetching current arrival sheet for photo merge:", fetchError);
        throw fetchError;
      }

      let existingPhotoUrls: string[] = currentSheet?.photos || [];
      let uploadedNewPhotoUrls: string[] = [];

      // 2. If new photos are provided, upload them
      if (newPhotos && newPhotos.length > 0) {
        uploadedNewPhotoUrls = await uploadSheetPhotos(missionId, 'arrival', newPhotos);
      }

      // 3. Combine existing photos with newly uploaded ones
      const combinedPhotoUrls = [...existingPhotoUrls, ...uploadedNewPhotoUrls];

      const { data, error } = await supabase.from('arrival_sheets').update({
        ...sheetData,
        photos: combinedPhotoUrls, // Update with combined photos
      }).eq('id', sheetId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] });
      queryClient.invalidateQueries({ queryKey: ['arrivalSheet'] });
      showSuccess("Fiche d'arrivée mise à jour avec succès !");
    },
    onError: (error) => {
      console.error("Error updating arrival sheet:", error);
      showError("Erreur lors de la mise à jour de la fiche d'arrivée.");
    },
  });

  const updateArrivalSheet = async (sheetId: string, missionId: string, sheetData: BaseSheetData, newPhotos: FileList | null) => {
    await updateArrivalSheetMutation.mutateAsync({ sheetId, missionId, sheetData, newPhotos });
  };

  // Hooks pour récupérer les missions
  const useClientMissions = (userId: string | undefined) => {
    const { data, isLoading, refetch } = useQuery<Mission[]>({
      queryKey: ['clientMissions', userId],
      queryFn: async () => {
        if (!userId) return [];
        // Join with profiles to get convoyeur's first_name and last_name
        const { data, error } = await supabase
          .from('commandes')
          .select('*, profiles!commandes_convoyeur_id_fkey(first_name, last_name, avatar_url), departure_sheets(*), arrival_sheets(*)') // Explicitly name the join for clarity
          .eq('client_id', userId); // Mis à jour pour client_id
        if (error) throw error;
        return data.map(m => ({
          id: m.id,
          created_at: m.created_at,
          immatriculation: m.immatriculation,
          modele: m.modele,
          lieu_depart: m.lieu_depart,
          lieu_arrivee: m.lieu_arrivee,
          statut: m.statut,
          client_id: m.client_id, // Mis à jour pour client_id
          convoyeur_id: m.convoyeur_id,
          // Map joined profile data to new fields
          convoyeur_first_name: m.profiles?.first_name || null,
          convoyeur_last_name: m.profiles?.last_name || null,
          convoyeur_avatar_url: m.profiles?.avatar_url || null, // NEW: Map avatar_url
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          is_hors_grille: m.is_hors_grille, // NEW: Include is_hors_grille
          client_price_approved: m.client_price_approved, // NEW: Include client_price_approved
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
        }));
      },
      enabled: !!userId,
    });
    return { missions: data, isLoading, refetch };
  };

  const useAvailableMissions = () => {
    const { data, isLoading, refetch } = useQuery<Mission[]>({
      queryKey: ['availableMissions'],
      queryFn: async () => {
        // Logic for available missions:
        // 1. Status must be 'Disponible'
        // 2. EITHER:
        //    a) Not 'hors grille' AND convoyeur_payout is set AND is_paid is true
        //    OR
        //    b) Is 'hors grille' AND client_price is set (validated by client) AND client_price_approved is true
        const { data, error } = await supabase
          .from('commandes')
          .select('*, departure_sheets(*), arrival_sheets(*)')
          .eq('statut', 'Disponible')
          .or('and(is_hors_grille.eq.false,convoyeur_payout.not.is.null,is_paid.eq.true),and(is_hors_grille.eq.true,client_price.not.is.null,client_price_approved.eq.true)');
        
        if (error) throw error;
        return data.map(m => ({
          id: m.id,
          created_at: m.created_at,
          immatriculation: m.immatriculation,
          modele: m.modele,
          lieu_depart: m.lieu_depart,
          lieu_arrivee: m.lieu_arrivee,
          statut: m.statut,
          client_id: m.client_id, // Mis à jour pour client_id
          convoyeur_id: m.convoyeur_id,
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          is_hors_grille: m.is_hors_grille, // NEW: Include is_hors_grille
          client_price_approved: m.client_price_approved, // NEW: Include client_price_approved
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
        }));
      },
    });
    return { missions: data, isLoading, refetch };
  };

  const useConvoyeurMissions = (userId: string | undefined) => {
    const { data, isLoading, refetch } = useQuery<Mission[]>({
      queryKey: ['convoyeurMissions', userId],
      queryFn: async () => {
        if (!userId) return [];
        const { data: missionsData, error: missionsError } = await supabase
          .from('commandes')
          .select('*, profiles!commandes_convoyeur_id_fkey(first_name, last_name, avatar_url)') // Select profile data for convoyeur
          .eq('convoyeur_id', userId)
          .in('statut', ['en cours', 'livrée'])
          .eq('is_paid', true); // NEW: Only show if paid
        
        if (missionsError) throw missionsError;

        // Explicitly fetch departure and arrival sheets for each mission
        const missionsWithSheets = await Promise.all(missionsData.map(async (m) => {
          const { data: departureSheet, error: depError } = await supabase
            .from('departure_sheets')
            .select('*')
            .eq('mission_id', m.id)
            .maybeSingle(); // Changed to maybeSingle()
          if (depError && depError.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error(`useConvoyeurMissions: Error fetching individual departure sheet for mission ${m.id}:`, depError);
          }
          console.log(`useConvoyeurMissions: Departure sheet for mission ${m.id} found:`, !!departureSheet);

          const { data: arrivalSheet, error: arrError } = await supabase
            .from('arrival_sheets')
            .select('*')
            .eq('mission_id', m.id)
            .maybeSingle(); // Changed to maybeSingle()
          if (arrError && arrError.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error(`useConvoyeurMissions: Error fetching individual arrival sheet for mission ${m.id}:`, arrError);
          }
          console.log(`useConvoyeurMissions: Arrival sheet for mission ${m.id} found:`, !!arrivalSheet);

          return {
            id: m.id,
            created_at: m.created_at,
            immatriculation: m.immatriculation,
            modele: m.modele,
            lieu_depart: m.lieu_depart,
            lieu_arrivee: m.lieu_arrivee,
            statut: m.statut,
            client_id: m.client_id, // Mis à jour pour client_id
            convoyeur_id: m.convoyeur_id,
            convoyeur_first_name: m.profiles?.first_name || null, // Map joined profile data
            convoyeur_last_name: m.profiles?.last_name || null, // Map joined profile data
            convoyeur_avatar_url: m.profiles?.avatar_url || null, // NEW: Map avatar_url
            heureLimite: m.heureLimite,
            commentaires: m.commentaires,
            photos: m.photos,
            client_price: m.client_price, // Include client_price
            convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
            updates: m.updates,
            expenses: m.expenses, // Include expenses
            is_paid: m.is_paid, // Include is_paid
            is_hors_grille: m.is_hors_grille, // NEW: Include is_hors_grille
            client_price_approved: m.client_price_approved, // NEW: Include client_price_approved
            departure_details: departureSheet || null, // Use the individually fetched sheet
            arrival_details: arrivalSheet || null, // Use the individually fetched sheet
          };
        }));
        return missionsWithSheets;
      },
      enabled: !!userId,
    });
    return { missions: data, isLoading, refetch };
  };

  const useMonthlyTurnover = (convoyeurId: string | undefined) => {
    const { data, isLoading, refetch } = useQuery<number>({
      queryKey: ['monthlyTurnover', convoyeurId],
      queryFn: async () => {
        if (!convoyeurId) return 0;
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        const { data, error } = await supabase
          .from('commandes')
          .select('convoyeur_payout, created_at') // Use convoyeur_payout
          .eq('convoyeur_id', convoyeurId)
          .eq('statut', 'livrée')
          .eq('is_paid', true) // NEW: Only count paid missions for turnover
          .gte('created_at', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00Z`)
          .lt('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00Z`);

        if (error) {
          console.error("Error fetching monthly turnover:", error);
          throw error;
        }

        return data.reduce((sum, mission) => sum + (mission.convoyeur_payout || 0), 0);
      },
      enabled: !!convoyeurId,
    });
    return { turnover: data || 0, isLoading, refetch };
  };

  // New hook to fetch all missions for admin
  const useAllMissions = () => {
    const { data, isLoading, refetch } = useQuery<Mission[]>({
      queryKey: ['allMissions'],
      queryFn: async () => {
        // Join with profiles to get convoyeur's first_name and last_name
        const { data, error } = await supabase.from('commandes').select('*, profiles!commandes_convoyeur_id_fkey(first_name, last_name, avatar_url), departure_sheets(*), arrival_sheets(*)');
        if (error) throw error;
        return data.map(m => ({
          id: m.id,
          created_at: m.created_at,
          immatriculation: m.immatriculation,
          modele: m.modele,
          lieu_depart: m.lieu_depart,
          lieu_arrivee: m.lieu_arrivee,
          statut: m.statut,
          client_id: m.client_id, // Mis à jour pour client_id
          convoyeur_id: m.convoyeur_id,
          // Map joined profile data to new fields
          convoyeur_first_name: m.profiles?.first_name || null,
          convoyeur_last_name: m.profiles?.last_name || null,
          convoyeur_avatar_url: m.profiles?.avatar_url || null, // NEW: Map avatar_url
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          is_hors_grille: m.is_hors_grille, // NEW: Include is_hors_grille
          client_price_approved: m.client_price_approved, // NEW: Include client_price_approved
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
        }));
      },
    });
    return { missions: data, isLoading, refetch };
  };

  // New hook to fetch all convoyeur profiles
  const useConvoyeurs = () => {
    const { data, isLoading, refetch } = useQuery<Profile[]>({
      queryKey: ['convoyeurs'],
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'convoyeur');
        if (error) throw error;
        return data;
      },
    });
    return { profiles: data, isLoading, refetch };
  };

  // New hook to fetch all client profiles
  const useClients = () => {
    const { data, isLoading, refetch } = useQuery<Profile[]>({
      queryKey: ['clients'],
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'client');
        if (error) throw error;
        return data;
      },
    });
    return { profiles: data, isLoading, refetch };
  };

  // NEW: Hook to fetch a specific departure sheet
  const useDepartureSheet = (missionId: string | undefined) => {
    const { data, isLoading, refetch } = useQuery<DepartureSheet | null>({
      queryKey: ['departureSheet', missionId],
      queryFn: async () => {
        if (!missionId) {
          console.log(`useDepartureSheet: No missionId provided.`);
          return null;
        }
        const { data, error } = await supabase
          .from('departure_sheets')
          .select('*')
          .eq('mission_id', missionId)
          .maybeSingle(); // Changed to maybeSingle()
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error(`useDepartureSheet: Error fetching sheet for mission ${missionId}:`, error);
          throw error;
        }
        console.log(`useDepartureSheet: Sheet for mission ${missionId} found:`, !!data);
        return data || null;
      },
      enabled: !!missionId,
    });
    return { sheet: data, isLoading, refetch };
  };

  // NEW: Hook to fetch a specific arrival sheet
  const useArrivalSheet = (missionId: string | undefined) => {
    const { data, isLoading, refetch } = useQuery<ArrivalSheet | null>({
      queryKey: ['arrivalSheet', missionId],
      queryFn: async () => {
        if (!missionId) {
          console.log(`useArrivalSheet: No missionId provided.`);
          return null;
        }
        const { data, error } = await supabase
          .from('arrival_sheets')
          .select('*')
          .eq('mission_id', missionId)
          .maybeSingle(); // Changed to maybeSingle()
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error(`useArrivalSheet: Error fetching sheet for mission ${missionId}:`, error);
          throw error;
        }
        console.log(`useArrivalSheet: Sheet for mission ${missionId} found:`, !!data);
        return data || null;
      },
      enabled: !!missionId,
    });
    return { sheet: data, isLoading, refetch };
  };


  const contextValue = useMemo(() => ({
    addMission,
    updateMission, // Use the new generic update
    updateProfile, // NEW
    takeMission,
    completeMission,
    addMissionUpdate,
    uploadMissionPhotos,
    uploadProfilePhoto, // NEW
    addMissionExpense, // NEW
    approveClientPrice, // NEW
    createDepartureSheet, // NEW
    updateDepartureSheet, // NEW
    createArrivalSheet, // NEW
    updateArrivalSheet, // NEW
    uploadSheetPhotos, // NEW
    useDepartureSheet, // NEW
    useArrivalSheet, // NEW
    useClientMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
    useAllMissions,
    useConvoyeurs,
    useClients,
  }), [
    addMission,
    updateMission,
    updateProfile,
    takeMission,
    completeMission,
    addMissionUpdate,
    uploadMissionPhotos,
    uploadProfilePhoto,
    addMissionExpense, // NEW
    approveClientPrice, // NEW
    createDepartureSheet, // NEW
    updateDepartureSheet, // NEW
    createArrivalSheet, // NEW
    updateArrivalSheet, // NEW
    uploadSheetPhotos, // NEW
    useDepartureSheet, // NEW
    useArrivalSheet, // NEW
    useClientMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
    useAllMissions,
    useConvoyeurs,
    useClients,
  ]);

  return (
    <MissionsContext.Provider value={contextValue}>
      {children}
    </MissionsContext.Provider>
  );
};

// 5. Création du hook useMissions
export const useMissions = () => {
  const context = useContext(MissionsContext);
  if (context === undefined) {
    throw new Error('useMissions must be used within a MissionsProvider');
  }
  return context;
};