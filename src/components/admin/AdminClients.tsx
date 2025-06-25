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

const AdminClients: React.FC = () => {
  const { useClients } = useMissions();
  const { profiles: clients, isLoading } = useClients();

  if (isLoading) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement des clients...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Tous les Clients</h2>
      {clients && clients.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Aucun client trouvé.</p>
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
              {clients?.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="text-xs">{client.id.substring(0, 8)}...</TableCell>
                  <TableCell>{client.first_name || 'N/A'}</TableCell>
                  <TableCell>{client.last_name || 'N/A'}</TableCell>
                  <TableCell>{client.phone || 'N/A'}</TableCell>
                  <TableCell>{client.company_type || 'N/A'}</TableCell>
                  <TableCell>{client.siret || 'N/A'}</TableCell>
                  <TableCell>{client.city || 'N/A'}</TableCell>
                  <TableCell>{client.is_profile_complete ? 'Oui' : 'Non'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminClients;