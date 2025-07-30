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
  heureLimite: string; // ISO string, from DB heure_limite
  commentaires?: string | null; // This will become deprecated, replaced by updates
  photos?: string[] | null; // This will become deprecated, replaced by updates
  client_price?: number | null; // NEW: Price paid by the client
  convoyeur_payout?: number | null; // RENAMED: Payout for the convoyeur
  updates?: MissionUpdate[] | null; // New field for step-by-step updates
  expenses?: Expense[] | null; // NEW: Add expenses array
  is_paid: boolean; // NEW: Add is_paid status
  departure_details?: DepartureSheet | null; // NEW: Link departure sheet
  arrival_details?: ArrivalSheet | null; // NEW: Link arrival sheet
  client_profile?: Profile | null; // NEW: Client's full profile
  convoyeur_profile?: Profile | null; // NEW: Convoyeur's full profile
};

type UpdateMissionPayload = Partial<Omit<Mission, 'id' | 'created_at'>>;
type UpdateProfilePayload = Partial<Omit<Profile, 'id'>>;

// 2. Définition du type du contexte
type MissionsContextType = {
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'departure_details' | 'arrival_details' | 'client_profile' | 'convoyeur_profile'> & { client_id: string, client_price: number, convoyeur_payout: number }) => Promise<void>; // Mis à jour pour client_id et les nouveaux prix
  updateMission: (id: string, payload: UpdateMissionPayload) => Promise<void>; // Generic update function
  updateProfile: (id: string, payload: UpdateProfilePayload) => Promise<void>; // NEW: Generic update function for profiles
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, finalComment: string | null, finalPhotos: FileList | null) => Promise<void>;
  addMissionUpdate: (missionId: string, comment: string | null, photos: FileList | null) => Promise<void>;
  uploadMissionPhotos: (missionId: string, files: FileList) => Promise<string[]>;
  uploadProfilePhoto: (userId: string, file: File) => Promise<string>; // NEW: Function to upload profile photo
  addMissionExpense: (missionId: string, type: string, amount: number, description: string | null, photoFile: File | null) => Promise<void>; // NEW: Function to add mission expense
  
  // NEW: Functions for Departure and Arrival Sheets
  createDepartureSheet: (missionId: string, sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => Promise<void>;
  updateDepartureSheet: (sheetId: string, missionId: string, sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => Promise<void>; // NEW
  createArrivalSheet: (missionId: string, sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => Promise<void>;
  updateArrivalSheet: (sheetId: string, missionId: string, sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => Promise<void>; // NEW
  uploadSheetPhotos: (missionId: string, sheetType: 'departure' | 'arrival', files: FileList) => Promise<string[]>;
  useDepartureSheet: (missionId: string | undefined) => { sheet: DepartureSheet | null; isLoading: boolean; };
  useArrivalSheet: (missionId: string | undefined) => { sheet: ArrivalSheet | null; isLoading: boolean; };

  // Hooks pour récupérer les missions et profils
  useClientMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useAvailableMissions: () => { missions: Mission[] | undefined; isLoading: boolean; };
  useConvoyeurMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useMonthlyTurnover: (convoyeurId: string | undefined) => { turnover: number; isLoading: boolean; };
  useAllMissions: () => { missions: Mission[] | undefined; isLoading: boolean; }; // New hook for all missions
  useConvoyeurs: () => { profiles: Profile[] | undefined; isLoading: boolean; }; // New hook for all convoyeurs
  useClients: () => { profiles: Profile[] | undefined; isLoading: boolean; }; // New hook for all clients
};

// 3. Création du contexte
const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

// 4. Création du fournisseur de contexte (Provider)
export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Mutation for adding a mission
  const addMissionMutation = useMutation({
    mutationFn: async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'departure_details' | 'arrival_details' | 'client_profile' | 'convoyeur_profile'> & { client_id: string, client_price: number, convoyeur_payout: number }) => { // Mis à jour pour client_id
      const { data, error } = await supabase.from('commandes').insert({
        immatriculation: missionData.immatriculation,
        modele: missionData.modele,
        lieu_depart: missionData.lieu_depart,
        lieu_arrivee: missionData.lieu_arrivee,
        heureLimite: missionData.heureLimite,
        client_id: missionData.client_id, // Mis à jour pour client_id
        statut: 'Disponible', // Default status for new missions
        client_price: missionData.client_price, // NEW: Use provided client_price
        convoyeur_payout: missionData.convoyeur_payout, // NEW: Use provided convoyeur_payout
        updates: [], // Initialize updates as an empty array
        expenses: [], // Initialize expenses as an empty array
        is_paid: false, // NEW: Initialize is_paid to false
        departure_details: null, // NEW: Initialize departure_details
        arrival_details: null, // NEW: Initialize arrival_details
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientMissions'] });
      queryClient.invalidateQueries({ queryKey: ['allMissions'] }); // Invalidate all missions for admin view
      queryClient.invalidateQueries({ queryKey: ['availableMissions'] }); // Invalidate available missions
      showSuccess("Mission créée avec succès ✅");
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
      showError("Erreur lors de la création de la mission.");
    },
  });

  const addMission = async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name' | 'expenses' | 'is_paid' | 'departure_details' | 'arrival_details' | 'client_profile' | 'convoyeur_profile'> & { client_id: string, client_price: number, convoyeur_payout: number }) => { // Mis à jour pour client_id
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
      const { data, error } = await supabase.from('profiles').update(payload).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['convoyeurs'] }); // Invalidate convoyeurs for admin view
      queryClient.invalidateQueries({ queryKey: ['clients'] }); // Invalidate clients for admin view
      queryClient.invalidateQueries({ queryKey: ['profiles'] }); // Invalidate specific profile query if needed
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

  // NEW: Mutation for creating a departure sheet
  const createDepartureSheetMutation = useMutation({
    mutationFn: async ({ missionId, sheetData, photos }: { missionId: string; sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>; photos: FileList | null }) => {
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
        photos: photoUrls,
      }).select().single(); // Select the inserted row to get its ID

      if (error) throw error;

      // Update the mission with the departure_details
      await updateMission(missionId, { departure_details: data });
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

  const createDepartureSheet = async (missionId: string, sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => {
    await createDepartureSheetMutation.mutateAsync({ missionId, sheetData, photos });
  };

  // NEW: Mutation for updating a departure sheet
  const updateDepartureSheetMutation = useMutation({
    mutationFn: async ({ sheetId, missionId, sheetData, photos }: { sheetId: string; missionId: string; sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>; photos: FileList | null }) => {
      let photoUrls: string[] = sheetData.photos || []; // Start with existing photos if any
      if (photos && photos.length > 0) {
        const newPhotos = await uploadSheetPhotos(missionId, 'departure', photos);
        photoUrls = [...photoUrls, ...newPhotos]; // Append new photos
      }

      const { data, error } = await supabase.from('departure_sheets').update({ ...sheetData, photos: photoUrls }).eq('id', sheetId).select().single();
      if (error) throw error;

      await updateMission(missionId, { departure_details: data });
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

  const updateDepartureSheet = async (sheetId: string, missionId: string, sheetData: Omit<DepartureSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => {
    await updateDepartureSheetMutation.mutateAsync({ sheetId, missionId, sheetData, photos });
  };

  // NEW: Mutation for creating an arrival sheet
  const createArrivalSheetMutation = useMutation({
    mutationFn: async ({ missionId, sheetData, photos }: { missionId: string; sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>; photos: FileList | null }) => {
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
        photos: photoUrls,
      }).select().single(); // Select the inserted row to get its ID

      if (error) throw error;

      // Update the mission with the arrival_details
      await updateMission(missionId, { arrival_details: data });
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

  const createArrivalSheet = async (missionId: string, sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => {
    await createArrivalSheetMutation.mutateAsync({ missionId, sheetData, photos });
  };

  // NEW: Mutation for updating an arrival sheet
  const updateArrivalSheetMutation = useMutation({
    mutationFn: async ({ sheetId, missionId, sheetData, photos }: { sheetId: string; missionId: string; sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>; photos: FileList | null }) => {
      let photoUrls: string[] = sheetData.photos || []; // Start with existing photos if any
      if (photos && photos.length > 0) {
        const newPhotos = await uploadSheetPhotos(missionId, 'arrival', photos);
        photoUrls = [...photoUrls, ...newPhotos]; // Append new photos
      }

      const { data, error } = await supabase.from('arrival_sheets').update({ ...sheetData, photos: photoUrls }).eq('id', sheetId).select().single();
      if (error) throw error;

      await updateMission(missionId, { arrival_details: data });
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

  const updateArrivalSheet = async (sheetId: string, missionId: string, sheetData: Omit<ArrivalSheet, 'id' | 'created_at' | 'mission_id' | 'photos'>, photos: FileList | null) => {
    await updateArrivalSheetMutation.mutateAsync({ sheetId, missionId, sheetData, photos });
  };

  // Hooks pour récupérer les missions
  const useClientMissions = (userId: string | undefined) => {
    const { data, isLoading } = useQuery<Mission[]>({
      queryKey: ['clientMissions', userId],
      queryFn: async () => {
        if (!userId) return [];
        // Join with profiles to get convoyeur's first_name and last_name
        const { data, error } = await supabase
          .from('commandes')
          .select('*, departure_sheets(*), arrival_sheets(*), client_profile:profiles!commandes_client_id_fkey(*), convoyeur_profile:profiles!commandes_convoyeur_id_fkey(*)') // Explicitly name the join for clarity
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
          convoyeur_first_name: m.convoyeur_profile?.first_name || null, // Use convoyeur_profile
          convoyeur_last_name: m.convoyeur_profile?.last_name || null,  // Use convoyeur_profile
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
          client_profile: m.client_profile || null, // NEW: Map client profile
          convoyeur_profile: m.convoyeur_profile || null, // NEW: Map convoyeur profile
        }));
      },
      enabled: !!userId,
    });
    return { missions: data, isLoading };
  };

  const useAvailableMissions = () => {
    const { data, isLoading } = useQuery<Mission[]>({
      queryKey: ['availableMissions'],
      queryFn: async () => {
        // Only fetch missions where convoyeur_payout is not null AND is_paid is true
        const { data, error } = await supabase.from('commandes').select('*, departure_sheets(*), arrival_sheets(*), client_profile:profiles!commandes_client_id_fkey(*), convoyeur_profile:profiles!commandes_convoyeur_id_fkey(*)')
        .eq('statut', 'Disponible').not('convoyeur_payout', 'is', null).eq('is_paid', true);
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
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
          client_profile: m.client_profile || null, // NEW: Map client profile
          convoyeur_profile: m.convoyeur_profile || null, // NEW: Map convoyeur profile
        }));
      },
    });
    return { missions: data, isLoading };
  };

  const useConvoyeurMissions = (userId: string | undefined) => {
    const { data, isLoading } = useQuery<Mission[]>({
      queryKey: ['convoyeurMissions', userId],
      queryFn: async () => {
        if (!userId) return [];
        const { data, error } = await supabase
          .from('commandes')
          .select('*, departure_sheets(*), arrival_sheets(*), client_profile:profiles!commandes_client_id_fkey(*), convoyeur_profile:profiles!commandes_convoyeur_id_fkey(*)') // Select profile data for convoyeur
          .eq('convoyeur_id', userId)
          .in('statut', ['en cours', 'livrée'])
          .eq('is_paid', true); // NEW: Only show if paid
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
          convoyeur_first_name: m.convoyeur_profile?.first_name || null, // Use convoyeur_profile
          convoyeur_last_name: m.convoyeur_profile?.last_name || null, // Use convoyeur_profile
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
          client_profile: m.client_profile || null, // NEW: Map client profile
          convoyeur_profile: m.convoyeur_profile || null, // NEW: Map convoyeur profile
        }));
      },
      enabled: !!userId,
    });
    return { missions: data, isLoading };
  };

  const useMonthlyTurnover = (convoyeurId: string | undefined) => {
    const { data, isLoading } = useQuery<number>({
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
    return { turnover: data || 0, isLoading };
  };

  // New hook to fetch all missions for admin
  const useAllMissions = () => {
    const { data, isLoading } = useQuery<Mission[]>({
      queryKey: ['allMissions'],
      queryFn: async () => {
        // Join with profiles to get convoyeur's first_name and last_name
        const { data, error } = await supabase.from('commandes').select('*, departure_sheets(*), arrival_sheets(*), client_profile:profiles!commandes_client_id_fkey(*), convoyeur_profile:profiles!commandes_convoyeur_id_fkey(*)');
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
          convoyeur_first_name: m.convoyeur_profile?.first_name || null, // Use convoyeur_profile
          convoyeur_last_name: m.convoyeur_profile?.last_name || null, // Use convoyeur_profile
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          client_price: m.client_price, // Include client_price
          convoyeur_payout: m.convoyeur_payout, // Include convoyeur_payout
          updates: m.updates,
          expenses: m.expenses, // Include expenses
          is_paid: m.is_paid, // Include is_paid
          departure_details: m.departure_sheets?.[0] || null, // NEW: Map departure sheet
          arrival_details: m.arrival_sheets?.[0] || null, // NEW: Map arrival sheet
          client_profile: m.client_profile || null, // NEW: Map client profile
          convoyeur_profile: m.convoyeur_profile || null, // NEW: Map convoyeur profile
        }));
      },
    });
    return { missions: data, isLoading };
  };

  // New hook to fetch all convoyeur profiles
  const useConvoyeurs = () => {
    const { data, isLoading } = useQuery<Profile[]>({
      queryKey: ['convoyeurs'],
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'convoyeur');
        if (error) throw error;
        return data;
      },
    });
    return { profiles: data, isLoading };
  };

  // New hook to fetch all client profiles
  const useClients = () => {
    const { data, isLoading } = useQuery<Profile[]>({
      queryKey: ['clients'],
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'client');
        if (error) throw error;
        return data;
      },
    });
    return { profiles: data, isLoading };
  };

  // NEW: Hook to fetch a specific departure sheet
  const useDepartureSheet = (missionId: string | undefined) => {
    const { data, isLoading } = useQuery<DepartureSheet | null>({
      queryKey: ['departureSheet', missionId],
      queryFn: async () => {
        if (!missionId) return null;
        const { data, error } = await supabase
          .from('departure_sheets')
          .select('*')
          .eq('mission_id', missionId)
          .single();
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("Error fetching departure sheet:", error);
          throw error;
        }
        return data || null;
      },
      enabled: !!missionId,
    });
    return { sheet: data, isLoading };
  };

  // NEW: Hook to fetch a specific arrival sheet
  const useArrivalSheet = (missionId: string | undefined) => {
    const { data, isLoading } = useQuery<ArrivalSheet | null>({
      queryKey: ['arrivalSheet', missionId],
      queryFn: async () => {
        if (!missionId) return null;
        const { data, error } = await supabase
          .from('arrival_sheets')
          .select('*')
          .eq('mission_id', missionId)
          .single();
        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
          console.error("Error fetching arrival sheet:", error);
          throw error;
        }
        return data || null;
      },
      enabled: !!missionId,
    });
    return { sheet: data, isLoading };
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