import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMissions, Mission, Profile } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";
import MissionDetailDialog from "./MissionDetailDialog";
import AddExpenseDialog from "./AddExpenseDialog";
import MissionSheetForm from "./MissionSheetForm";

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
  const { useConvoyeurMissions, useConvoyeurs, useClients } = useMissions();
  const { missions: convoyeurMissions, isLoading: isLoadingConvoyeurMissions } = useConvoyeurMissions(userId);
  const { profiles: convoyeurs, isLoading: isLoadingConvoyeurs } = useConvoyeurs();
  const { profiles: clients, isLoading: isLoadingClients } = useClients();

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isSheetFormOpen, setIsSheetFormOpen] = useState(false);
  const [sheetFormType, setSheetFormType] = useState<'departure' | 'arrival'>('departure');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedClientProfile, setSelectedClientProfile] = useState<Profile | null>(null);

  const convoyeurProfile = convoyeurs?.find(p => p.id === userId) || null;

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

  const handleOpenSheetForm = (mission: Mission, type: 'departure' | 'arrival') => {
    setSelectedMission(mission);
    setSheetFormType(type);
    const clientProf = clients?.find(p => p.id === mission.client_id) || null;
    setSelectedClientProfile(clientProf);
    setIsSheetFormOpen(true);
  };

  const handleCloseSheetForm = () => {
    setSelectedMission(null);
    setSelectedClientProfile(null);
    setIsSheetFormOpen(false);
  };

  if (isLoadingConvoyeurMissions || isLoadingConvoyeurs || isLoadingClients) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement de vos missions...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions (En cours & Livrées)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {convoyeurMissions && convoyeurMissions.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Vous n'avez pas de missions en cours ou livrées.</p>
        ) : (
          convoyeurMissions?.map((mission) => {
            return (
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
                  {mission.statut === 'en cours' && (
                    <div className="flex flex-col space-y-2">
                      <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} className="w-full">
                        Voir les détails / Mettre à jour
                      </Button>
                      {!mission.departure_details && (
                        <Button onClick={(e) => { e.stopPropagation(); handleOpenSheetForm(mission, 'departure'); }} variant="outline" className="w-full">
                          Remplir Fiche de Départ
                        </Button>
                      )}
                      {mission.departure_details && !mission.arrival_details && (
                        <Button onClick={(e) => { e.stopPropagation(); handleOpenSheetForm(mission, 'arrival'); }} variant="outline" className="w-full">
                          Remplir Fiche d'Arrivée
                        </Button>
                      )}
                      <Button onClick={(e) => { e.stopPropagation(); handleOpenExpenseDialog(mission); }} variant="outline" className="w-full">
                        Ajouter des frais
                      </Button>
                    </div>
                  )}
                  {mission.statut === 'livrée' && (
                    <Button onClick={(e) => { e.stopPropagation(); handleOpenDetailDialog(mission); }} variant="outline" className="w-full">
                      Voir l'historique & Frais
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })
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
      <MissionSheetForm
        mission={selectedMission}
        isOpen={isSheetFormOpen}
        onClose={handleCloseSheetForm}
        type={sheetFormType}
        convoyeurProfile={convoyeurProfile}
        clientProfile={selectedClientProfile}
      />
    </div>
  );
};

export default MyMissions;