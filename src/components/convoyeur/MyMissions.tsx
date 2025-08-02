import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMissions, Mission } from "@/context/MissionsContext";
import MissionDetailDialog from "./MissionDetailDialog";
import AddExpenseDialog from "./AddExpenseDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DepartureSheetForm from "./DepartureSheetForm";
import ArrivalSheetForm from "./ArrivalSheetForm";

interface MyMissionsProps {
  userId: string;
  // Removed: missionComments: { [key: string]: string };
  // Removed: missionPhotos: { [key: string]: string[] };
  // Removed: missionPrices: { [key: string]: number };
  // Removed: setMissionComments: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  // Removed: setMissionPhotos: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  // Removed: setMissionPrices: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const MyMissions: React.FC<MyMissionsProps> = ({
  userId,
  // Removed: missionComments,
  // Removed: missionPhotos,
  // Removed: missionPrices,
  // Removed: setMissionComments,
  // Removed: setMissionPhotos,
  // Removed: setMissionPrices,
}) => {
  // Destructure refetch from useConvoyeurMissions
  const { missions: convoyeurMissions, isLoading: isLoadingConvoyeurMissions, refetch: refetchConvoyeurMissions } = useMissions().useConvoyeurMissions(userId);

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isDepartureSheetDialogOpen, setIsDepartureSheetDialogOpen] = useState(false);
  const [isArrivalSheetDialogOpen, setIsArrivalSheetDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleOpenDetailDialog = (mission: Mission) => {
    // Ensure selectedMission is the latest version from the fetched list
    const latestMission = convoyeurMissions?.find(m => m.id === mission.id) || mission;
    setSelectedMission(latestMission);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setSelectedMission(null);
    setIsDetailDialogOpen(false);
  };

  const handleOpenExpenseDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsExpenseDialogOpen(true);
  };

  const handleCloseExpenseDialog = () => {
    setSelectedMission(null);
    setIsExpenseDialogOpen(false);
  };

  const handleOpenDepartureSheetDialog = (mission: Mission) => {
    const latestMission = convoyeurMissions?.find(m => m.id === mission.id) || mission;
    setSelectedMission(latestMission);
    setIsDepartureSheetDialogOpen(true);
  };

  const handleCloseDepartureSheetDialog = () => {
    setSelectedMission(null);
    setIsDepartureSheetDialogOpen(false);
  };

  const handleOpenArrivalSheetDialog = (mission: Mission) => {
    const latestMission = convoyeurMissions?.find(m => m.id === mission.id) || mission;
    setSelectedMission(latestMission);
    setIsArrivalSheetDialogOpen(true);
  };

  const handleCloseArrivalSheetDialog = () => {
    setSelectedMission(null);
    setIsArrivalSheetDialogOpen(false);
  };

  const handleSheetCreated = async () => {
    handleCloseDepartureSheetDialog();
    handleCloseArrivalSheetDialog();
    // Explicitly refetch missions to ensure the UI updates with the latest sheet details
    await refetchConvoyeurMissions();
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
                  <strong>Rémunération:</strong>{" "}
                  {mission.convoyeur_payout ? `${mission.convoyeur_payout.toFixed(2)} €` : "Non définie"}
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} className="w-full">
                    Voir les détails
                  </Button>
                  {mission.statut === 'en cours' && (
                    <>
                      {!mission.departure_details && (
                        <Button onClick={(e) => { e.stopPropagation(); handleOpenDepartureSheetDialog(mission); }} variant="outline" className="w-full">
                          Ajouter Fiche Départ
                        </Button>
                      )}
                      {mission.departure_details && !mission.arrival_details && (
                        <Button onClick={(e) => { e.stopPropagation(); handleOpenArrivalSheetDialog(mission); }} variant="outline" className="w-full">
                          Ajouter Fiche Arrivée
                        </Button>
                      )}
                      <Button onClick={(e) => { e.stopPropagation(); handleOpenExpenseDialog(mission); }} variant="outline" className="w-full">
                        Ajouter des frais
                      </Button>
                    </>
                  )}
                </div>
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
      <AddExpenseDialog
        mission={selectedMission}
        isOpen={isExpenseDialogOpen}
        onClose={handleCloseExpenseDialog}
      />

      <Dialog open={isDepartureSheetDialogOpen} onOpenChange={setIsDepartureSheetDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche de Départ pour {selectedMission?.modele}</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <DepartureSheetForm
              missionId={selectedMission.id}
              onSheetCreated={handleSheetCreated}
              initialData={selectedMission.departure_details || undefined} // Pass existing data for editing
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isArrivalSheetDialogOpen} onOpenChange={setIsArrivalSheetDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche d'Arrivée pour {selectedMission?.modele}</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <ArrivalSheetForm
              missionId={selectedMission.id}
              onSheetCreated={handleSheetCreated}
              initialData={selectedMission.arrival_details || undefined} // Pass existing data for editing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyMissions;