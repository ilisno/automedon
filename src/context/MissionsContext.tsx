import React, { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { showSuccess, showError } from '@/utils/toast';
import { format } from 'date-fns';

// 1. Définition du type Mission (adapté à la table Supabase)
export type Mission = {
  id: string;
  created_at: string;
  immatriculation: string;
  modele: string;
  lieu_depart: string;
  lieu_arrivee: string;
  statut: 'Disponible' | 'en attente' | 'en cours' | 'livrée'; // Statuts de la DB
  concessionnaire_id: string | null;
  convoyeur_id: string | null;
  heureLimite: string; // ISO string, from DB heure_limite
  commentaires?: string | null;
  photos?: string[] | null; // Assuming photo URLs if uploaded to storage
  price?: number | null;
};

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'concessionnaire' | 'convoyeur' | 'admin' | null;
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
};

type UpdateMissionPayload = Partial<Omit<Mission, 'id' | 'created_at'>>;

// 2. Définition du type du contexte
type MissionsContextType = {
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price'> & { concessionnaire_id: string }) => Promise<void>;
  updateMission: (id: string, payload: UpdateMissionPayload) => Promise<void>; // Generic update function
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, commentaires: string, photos: string[]) => Promise<void>; // Price removed
  
  // Hooks pour récupérer les missions et profils
  useConcessionnaireMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useAvailableMissions: () => { missions: Mission[] | undefined; isLoading: boolean; };
  useConvoyeurMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useMonthlyTurnover: (convoyeurId: string | undefined) => { turnover: number; isLoading: boolean; };
  useAllMissions: () => { missions: Mission[] | undefined; isLoading: boolean; }; // New hook for all missions
  useConvoyeurs: () => { profiles: Profile[] | undefined; isLoading: boolean; }; // New hook for all convoyeurs
  useConcessionnaires: () => { profiles: Profile[] | undefined; isLoading: boolean; }; // New hook for all concessionnaires
};

// 3. Création du contexte
const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

// 4. Création du fournisseur de contexte (Provider)
export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Mutation for adding a mission
  const addMissionMutation = useMutation({
    mutationFn: async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price'> & { concessionnaire_id: string }) => {
      const { data, error } = await supabase.from('commandes').insert({
        immatriculation: missionData.immatriculation,
        modele: missionData.modele,
        lieu_depart: missionData.lieu_depart,
        lieu_arrivee: missionData.lieu_arrivee,
        heureLimite: missionData.heureLimite,
        concessionnaire_id: missionData.concessionnaire_id,
        statut: 'Disponible', // Default status for new missions
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concessionnaireMissions'] });
      queryClient.invalidateQueries({ queryKey: ['allMissions'] }); // Invalidate all missions for admin view
      showSuccess("Mission créée avec succès ✅");
    },
    onError: (error) => {
      console.error("Error adding mission:", error);
      showError("Erreur lors de la création de la mission.");
    },
  });

  const addMission = async (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price'> & { concessionnaire_id: string }) => {
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
      queryClient.invalidateQueries({ queryKey: ['concessionnaireMissions'] });
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

  const takeMission = async (missionId: string, convoyeurId: string) => {
    await updateMission(missionId, { statut: 'en cours', convoyeur_id: convoyeurId });
  };

  const completeMission = async (missionId: string, commentaires: string, photos: string[]) => { // Price removed
    await updateMission(missionId, { statut: 'livrée', commentaires, photos }); // Price removed from payload
  };

  // Hooks pour récupérer les missions
  const useConcessionnaireMissions = (userId: string | undefined) => {
    const { data, isLoading } = useQuery<Mission[]>({
      queryKey: ['concessionnaireMissions', userId],
      queryFn: async () => {
        if (!userId) return [];
        const { data, error } = await supabase.from('commandes').select('*').eq('concessionnaire_id', userId);
        if (error) throw error;
        return data.map(m => ({
          id: m.id,
          created_at: m.created_at,
          immatriculation: m.immatriculation,
          modele: m.modele,
          lieu_depart: m.lieu_depart,
          lieu_arrivee: m.lieu_arrivee,
          statut: m.statut,
          concessionnaire_id: m.concessionnaire_id,
          convoyeur_id: m.convoyeur_id,
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
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
          concessionnaire_id: m.concessionnaire_id,
          convoyeur_id: m.convoyeur_id,
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
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
          concessionnaire_id: m.concessionnaire_id,
          convoyeur_id: m.convoyeur_id,
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
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
        const { data, error } = await supabase.from('commandes').select('*');
        if (error) throw error;
        return data.map(m => ({
          id: m.id,
          created_at: m.created_at,
          immatriculation: m.immatriculation,
          modele: m.modele,
          lieu_depart: m.lieu_depart,
          lieu_arrivee: m.lieu_arrivee,
          statut: m.statut,
          concessionnaire_id: m.concessionnaire_id,
          convoyeur_id: m.convoyeur_id,
          heureLimite: m.heureLimite,
          commentaires: m.commentaires,
          photos: m.photos,
          price: m.price,
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

  // New hook to fetch all concessionnaire profiles
  const useConcessionnaires = () => {
    const { data, isLoading } = useQuery<Profile[]>({
      queryKey: ['concessionnaires'],
      queryFn: async () => {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'concessionnaire');
        if (error) throw error;
        return data;
      },
    });
    return { profiles: data, isLoading };
  };


  const contextValue = useMemo(() => ({
    addMission,
    updateMission, // Use the new generic update
    takeMission,
    completeMission,
    useConcessionnaireMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
    useAllMissions, // Add to context
    useConvoyeurs, // Add to context
    useConcessionnaires, // Add to context
  }), [
    addMission,
    updateMission,
    takeMission,
    completeMission,
    useConcessionnaireMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
    useAllMissions,
    useConvoyeurs,
    useConcessionnaires,
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