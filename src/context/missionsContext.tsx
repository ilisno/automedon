import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Mission } from '@/types/mission';
import { useAuth } from './AuthContext'; // Import useAuth to get current user ID

type MissionsContextType = {
  missions: Mission[];
  loadingMissions: boolean;
  errorMissions: string | null;
  ajouterMission: (mission: Omit<Mission, 'id' | 'statut' | 'concessionnaire_id' | 'convoyeur_id' | 'photos' | 'commentaires'>) => Promise<void>;
  mettreAJourStatut: (id: string, statut: Mission['statut'], convoyeurId?: string | null) => Promise<void>;
  assignerConvoyeur: (missionId: string, convoyeurId: string) => Promise<void>;
  updateMissionDetails: (id: string, updates: Partial<Mission>) => Promise<void>;
};

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

export const MissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);
  const [errorMissions, setErrorMissions] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoadingMissions(true);
      setErrorMissions(null);
      try {
        const { data, error } = await supabase
          .from('commandes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissions(data as Mission[]);
      } catch (err: any) {
        console.error('Error fetching missions:', err);
        setErrorMissions(err.message || 'Failed to fetch missions.');
      } finally {
        setLoadingMissions(false);
      }
    };

    fetchMissions();

    // Realtime subscription for missions
    const subscription = supabase
      .channel('public:commandes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'commandes' }, payload => {
        console.log('Change received!', payload);
        fetchMissions(); // Re-fetch missions on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const ajouterMission = async (mission: Omit<Mission, 'id' | 'statut' | 'concessionnaire_id' | 'convoyeur_id' | 'photos' | 'commentaires'>) => {
    if (!user) {
      throw new Error('User not authenticated to add mission.');
    }
    try {
      const newMissionData = {
        immatriculation: mission.immatriculation,
        modele: mission.modele,
        lieu_depart: mission.depart, // Map to DB column name
        lieu_arrivee: mission.arrivee, // Map to DB column name
        heureLimite: mission.heureLimite,
        statut: 'en attente',
        concessionnaire_id: user.id, // Set the creator's ID
      };
      const { data, error } = await supabase
        .from('commandes')
        .insert([newMissionData])
        .select();

      if (error) throw error;
      setMissions((prevMissions) => [...prevMissions, data[0] as Mission]);
    } catch (err: any) {
      console.error('Error adding mission:', err);
      throw err;
    }
  };

  const mettreAJourStatut = async (id: string, statut: Mission['statut'], convoyeurId: string | null = null) => {
    try {
      const updates: Partial<Mission> = { statut };
      if (convoyeurId !== undefined) { // Only update convoyeur_id if explicitly provided (can be null)
        updates.convoyeur_id = convoyeurId;
      }

      const { error } = await supabase
        .from('commandes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === id ? { ...mission, ...updates } : mission
        )
      );
    } catch (err: any) {
      console.error('Error updating mission status:', err);
      throw err;
    }
  };

  const assignerConvoyeur = async (missionId: string, convoyeurId: string) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update({ convoyeur_id: convoyeurId, statut: 'acceptée' }) // Automatically set to 'acceptée' when assigned
        .eq('id', missionId);

      if (error) throw error;
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === missionId ? { ...mission, convoyeur_id: convoyeurId, statut: 'acceptée' } : mission
        )
      );
    } catch (err: any) {
      console.error('Error assigning convoyeur:', err);
      throw err;
    }
  };

  const updateMissionDetails = async (id: string, updates: Partial<Mission>) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === id ? { ...mission, ...updates } : mission
        )
      );
    } catch (err: any) {
      console.error('Error updating mission details:', err);
      throw err;
    }
  };


  return (
    <MissionsContext.Provider value={{ missions, loadingMissions, errorMissions, ajouterMission, mettreAJourStatut, assignerConvoyeur, updateMissionDetails }}>
      {children}
    </MissionsContext.Provider>
  );
};

export const useMissions = () => {
  const context = useContext(MissionsContext);
  if (!context) {
    throw new Error('useMissions must be used within a MissionsProvider');
  }
  return context;
};