import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mission } from '@/types/mission';

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string; // Assuming email is available from auth.users
  role: string | null;
  company_type: string | null;
  phone: string | null;
};

const AdminDashboard = () => {
  const { user, profile: authProfile, loading: authLoading } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authProfile?.role !== 'admin') {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      setError(null);

      try {
        // Fetch all missions
        const { data: missionsData, error: missionsError } = await supabase
          .from('commandes')
          .select('*');

        if (missionsError) throw missionsError;
        setMissions(missionsData as Mission[]);

        // Fetch all profiles and associated user emails
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*, auth_users:id(email)'); // Join with auth.users to get email

        if (profilesError) throw profilesError;

        const enrichedProfiles: Profile[] = profilesData.map((p: any) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          email: p.auth_users?.email || 'N/A', // Extract email from joined data
          role: p.role,
          company_type: p.company_type,
          phone: p.phone,
        }));
        setProfiles(enrichedProfiles);

      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoadingData(false);
      }
    };

    if (!authLoading) {
      fetchData();
    }
  }, [user, authProfile, authLoading]);

  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du tableau de bord admin...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {error}</div>;
  }

  if (!user || authProfile?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Accès non autorisé.</div>;
  }

  const concessionnaires = profiles.filter(p => p.company_type === 'concessionnaire');
  const convoyeurs = profiles.filter(p => p.company_type === 'convoyeur');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>

      {/* Missions Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Toutes les missions</CardTitle>
        </CardHeader>
        <CardContent>
          {missions.length === 0 ? (
            <p>Aucune mission disponible.</p>
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
                    <TableHead>Heure Limite</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {missions.map((mission) => (
                    <TableRow key={mission.id}>
                      <TableCell className="font-medium">{mission.id.substring(0, 8)}...</TableCell>
                      <TableCell>{mission.immatriculation}</TableCell>
                      <TableCell>{mission.modele}</TableCell>
                      <TableCell>{mission.depart}</TableCell>
                      <TableCell>{mission.arrivee}</TableCell>
                      <TableCell>{mission.statut}</TableCell>
                      <TableCell>{new Date(mission.heureLimite).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Concessionnaires Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Concessionnaires</CardTitle>
        </CardHeader>
        <CardContent>
          {concessionnaires.length === 0 ? (
            <p>Aucun concessionnaire enregistré.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concessionnaires.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.last_name || 'N/A'}</TableCell>
                      <TableCell>{p.first_name || 'N/A'}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Convoyeurs Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Convoyeurs</CardTitle>
        </CardHeader>
        <CardContent>
          {convoyeurs.length === 0 ? (
            <p>Aucun convoyeur enregistré.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {convoyeurs.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.last_name || 'N/A'}</TableCell>
                      <TableCell>{p.first_name || 'N/A'}</TableCell>
                      <TableCell>{p.email}</TableCell>
                      <TableCell>{p.phone || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Management Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Tarifs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette section permettra de gérer les tarifs des missions. Des fonctionnalités pour définir les prix par distance, type de véhicule, etc., seront ajoutées ici.</p>
          {/* Future UI for pricing management */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;