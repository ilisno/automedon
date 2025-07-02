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
  const [editingMissionId, setEditingMissionId] = useState<string | null>(null);
  const [currentClientPrice, setCurrentClientPrice] = useState<number>(0);
  const [currentConvoyeurPayout, setCurrentConvoyeurPayout] = useState<number>(0);

  const handleEditPrices = (mission: Mission) => {
    setEditingMissionId(mission.id);
    setCurrentClientPrice(mission.client_price || 0);
    setCurrentConvoyeurPayout(mission.convoyeur_payout || 0);
  };

  const handleSavePrices = async (missionId: string) => {
    if (currentClientPrice <= 0 || currentConvoyeurPayout <= 0) {
      showError("Les prix doivent être des nombres positifs.");
      return;
    }
    await updateMission(missionId, { client_price: currentClientPrice, convoyeur_payout: currentConvoyeurPayout });
    setEditingMissionId(null);
    setCurrentClientPrice(0);
    setCurrentConvoyeurPayout(0);
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
                <TableHead>Prix Client (€)</TableHead> {/* NEW */}
                <TableHead>Rémunération Convoyeur (€)</TableHead> {/* RENAMED */}
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
                  <TableCell className="text-xs">{mission.client_id ? mission.client_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell className="text-xs">{mission.convoyeur_id ? mission.convoyeur_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell>{new Date(mission.heureLimite).toLocaleString()}</TableCell>
                  <TableCell>
                    {editingMissionId === mission.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={currentClientPrice}
                        onChange={(e) => setCurrentClientPrice(parseFloat(e.target.value))}
                        className="w-24"
                      />
                    ) : (
                      mission.client_price?.toFixed(2) || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMissionId === mission.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={currentConvoyeurPayout}
                        onChange={(e) => setCurrentConvoyeurPayout(parseFloat(e.target.value))}
                        className="w-24"
                      />
                    ) : (
                      mission.convoyeur_payout?.toFixed(2) || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingMissionId === mission.id ? (
                      <Button size="sm" onClick={() => handleSavePrices(mission.id)}>
                        Sauver
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditPrices(mission)}>
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