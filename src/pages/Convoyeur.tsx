import React, { useState } from 'react';
import { useMissions } from '@/context/missionsContext';
import { Mission } from '@/types/mission';

const Convoyeur = () => {
  const { missions, mettreAJourStatut } = useMissions();
  const [commentaires, setCommentaires] = useState<string>('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePrendreEnCharge = (id: string) => {
    mettreAJourStatut(id, 'en cours');
  };

  const handleMarquerCommeLivree = (id: string) => {
    mettreAJourStatut(id, 'livrée');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
      console.log('Photos:', Array.from(e.target.files));
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
                    value={commentaires}
                    onChange={(e) => setCommentaires(e.target.value)}
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
                    onChange={handlePhotoChange}
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