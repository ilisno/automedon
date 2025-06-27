import React from "react";
import { useMissions } from "@/context/MissionsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ClientMissionsListProps {
  userId: string;
}

const ClientMissionsList: React.FC<ClientMissionsListProps> = ({ userId }) => {
  const { useClientMissions } = useMissions();
  const { missions: clientMissions, isLoading: isLoadingMissions } = useClientMissions(userId);

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
                {mission.convoyeur_id && <p><strong>Convoyeur:</strong> {mission.convoyeur_first_name} {mission.convoyeur_last_name}</p>}
                {mission.commentaires && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Commentaires:</strong> {mission.commentaires}</p>}
                {mission.price && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Prix:</strong> {mission.price} €</p>}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientMissionsList;