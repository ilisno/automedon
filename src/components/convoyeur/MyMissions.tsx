import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMissions, Mission } from "@/context/MissionsContext";
import { showSuccess, showError } from "@/utils/toast";
import MissionDetailDialog from "./MissionDetailDialog";
import AddExpenseDialog from "./AddExpenseDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DepartureSheetForm from "./DepartureSheetForm";
import ArrivalSheetForm from "./ArrivalSheetForm";

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
  const [isDepartureSheetDialogOpen, setIsDepartureSheetDialogOpen] = useState(false);
  const [isArrivalSheetDialogOpen, setIsArrivalSheetDialogOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // ... (les autres handlers restent inchangés)

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions (En cours & Livrées)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {convoyeurMissions?.map((mission) => (
          <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
            <CardContent className="space-y-4">
              {/* ... (le contenu existant reste inchangé) */}
              
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleOpenDetailDialog(mission); 
                  }} 
                  className="w-full"
                >
                  Voir les détails
                </Button>
                
                {mission.statut === 'en cours' && (
                  <>
                    <Button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenExpenseDialog(mission); 
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Ajouter des frais
                    </Button>
                    
                    {/* Nouveaux boutons pour les fiches */}
                    <Button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenDepartureSheetDialog(mission); 
                      }} 
                      variant="outline" 
                      className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800"
                    >
                      Fiche de Départ
                    </Button>
                    
                    <Button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenArrivalSheetDialog(mission); 
                      }} 
                      variant="outline" 
                      className="w-full bg-green-100 hover:bg-green-200 text-green-800"
                    >
                      Fiche d'Arrivée
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* ... (le reste du composant reste inchangé */}
    </div>
  );
};

export default MyMissions;