import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// 1. Définition du type Mission
export type Mission = {
  id: string;
  immatriculation: string;
  modele: string;
  lieuDepart: string;
  lieuArrivee: string;
  heureLimite: string; // Format ISO
  statut: 'en attente' | 'en cours' | 'livrée';
  commentaires?: string;
  photos?: File[];
};

// 2. Définition du type du contexte
type MissionsContextType = {
  missions: Mission[];
  ajouterMission: (mission: Omit<Mission, 'id' | 'statut' | 'commentaires' | 'photos'>) => void;
  mettreAJourStatut: (id: string, statut: Mission['statut'], commentaires?: string, photos?: File[]) => void;
};

// 3. Création du contexte
const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

// 4. Création du fournisseur de contexte (Provider)
export const MissionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);

  const ajouterMission = useCallback((missionData: Omit<Mission, 'id' | 'statut' | 'commentaires' | 'photos'>) => {
    const nouvelleMission: Mission = {
      id: uuidv4(),
      ...missionData,
      statut: 'en attente',
    };
    setMissions((prevMissions) => [...prevMissions, nouvelleMission]);
    console.log("Mission ajoutée:", nouvelleMission);
  }, []);

  const mettreAJourStatut = useCallback((id: string, statut: Mission['statut'], commentaires?: string, photos?: File[]) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) =>
        mission.id === id
          ? { ...mission, statut, commentaires: commentaires !== undefined ? commentaires : mission.commentaires, photos: photos !== undefined ? photos : mission.photos }
          : mission
      )
    );
    console.log(`Mission ${id} mise à jour. Nouveau statut: ${statut}`);
    if (commentaires) console.log("Commentaires mis à jour:", commentaires);
    if (photos) console.log("Photos mises à jour:", photos.map(f => f.name));
  }, []);

  const contextValue = useMemo(() => ({
    missions,
    ajouterMission,
    mettreAJourStatut,
  }), [missions, ajouterMission, mettreAJourStatut]);

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