import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, Mission } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";
import MissionDetailDialog from "./MissionDetailDialog"; // Import the new dialog component

interface MyMissionsProps {
  userId: string;
  // missionComments, missionPhotos, missionPrices are now managed within MissionDetailDialog or MissionsContext
  // No longer needed as props here, but keeping for now to avoid breaking other parts if they still rely on them
  missionComments: { [key: string]: string };
  missionPhotos: { [key: string]: string[] };
  missionPrices: { [key: string]: number };
  setMissionComments: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setMissionPhotos: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setMissionPrices: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const MyMissions: React.FC<MyMissionsProps> = ({
  userId,
  // These props are now largely redundant for the new flow, but kept for compatibility
  missionComments,
  missionPhotos,
  missionPrices,
  setMissionComments,
  setMissionPhotos,
  setMissionPrices,
}) => {
  const { useConvoyeurMissions } = useMissions();
  const { missions: convoyeurMissions, isLoading: isLoadingConvoyeurMissions } = useConvoyeurMissions(userId);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleOpenDetailDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setSelectedMission(null);
    setIsDetailDialogOpen(false);
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
            <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg cursor-pointer" onClick={() => handleOpenDetailDialog(mission)}>
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
                  <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} className="w-full">
                    Voir les détails / Mettre à jour
                  </Button>
                )}
                {mission.statut === 'livrée' && mission.updates && mission.updates.length > 0 && (
                  <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} variant="outline" className="w-full">
                    Voir l'historique
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <MissionDetailDialog
        mission={selectedMission}
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
        userId={userId}
      />
    </div>
  );
};

export default MyMissions;