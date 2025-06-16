import React from "react";
import { useMissions, Profile } from "@/context/MissionsContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminConvoyeurs: React.FC = () => {
  const { useConvoyeurs } = useMissions();
  const { profiles: convoyeurs, isLoading } = useConvoyeurs();

  if (isLoading) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des convoyeurs...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Tous les Convoyeurs</h2>
      {convoyeurs && convoyeurs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucun convoyeur trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Profil Complet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {convoyeurs?.map((convoyeur) => (
                <TableRow key={convoyeur.id}>
                  <TableCell className="text-xs">{convoyeur.id.substring(0, 8)}...</TableCell>
                  <TableCell>{convoyeur.first_name || 'N/A'}</TableCell>
                  <TableCell>{convoyeur.last_name || 'N/A'}</TableCell>
                  <TableCell>{convoyeur.phone || 'N/A'}</TableCell>
                  <TableCell>{convoyeur.city || 'N/A'}</TableCell>
                  <TableCell>{convoyeur.is_profile_complete ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminConvoyeurs;