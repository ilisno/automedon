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

const AdminConcessionnaires: React.FC = () => {
  const { useConcessionnaires } = useMissions();
  const { profiles: concessionnaires, isLoading } = useConcessionnaires();

  if (isLoading) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des concessionnaires...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Tous les Concessionnaires</h2>
      {concessionnaires && concessionnaires.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucun concessionnaire trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Type d'entreprise</TableHead>
                <TableHead>SIRET</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Profil Complet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {concessionnaires?.map((concessionnaire) => (
                <TableRow key={concessionnaire.id}>
                  <TableCell className="text-xs">{concessionnaire.id.substring(0, 8)}...</TableCell>
                  <TableCell>{concessionnaire.first_name || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.last_name || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.phone || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.company_type || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.siret || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.city || 'N/A'}</TableCell>
                  <TableCell>{concessionnaire.is_profile_complete ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminConcessionnaires;