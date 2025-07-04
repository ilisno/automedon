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
  price?: number | null;
  updates?: MissionUpdate[] | null; // New field for step-by-step updates
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

type UpdateMissionPayload = Partial<Omit<Mission, 'id' | 'created_at'>>;
type UpdateProfilePayload = Partial<Omit<Profile, 'id'>>;

// 2. Définition du type du contexte
type MissionsContextType = {
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name'> & { client_id: string }) => Promise<void>; // Mis à jour pour client_id
  updateMission: (id: string, payload: UpdateMissionPayload) => Promise<void>; // Generic update function
  updateProfile: (id: string, payload: UpdateProfilePayload) => Promise<void>; // NEW: Generic update function for profiles
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, finalComment: string | null, finalPhotos: FileList | null) => Promise<void>;
  addMissionUpdate: (missionId: string, comment: string | null, photos: FileList | null) => Promise<void>;
  uploadMissionPhotos: (missionId: string, files: FileList) => Promise<string[]>;
  uploadProfilePhoto: (userId: string, file: File) => Promise<string>; // NEW: Function to upload profile photo
  
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
    mutationFn: async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name'> & { client_id: string }) => { // Mis à jour pour client_id
      const { data, error } = await supabase.from('commandes').insert({
        immatriculation: missionData.immatriculation,
        modele: missionData.modele,
        lieu_depart: missionData.lieu_depart,
        lieu_arrivee: missionData.lieu_arrivee,
        heureLimite: missionData.heureLimite,
        client_id: missionData.client_id, // Mis à jour pour client_id
        statut: 'Disponible', // Default status for new missions
        updates: [], // Initialize updates as an empty array
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

  const addMission = async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price' | 'updates' | 'convoyeur_first_name' | 'convoyeur_last_name'> & { client_id: string }) => { // Mis à jour pour client_id
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
      const filePath = `${missionId}/${uuidv4()}-${file.name}`;
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
    const filePath = `avatars/${userId}/${uuidv4()}-${file.name}`; // Unique path for each user's avatar
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

  const completeMission = async (missionId: string, finalComment: string | null, finalPhotos: FileList | null) => {
    // Add a final update entry
    await addMissionUpdate(missionId, finalComment, finalPhotos);
    // Then change the status to 'livrée'
    await updateMission(missionId, { statut: 'livrée' });
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
          .select('*, profiles!commandes_convoyeur_id_fkey(first_name, last_name)') // Explicitly name the join for clarity
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
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
          updates: m.updates,
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
        const { data, error } = await supabase.from('commandes').select('*').eq('statut', 'Disponible');
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
          price: m.price,
          updates: m.updates,
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
          .select('*')
          .eq('convoyeur_id', userId)
          .in('statut', ['en cours', 'livrée']);
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
          price: m.price,
          updates: m.updates,
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
          .select('price, created_at')
          .eq('convoyeur_id', convoyeurId)
          .eq('statut', 'livrée')
          .gte('created_at', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00Z`)
          .lt('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00Z`);

        if (error) {
          console.error("Error fetching monthly turnover:", error);
          throw error;
        }

        return data.reduce((sum, mission) => sum + (mission.price || 0), 0);
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
        const { data, error } = await supabase.from('commandes').select('*, profiles!commandes_convoyeur_id_fkey(first_name, last_name)');
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
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
          updates: m.updates,
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


  const contextValue = useMemo(() => ({
    addMission,
    updateMission, // Use the new generic update
    updateProfile, // NEW: Add updateProfile to context
    takeMission,
    completeMission,
    addMissionUpdate,
    uploadMissionPhotos,
    uploadProfilePhoto, // NEW: Add uploadProfilePhoto to context
    useClientMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
    useAllMissions, // Add to context
    useConvoyeurs, // Add to context
    useClients, // Add to context
  }), [
    addMission,
    updateMission,
    updateProfile, // NEW
    takeMission,
    completeMission,
    addMissionUpdate,
    uploadMissionPhotos,
    uploadProfilePhoto, // NEW
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