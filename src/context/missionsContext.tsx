import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Mission } from '@/types/mission';

type MissionsContextType = {
  missions: Mission[];
  ajouterMission: (mission: Omit<Mission, 'id' | 'statut'>) => void;
  mettreAJourStatut: (id: string, statut: Mission['statut']) => void;
};

const MissionsContext = createContext<MissionsContextType | undefined>(undefined);

export const MissionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);

  const ajouterMission = (mission: Omit<Mission, 'id' | 'statut'>) => {
    const newMission: Mission = {
      ...mission,
      id: uuidv4(),
      statut: 'en attente',
    };
    setMissions((prevMissions) => [...prevMissions, newMission]);
  };

  const mettreAJourStatut = (id: string, statut: Mission['statut']) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) =>
        mission.id === id ? { ...mission, statut } : mission
      )
    );
  };

  return (
    <MissionsContext.Provider value={{ missions, ajouterMission, mettreAJourStatut }}>
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