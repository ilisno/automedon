import React, { useState } from 'react';
import { useMissions } from '@/context/missionsContext';
import { Mission } from '@/types/mission';

const Convoyeur = () => {
  const { missions, mettreAJourStatut } = useMissions();
  const [commentaires, setCommentaires] = useState<{ [key: string]: string }>({});
  const [photos, setPhotos] = useState<{ [key: string]: File[] }>({});

  const handlePrendreEnCharge = (id: string) => {
    mettreAJourStatut(id, 'acceptée'); // Change status to 'acceptée'
  };

  const handleDebutMission = (id: string) => {
    mettreAJourStatut(id, 'en cours'); // Change status to 'en cours'
  };

  const handleMarquerCommeLivree = (id: string) => {
    mettreAJourStatut(id, 'livrée');
    // Clear comments and photos for this mission
    setCommentaires(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setPhotos(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleCommentChange = (id: string, value: string) => {
    setCommentaires(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => ({ ...prev, [id]: Array.from(e.target.files) }));
      console.log(`Photos for mission ${id}:`, Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Liste des missions</h1>
      <div className="w-full max-w-2xl">
        {missions.map((mission) => (
          <div key={mission.id} className="mb-6 p-4 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-2">{mission.modele}</h2>
            <p className="mb-1">
              <strong>Immatriculation:</strong> {mission.immatriculation}
            </p>
            <p className="mb-1">
              <strong>Départ:</strong> {mission.depart}
            </p>
            <p className="mb-1">
              <strong>Arrivée:</strong> {mission.arrivee}
            </p>
            <p className="mb-1">
              <strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}
            </p>
            <p className="mb-1">
              <strong>Statut:</strong> {mission.statut}
            </p>
            {mission.statut === 'en attente' && (
              <button
                onClick={() => handlePrendreEnCharge(mission.id)}
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                Prendre en charge
              </button>
            )}
            {mission.statut === 'acceptée' && (
              <button
                onClick={() => handleDebutMission(mission.id)}
                className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
              >
                Débuter la mission
              </button>
            )}
            {mission.statut === 'en cours' && (
              <>
                <button
                  onClick={() => handleMarquerCommeLivree(mission.id)}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Marquer comme livrée
                </button>
                <div className="mt-4">
                  <label htmlFor={`commentaires-${mission.id}`} className="block text-sm font-medium mb-1">
                    Commentaires
                  </label>
                  <textarea
                    id={`commentaires-${mission.id}`}
                    value={commentaires[mission.id] || ''}
                    onChange={(e) => handleCommentChange(mission.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor={`photos-${mission.id}`} className="block text-sm font-medium mb-1">
                    Photos
                  </label>
                  <input
                    type="file"
                    id={`photos-${mission.id}`}
                    multiple
                    onChange={(e) => handlePhotoChange(mission.id, e)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Convoyeur;