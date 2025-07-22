import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, Mission } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";
import MissionDetailDialog from "./MissionDetailDialog";
import AddExpenseDialog from "./AddExpenseDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Import Dialog components
import DepartureSheetForm from "./DepartureSheetForm"; // Import DepartureSheetForm
import ArrivalSheetForm from "./ArrivalSheetForm"; // Import ArrivalSheetForm

interface MyMissionsProps {
  userId: string;
  missionComments: { [key: string]: string };
  missionPhotos: { [key: string]: string[] };
  missionPrices: { [key: string]: number };
  setMissionComments: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  setMissionPhotos: React.Dispatch<React.SetStateAction<{ [key: string]: string[] }>>;
  setMissionPrices: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

const MyMissions: React.FC<MyMissionsProps> = ({
  userId,
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
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isDepartureSheetDialogOpen, setIsDepartureSheetDialogOpen] = useState(false); // NEW
  const [isArrivalSheetDialogOpen, setIsArrivalSheetDialogOpen] = useState(false); // NEW
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const handleOpenDetailDialog = (mission: Mission) => {
    setSelectedMission(mission);
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

  // NEW: Handlers for Departure Sheet Dialog
  const handleOpenDepartureSheetDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsDepartureSheetDialogOpen(true);
  };

  const handleCloseDepartureSheetDialog = () => {
    setSelectedMission(null);
    setIsDepartureSheetDialogOpen(false);
  };

  // NEW: Handlers for Arrival Sheet Dialog
  const handleOpenArrivalSheetDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsArrivalSheetDialogOpen(true);
  };

  const handleCloseArrivalSheetDialog = () => {
    setSelectedMission(null);
    setIsArrivalSheetDialogOpen(false);
  };

  // Function to refresh missions after sheet creation
  const handleSheetCreated = () => {
    handleCloseDepartureSheetDialog();
    handleCloseArrivalSheetDialog();
    // The useConvoyeurMissions hook will automatically re-fetch due to queryClient.invalidateQueries in MissionsContext
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
                  {/* Always show 'Voir les détails' for 'en cours' or 'livrée' missions */}
                  <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} className="w-full">
                    Voir les détails
                  </Button>
                  {mission.statut === 'en cours' && (
                    <Button onClick={(e) => { e.stopPropagation(); handleOpenExpenseDialog(mission); }} variant="outline" className="w-full">
                      Ajouter des frais
                    </Button>
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

      {/* NEW: Departure Sheet Dialog */}
      <Dialog open={isDepartureSheetDialogOpen} onOpenChange={setIsDepartureSheetDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche de Départ pour {selectedMission?.modele}</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <DepartureSheetForm missionId={selectedMission.id} onSheetCreated={handleSheetCreated} />
          )}
        </DialogContent>
      </Dialog>

      {/* NEW: Arrival Sheet Dialog */}
      <Dialog open={isArrivalSheetDialogOpen} onOpenChange={setIsArrivalSheetDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche d'Arrivée pour {selectedMission?.modele}</DialogTitle>
          </DialogHeader>
          {selectedMission && (
            <ArrivalSheetForm missionId={selectedMission.id} onSheetCreated={handleSheetCreated} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyMissions;