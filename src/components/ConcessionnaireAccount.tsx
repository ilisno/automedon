import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { useMissions } from '@/context/missionsContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mission } from '@/types/mission';

const ConcessionnaireAccount = () => {
  const { user, profile, getProfile } = useAuth();
  const { missions, loadingMissions, errorMissions } = useMissions();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    company_type: profile?.company_type || '',
    siret: profile?.siret || '',
    address: profile?.address || '',
    postal_code: profile?.postal_code || '',
    city: profile?.city || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        company_type: profile.company_type || '',
        siret: profile.siret || '',
        address: profile.address || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour mettre à jour votre profil.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          company_type: formData.company_type,
          role: formData.company_type, // Ensure role is updated with company_type
          siret: formData.siret,
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profil mis à jour ✅',
        description: 'Vos informations ont été enregistrées avec succès.',
      });
      await getProfile(user.id); // Refresh profile in AuthContext
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Erreur de mise à jour',
        description: err.message || 'Échec de la mise à jour du profil.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const concessionnaireMissions = missions.filter(
    (mission) => mission.concessionnaire_id === user?.id
  );

  const missionsEnCours = concessionnaireMissions.filter(
    (mission) => mission.statut === 'en attente' || mission.statut === 'acceptée' || mission.statut === 'en cours'
  );

  const historiqueMissions = concessionnaireMissions.filter(
    (mission) => mission.statut === 'livrée'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Espace Concessionnaire</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Mes Infos</TabsTrigger>
          <TabsTrigger value="create-mission">Créer une mission</TabsTrigger>
          <TabsTrigger value="track-missions">Suivi des missions</TabsTrigger>
          <TabsTrigger value="history">Historique des missions</TabsTrigger>
        </TabsList>

        {/* Mes Infos Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil de l'entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="company_type">Type de société</Label>
                  <Select onValueChange={(value) => handleSelectChange('company_type', value)} value={formData.company_type} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concessionnaire">Concessionnaire</SelectItem>
                      <SelectItem value="convoyeur">Convoyeur</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input id="siret" name="siret" value={formData.siret} onChange={handleChange} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="postal_code">Code postal</Label>
                  <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Mise à jour...' : 'Mettre à jour le profil'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Créer une mission Tab */}
        <TabsContent value="create-mission">
          <Card>
            <CardHeader>
              <CardTitle>Créer une nouvelle mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Cliquez sur le bouton ci-dessous pour créer une nouvelle mission de convoyage.</p>
              <Link to="/concessionnaire">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Accéder au formulaire de création de mission</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suivi des missions Tab */}
        <TabsContent value="track-missions">
          <Card>
            <CardHeader>
              <CardTitle>Missions en cours</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMissions ? (
                <p>Chargement des missions...</p>
              ) : errorMissions ? (
                <p className="text-red-500">Erreur: {errorMissions}</p>
              ) : missionsEnCours.length === 0 ? (
                <p>Aucune mission en cours pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immatriculation</TableHead>
                        <TableHead>Modèle</TableHead>
                        <TableHead>Départ</TableHead>
                        <TableHead>Arrivée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Heure Limite</TableHead>
                        <TableHead>Convoyeur</TableHead>
                        <TableHead>Photos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {missionsEnCours.map((mission) => (
                        <TableRow key={mission.id}>
                          <TableCell className="font-medium">{mission.immatriculation}</TableCell>
                          <TableCell>{mission.modele}</TableCell>
                          <TableCell>{mission.depart}</TableCell>
                          <TableCell>{mission.arrivee}</TableCell>
                          <TableCell>{mission.statut}</TableCell>
                          <TableCell>{new Date(mission.heureLimite).toLocaleString()}</TableCell>
                          <TableCell>{mission.convoyeur_id ? 'Assigné' : 'Non assigné'}</TableCell>
                          <TableCell>{mission.photos && mission.photos.length > 0 ? 'Oui' : 'Non'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des missions Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des missions</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMissions ? (
                <p>Chargement de l'historique des missions...</p>
              ) : errorMissions ? (
                <p className="text-red-500">Erreur: {errorMissions}</p>
              ) : historiqueMissions.length === 0 ? (
                <p>Aucune mission terminée pour le moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Immatriculation</TableHead>
                        <TableHead>Modèle</TableHead>
                        <TableHead>Départ</TableHead>
                        <TableHead>Arrivée</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Heure Limite</TableHead>
                        <TableHead>Convoyeur</TableHead>
                        <TableHead>Photos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historiqueMissions.map((mission) => (
                        <TableRow key={mission.id}>
                          <TableCell className="font-medium">{mission.immatriculation}</TableCell>
                          <TableCell>{mission.modele}</TableCell>
                          <TableCell>{mission.depart}</TableCell>
                          <TableCell>{mission.arrivee}</TableCell>
                          <TableCell>{mission.statut}</TableCell>
                          <TableCell>{new Date(mission.heureLimite).toLocaleString()}</TableCell>
                          <TableCell>{mission.convoyeur_id ? 'Assigné' : 'Non assigné'}</TableCell>
                          <TableCell>{mission.photos && mission.photos.length > 0 ? 'Oui' : 'Non'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConcessionnaireAccount;