import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMissions } from '@/context/missionsContext';

const Index = () => {
  const navigate = useNavigate();
  const { missions } = useMissions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Bienvenue sur Automédon</h1>
          <p className="text-xl mb-8">Gérez vos missions de convoyage de manière efficace et intuitive</p>
          <div className="space-x-4">
            <button
              className="px-6 py-3 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/concessionnaire')}
            >
              Je suis concessionnaire
            </button>
            <button
              className="px-6 py-3 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => navigate('/convoyeur')}
            >
              Je suis convoyeur
            </button>
          </div>
        </div>
        <div className="bg-white text-black p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Missions récentes</h2>
          <div className="space-y-6">
            {missions.slice(0, 3).map((mission) => (
              <div key={mission.id} className="p-4 bg-gray-100 rounded-md shadow-md">
                <h3 className="text-2xl font-semibold">{mission.modele}</h3>
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
    </div>
  );
};

export default Index;