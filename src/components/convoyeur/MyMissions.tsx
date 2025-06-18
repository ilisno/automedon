import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, Mission } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";

interface MyMissionsProps {
  userId: string;
  missionComments: { [key: string]: string };
  missionPhotos: { [key: string]: string[] };
  // missionPrices: { [key: string]: number }; // Removed
  setMissionComments: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setMissionPhotos: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  // setMissionPrices: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>; // Removed
}

const MyMissions: React.FC<MyMissionsProps> = ({
  userId,
  missionComments,
  missionPhotos,
  // missionPrices, // Removed
  setMissionComments,
  setMissionPhotos,
  // setMissionPrices, // Removed
}) => {
  const { useConvoyeurMissions, completeMission } = useMissions();
  const { missions: convoyeurMissions, isLoading: isLoadingConvoyeurMissions } = useConvoyeurMissions(userId);

  const handleMarquerCommeLivree = async (id: string) => {
    const comments = missionComments[id] || "";
    const photos = missionPhotos[id] || []; // Currently empty, would be URLs

    await completeMission(id, comments, photos); // Price removed from call
    // Clear local state for this mission
    setMissionComments(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
    setMissionPhotos(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
    // setMissionPrices(prev => { const newState = { ...prev }; delete newState[id]; return newState; }); // Removed
  };

  const handleCommentChange = (id: string, value: string) => {
    setMissionComments(prev => ({ ...prev, [id]: value }));
  };

  // handlePriceChange removed

  // For now, photos are not uploaded, just showing placeholder
  const handlePhotoChange = (id: string, files: FileList | null) => {
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setMissionPhotos(prev => ({ ...prev, [id]: fileNames }));
      console.log(`Photos sélectionnées pour mission ${id}:`, fileNames);
      showSuccess("Photos sélectionnées (non uploadées pour l'instant).");
    }
  };

  if (isLoadingConvoyeurMissions) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement de vos missions...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions (En cours & Livrées)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {convoyeurMissions && convoyeurMissions.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Vous n'avez pas de missions en cours ou livrées.</p>
        ) : (
          convoyeurMissions?.map((mission) => (
            <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  De: {mission.lieu_depart} à {mission.lieu_arrivee}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Statut:</strong> <span className={`font-medium ${
                  mission.statut === 'en cours' ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`}>{mission.statut}</span></p>
                <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                <p>
                  <strong>Prix:</strong>{" "}
                  {mission.price ? `${mission.price.toFixed(2)} €` : "Prix non fixé"}
                </p>

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
                    {/* Price input removed */}
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
                          Fichiers sélectionnés: {missionPhotos[mission.id].join(', ')} (Non uploadés)
                        </p>
                      )}
                    </div>
                    <Button onClick={() => handleMarquerCommeLivree(mission.id)} className="w-full bg-green-600 hover:bg-green-700">
                      Marquer comme livrée
                    </Button>
                  </div>
                )}

                {mission.statut === 'livrée' && (
                  <>
                    {mission.commentaires && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Commentaires:</strong> {mission.commentaires}
                      </p>
                    )}
                    {mission.photos && mission.photos.length > 0 && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Photos:</strong> {mission.photos.join(', ')} (Fichiers non affichés)
                      </p>
                    )}
                    {/* Price display already handled above */}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MyMissions;