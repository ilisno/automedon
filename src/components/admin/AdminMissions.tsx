import React, { useState } from "react";
import { useMissions, Mission } from "@/context/MissionsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showError } from "@/utils/toast";

const AdminMissions: React.FC = () => {
  const { useAllMissions, updateMission } = useMissions();
  const { missions, isLoading } = useAllMissions();
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  const handleEditPrice = (mission: Mission) => {
    setEditingPriceId(mission.id);
    setCurrentPrice(mission.price || 0);
  };

  const handleSavePrice = async (missionId: string) => {
    if (currentPrice <= 0) {
      showError("Le prix doit être un nombre positif.");
      return;
    }
    await updateMission(missionId, { price: currentPrice });
    setEditingPriceId(null);
    setCurrentPrice(0);
  };

  if (isLoading) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement de toutes les missions...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Toutes les Missions</h2>
      {missions && missions.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucune mission trouvée.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Concessionnaire</TableHead>
                <TableHead>Convoyeur</TableHead>
                <TableHead>Heure Limite</TableHead>
                <TableHead>Prix (€)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions?.map((mission) => (
                <TableRow key={mission.id}>
                  <TableCell className="text-xs">{mission.id.substring(0, 8)}...</TableCell>
                  <TableCell>{mission.immatriculation}</TableCell>
                  <TableCell>{mission.modele}</TableCell>
                  <TableCell>{mission.lieu_depart}</TableCell>
                  <TableCell>{mission.lieu_arrivee}</TableCell>
                  <TableCell>{mission.statut}</TableCell>
                  <TableCell className="text-xs">{mission.concessionnaire_id ? mission.concessionnaire_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell className="text-xs">{mission.convoyeur_id ? mission.convoyeur_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell>{new Date(mission.heureLimite).toLocaleString()}</TableCell>
                  <TableCell>
                    {editingPriceId === mission.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={currentPrice}
                        onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
                        className="w-24"
                      />
                    ) : (
                      mission.price?.toFixed(2) || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingPriceId === mission.id ? (
                      <Button size="sm" onClick={() => handleSavePrice(mission.id)}>
                        Sauver
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditPrice(mission)}>
                        Modifier Prix
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminMissions;