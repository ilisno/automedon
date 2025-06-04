import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useMissions, Mission } from "@/context/MissionsContext"; // Import useMissions and Mission type
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess } from "@/utils/toast";

const Convoyeur = () => {
  const { missions, mettreAJourStatut } = useMissions();
  const [missionComments, setMissionComments] = useState<{ [key: string]: string }>({});
  const [missionPhotos, setMissionPhotos] = useState<{ [key: string]: File[] }>({});

  const handlePrendreEnCharge = (id: string) => {
    mettreAJourStatut(id, 'en cours');
    showSuccess("Mission prise en charge !");
  };

  const handleMarquerCommeLivree = (id: string) => {
    const comments = missionComments[id] || "";
    const photos = missionPhotos[id] || [];
    mettreAJourStatut(id, 'livrée', comments, photos);
    showSuccess("Mission marquée comme livrée !");
    // Clear local state for this mission
    setMissionComments(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setMissionPhotos(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleCommentChange = (id: string, value: string) => {
    setMissionComments(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (id: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setMissionPhotos(prev => ({ ...prev, [id]: fileArray }));
      console.log(`Photos pour mission ${id}:`, fileArray.map(f => f.name));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-6">Espace Convoyeur</h1>
        <p className="text-lg mb-8 text-center">
          Voici les missions disponibles et celles que vous avez en cours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {missions.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Aucune mission disponible pour le moment.</p>
          ) : (
            missions.map((mission) => (
              <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    De: {mission.lieuDepart} à {mission.lieuArrivee}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p><strong>Statut:</strong> <span className={`font-medium ${
                    mission.statut === 'en attente' ? 'text-yellow-600 dark:text-yellow-400' :
                    mission.statut === 'en cours' ? 'text-blue-600 dark:text-blue-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>{mission.statut}</span></p>
                  <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>

                  {mission.statut === 'en attente' && (
                    <Button onClick={() => handlePrendreEnCharge(mission.id)} className="w-full">
                      Prendre en charge
                    </Button>
                  )}

                  {mission.statut === 'en cours' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`comments-${mission.id}`}>Commentaires</Label>
                        <Textarea
                          id={`comments-${mission.id}`}
                          value={missionComments[mission.id] || ""}
                          onChange={(e) => handleCommentChange(mission.id, e.target.value)}
                          placeholder="Ajouter des commentaires sur la livraison..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`photos-${mission.id}`}>Photos</Label>
                        <Input
                          id={`photos-${mission.id}`}
                          type="file"
                          multiple
                          onChange={(e) => handlePhotoChange(mission.id, e.target.files)}
                          className="mt-1"
                        />
                        {missionPhotos[mission.id] && missionPhotos[mission.id].length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            Fichiers sélectionnés: {missionPhotos[mission.id].map(f => f.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <Button onClick={() => handleMarquerCommeLivree(mission.id)} className="w-full bg-green-600 hover:bg-green-700">
                        Marquer comme livrée
                      </Button>
                    </div>
                  )}

                  {mission.statut === 'livrée' && mission.commentaires && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Commentaires:</strong> {mission.commentaires}
                    </p>
                  )}
                   {mission.statut === 'livrée' && mission.photos && mission.photos.length > 0 && (
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Photos:</strong> {mission.photos.map(f => f.name).join(', ')} (Fichiers non affichés)
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline" className="px-8 py-4 text-lg">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Convoyeur;