import React, { useState } from "react";
import { useMissions, Mission } from "@/context/MissionsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ClientMissionDetailDialog from "./ClientMissionDetailDialog";
import { showError } from "@/utils/toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { User } from "lucide-react"; // Import User icon

interface ClientMissionsListProps {
  userId: string;
}

const ClientMissionsList: React.FC<ClientMissionsListProps> = ({ userId }) => {
  const { useClientMissions, approveClientPrice } = useMissions();
  const { missions: clientMissions, isLoading: isLoadingMissions, refetch: refetchClientMissions } = useClientMissions(userId);

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

  const handleApprovePrice = async (missionId: string) => {
    try {
      await approveClientPrice(missionId);
      refetchClientMissions(); // Refetch missions to update UI
    } catch (error) {
      console.error("Error approving client price:", error);
      showError("Erreur lors de l'approbation du prix.");
    }
  };

  if (isLoadingMissions) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des missions...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientMissions && clientMissions.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Aucune mission créée pour le moment.</p>
        ) : (
          clientMissions?.map((mission) => (
            <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  De: {mission.lieu_depart} à {mission.lieu_arrivee}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Statut:</strong> <span className={`font-medium ${
                  mission.statut === 'Disponible' ? 'text-blue-600 dark:text-blue-400' :
                  mission.statut === 'en attente' ? 'text-yellow-600 dark:text-yellow-400' :
                  mission.statut === 'en cours' ? 'text-orange-600 dark:text-orange-400' :
                  'text-green-600 dark:text-green-400'
                }`}>{mission.statut}</span></p>
                <p><strong>Date limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                {mission.convoyeur_id && (
                  <div className="flex flex-col items-center space-y-2 mt-2"> {/* Centered column layout */}
                    <p className="font-semibold">Convoyeur:</p> {/* Added label */}
                    <div className="flex items-center space-x-2"> {/* Row for avatar and name */}
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mission.convoyeur_avatar_url || undefined} alt={`${mission.convoyeur_first_name} ${mission.convoyeur_last_name}`} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">
                        {mission.convoyeur_first_name} {mission.convoyeur_last_name}
                      </p>
                    </div>
                  </div>
                )}
                {mission.client_price && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Prix Client:</strong> {mission.client_price.toFixed(2)} €</p>}
                {mission.commentaires && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Commentaires:</strong> {mission.commentaires}</p>}
                
                {/* NEW: Client price validation for 'hors grille' missions */}
                {mission.is_hors_grille && mission.client_price && !mission.client_price_approved && mission.statut === 'Disponible' && (
                  <div className="mt-4 p-3 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Prix proposé pour cette mission hors grille: {mission.client_price.toFixed(2)} €
                    </p>
                    <Button onClick={() => handleApprovePrice(mission.id)} className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Accepter le prix
                    </Button>
                  </div>
                )}

                <Button onClick={() => handleOpenDetailDialog(mission)} className="w-full mt-4">
                  Voir les détails
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <ClientMissionDetailDialog
        mission={selectedMission}
        isOpen={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </div>
  );
};

export default ClientMissionsList;