import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMissions } from '@/context/missionsContext';

const Index = () => {
  const navigate = useNavigate();
  const { missions } = useMissions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Automédon</h1>
      <div className="space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate('/concessionnaire')}
        >
          Je suis concessionnaire
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => navigate('/convoyeur')}
        >
          Je suis convoyeur
        </button>
      </div>
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-4">Missions récentes</h2>
        <div className="space-y-4">
          {missions.slice(0, 3).map((mission) => (
            <div key={mission.id} className="p-4 bg-white rounded-md shadow-md">
              <h3 className="text-xl font-semibold">{mission.modele}</h3>
              <p><strong>Immatriculation:</strong> {mission.immatriculation}</p>
              <p><strong>Départ:</strong> {mission.depart}</p>
              <p><strong>Arrivée:</strong> {mission.arrivee}</p>
              <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
              <p><strong>Statut:</strong> {mission.statut}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;