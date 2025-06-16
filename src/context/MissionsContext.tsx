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
  addMission: (missionData: Omit<Mission, 'id' | 'created_at' | 'statut' | 'convoyeur_id' | 'commentaires' | 'photos' | 'price'> & { concessionnaire_id: string }) => Promise<void>;
  updateMissionStatus: (id: string, statut: Mission['statut'], commentaires?: string, photos?: string[], convoyeurId?: string) => Promise<void>;
  takeMission: (missionId: string, convoyeurId: string) => Promise<void>;
  completeMission: (missionId: string, commentaires: string, photos: string[], price: number) => Promise<void>;
  
  // Nouvelles fonctions pour récupérer les missions avec useQuery
  useConcessionnaireMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useAvailableMissions: () => { missions: Mission[] | undefined; isLoading: boolean; };
  useConvoyeurMissions: (userId: string | undefined) => { missions: Mission[] | undefined; isLoading: boolean; };
  useMonthlyTurnover: (convoyeurId: string | undefined) => { turnover: number; isLoading: boolean; };
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
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['concessionnaireMissions'] }); // Invalider les missions du concessionnaire
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
      queryClient.invalidateQueries({ queryKey: ['availableMissions'] }); // Invalider les missions disponibles
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] }); // Invalider les missions du convoyeur
      queryClient.invalidateQueries({ queryKey: ['concessionnaireMissions'] }); // Invalider les missions du concessionnaire
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
      queryClient.invalidateQueries({ queryKey: ['convoyeurMissions'] }); // Invalider les missions du convoyeur
      queryClient.invalidateQueries({ queryKey: ['monthlyTurnover'] }); // Invalider le CA mensuel
      queryClient.invalidateQueries({ queryKey: ['concessionnaireMissions'] }); // Invalider les missions du concessionnaire
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

  // Nouvelles fonctions de récupération de missions utilisant useQuery
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
      enabled: !!userId, // N'exécuter la requête que si userId est défini
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
        // Fetch missions assigned to the convoyeur that are 'en cours' or 'livrée'
        const { data, error } = await supabase
          .from('commandes')
          .select('*')
          .eq('convoyeur_id', userId)
          .in('statut', ['en cours', 'livrée']); // Filter for 'en cours' or 'livrée' statuses
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
        const currentMonth = new Date().getMonth() + 1; // Months are 1-indexed in SQL
        const currentYear = new Date().getFullYear();
        
        // Fetch only completed missions for the current convoyeur in the current month/year
        const { data, error } = await supabase
          .from('commandes')
          .select('price, created_at')
          .eq('convoyeur_id', convoyeurId)
          .eq('statut', 'livrée')
          .gte('created_at', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01T00:00:00Z`)
          .lt('created_at', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01T00:00:00Z`); // Next month's first day

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

  const contextValue = useMemo(() => ({
    addMission,
    updateMissionStatus,
    takeMission,
    completeMission,
    useConcessionnaireMissions,
    useAvailableMissions,
    useConvoyeurMissions,
    useMonthlyTurnover,
  }), [addMission, updateMissionStatus, takeMission, completeMission, useConcessionnaireMissions, useAvailableMissions, useConvoyeurMissions, useMonthlyTurnover]);

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