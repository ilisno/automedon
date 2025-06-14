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

// 2. Définition du type du contexte
type MissionsContextType = {
  missions: Mission[] | undefined;
  isLoadingMissions: boolean;
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price'> & { concessionnaire_id: string }) => Promise<void>;
  updateMissionStatus: (id: string, statut: Mission['statut'], commentaires?: string, photos?: string[], convoyeurId?: string) => Promise<void>;
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, commentaires: string, photos: string[], price: number) => Promise<void>;
  getConcessionnaireMissions: (userId: string) => Mission[] | undefined;
  getAvailableMissions: () => Mission[] | undefined;
  getConvoyeurMissions: (userId: string) => Mission[] | undefined;
  getMonthlyTurnover: (convoyeurId: string) => number;
};

// 3. Création du contexte
const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

// 4. Création du fournisseur de contexte (Provider)
export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch all missions
  const { data: missions, isLoading: isLoadingMissions } = useQuery<Mission[]>({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('commandes').select('*');
      if (error) throw error;
      // Map DB column names to camelCase for consistency in frontend
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
        heureLimite: m.heureLimite, // Assuming heureLimite is already camelCase in DB or mapped
        commentaires: m.commentaires,
        photos: m.photos,
        price: m.price,
      }));
    },
  });

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
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
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

  // Mutation for updating mission status
  const updateMissionStatusMutation = useMutation({
    mutationFn: async ({ id, statut, commentaires, photos, convoyeurId }: { id: string; statut: Mission['statut']; commentaires?: string; photos?: string[]; convoyeurId?: string }) => {
      const updateData: any = { statut };
      if (commentaires !== undefined) updateData.commentaires = commentaires;
      if (photos !== undefined) updateData.photos = photos;
      if (convoyeurId !== undefined) updateData.convoyeur_id = convoyeurId;

      const { data, error } = await supabase.from('commandes').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      if (variables.statut === 'en cours') {
        showSuccess("Mission prise en charge !");
      } else if (variables.statut === 'livrée') {
        showSuccess("Mission marquée comme livrée !");
      }
    },
    onError: (error) => {
      console.error("Error updating mission status:", error);
      showError("Erreur lors de la mise à jour du statut de la mission.");
    },
  });

  const updateMissionStatus = async (id: string, statut: Mission['statut'], commentaires?: string, photos?: string[], convoyeurId?: string) => {
    await updateMissionStatusMutation.mutateAsync({ id, statut, commentaires, photos, convoyeurId });
  };

  const takeMission = async (missionId: string, convoyeurId: string) => {
    await updateMissionStatus(missionId, 'en cours', undefined, undefined, convoyeurId);
  };

  const completeMissionMutation = useMutation({
    mutationFn: async ({ missionId, commentaires, photos, price }: { missionId: string; commentaires: string; photos: string[]; price: number }) => {
      const { data, error } = await supabase.from('commandes').update({
        statut: 'livrée',
        commentaires: commentaires,
        photos: photos,
        price: price,
      }).eq('id', missionId).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] });
      showSuccess("Mission marquée comme livrée !");
    },
    onError: (error) => {
      console.error("Error completing mission:", error);
      showError("Erreur lors de la finalisation de la mission.");
    },
  });

  const completeMission = async (missionId: string, commentaires: string, photos: string[], price: number) => {
    await completeMissionMutation.mutateAsync({ missionId, commentaires, photos, price });
  };

  // Helper functions to filter missions
  const getConcessionnaireMissions = (userId: string) => {
    return missions?.filter(m => m.concessionnaire_id === userId);
  };

  const getAvailableMissions = () => {
    return missions?.filter(m => m.statut === 'Disponible');
  };

  const getConvoyeurMissions = (userId: string) => {
    return missions?.filter(m => m.convoyeur_id === userId || (m.statut === 'en cours' && m.convoyeur_id === userId) || (m.statut === 'livrée' && m.convoyeur_id === userId));
  };

  const getMonthlyTurnover = (convoyeurId: string) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return missions?.filter(m =>
      m.convoyeur_id === convoyeurId &&
      m.statut === 'livrée' &&
      new Date(m.created_at).getMonth() === currentMonth &&
      new Date(m.created_at).getFullYear() === currentYear &&
      m.price !== null
    ).reduce((sum, mission) => sum + (mission.price || 0), 0) || 0;
  };

  const contextValue = useMemo(() => ({
    missions,
    isLoadingMissions,
    addMission,
    updateMissionStatus,
    takeMission,
    completeMission,
    getConcessionnaireMissions,
    getAvailableMissions,
    getConvoyeurMissions,
    getMonthlyTurnover,
  }), [missions, isLoadingMissions, addMission, updateMissionStatus, takeMission, completeMission, getConcessionnaireMissions, getAvailableMissions, getConvoyeurMissions, getMonthlyTurnover]);

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