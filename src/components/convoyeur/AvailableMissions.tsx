import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMissions } from "@/context/MissionsContext";
import { showError } from "@/utils/toast";

interface AvailableMissionsProps {
  userId: string;
}

const AvailableMissions: React.FC<AvailableMissionsProps> = ({ userId }) => {
  const { useAvailableMissions, takeMission } = useMissions();
  const { missions: availableMissions, isLoading: isLoadingAvailableMissions } = useAvailableMissions();

  const handlePrendreEnCharge = async (id: string) => {
    if (userId) {
      await takeMission(id, userId);
    } else {
      showError("Veuillez vous connecter pour prendre en charge une mission.");
    }
  };

  if (isLoadingAvailableMissions) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des missions disponibles...</p>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Missions Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableMissions && availableMissions.length === 0 ? (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Aucune mission disponible pour le moment.</p>
        ) : (
          availableMissions?.map((mission) => (
            <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  De: {mission.lieu_depart} à {mission.lieu_arrivee}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Statut:</strong> <span className="font-medium text-blue-600 dark:text-blue-400">{mission.statut}</span></p>
                <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                {mission.convoyeur_payout !== null && (
                  <p><strong>Rémunération:</strong> {mission.convoyeur_payout.toFixed(2)} €</p>
                )}
                <Button onClick={() => handlePrendreEnCharge(mission.id)} className="w-full">
                  Prendre en charge
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailableMissions;