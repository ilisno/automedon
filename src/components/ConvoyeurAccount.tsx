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
import { Textarea } from '@/components/ui/textarea';

const ConvoyeurAccount = () => {
  const { user, profile, getProfile } = useAuth();
  const { missions, loadingMissions, errorMissions, mettreAJourStatut, updateMissionDetails, assignerConvoyeur } = useMissions(); // Added assignerConvoyeur
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: profile?.phone || '',
    date_of_birth: profile?.date_of_birth || '',
    languages: Array.isArray(profile?.languages) ? profile?.languages.join(', ') : profile?.languages || '',
    company_type: profile?.company_type || '',
    address: profile?.address || '',
    postal_code: profile?.postal_code || '',
    city: profile?.city || '',
    driver_license_number: profile?.driver_license_number || '',
    license_issue_date: profile?.license_issue_date || '',
    license_issue_city: profile?.license_issue_city || '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [commentaires, setCommentaires] = useState<{ [key: string]: string }>({});
  const [photos, setPhotos] = useState<{ [key: string]: File[] }>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        languages: Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages || '',
        company_type: profile.company_type || '',
        address: profile.address || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        driver_license_number: profile.driver_license_number || '',
        license_issue_date: profile.license_issue_date || '',
        license_issue_city: profile.license_issue_city || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    // Initialize comments from mission data if available
    missions.forEach(mission => {
      if (mission.commentaires && typeof mission.commentaires === 'string') {
        setCommentaires(prev => ({ ...prev, [mission.id]: mission.commentaires as string }));
      }
    });
  }, [missions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang !== '');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth || null,
          languages: languagesArray,
          company_type: formData.company_type,
          role: formData.company_type, // Ensure role is updated with company_type
          address: formData.address,
          postal_code: formData.postal_code,
          city: formData.city,
          driver_license_number: formData.driver_license_number,
          license_issue_date: formData.license_issue_date || null,
          license_issue_city: formData.license_issue_city,
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

  const availableMissions = missions.filter(mission => mission.statut === 'en attente');
  const myAcceptedMissions = missions.filter(mission => mission.convoyeur_id === user?.id && (mission.statut === 'acceptée' || mission.statut === 'en cours'));
  const myCompletedMissions = missions.filter(mission => mission.convoyeur_id === user?.id && mission.statut === 'livrée');

  const handlePrendreEnCharge = async (id: string) => {
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour prendre en charge une mission.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await assignerConvoyeur(id, user.id); // Assign convoyeur and set status to 'acceptée'
      toast({
        title: 'Mission acceptée ✅',
        description: 'Vous avez pris en charge cette mission.',
      });
    } catch (error: any) {
      console.error('Error taking charge of mission:', error);
      toast({
        title: 'Échec de l\'acceptation',
        description: error.message || 'Une erreur est survenue lors de la prise en charge.',
        variant: 'destructive',
      });
    }
  };

  const handleDebutMission = async (id: string) => {
    try {
      await mettreAJourStatut(id, 'en cours');
      toast({
        title: 'Mission débutée ▶️',
        description: 'La mission est maintenant en cours.',
      });
    } catch (error: any) {
      console.error('Error starting mission:', error);
      toast({
        title: 'Échec du démarrage',
        description: error.message || 'Une erreur est survenue lors du démarrage de la mission.',
        variant: 'destructive',
      });
    }
  };

  const handleMarquerCommeLivree = async (id: string) => {
    try {
      const missionUpdates: Partial<Mission> = {
        commentaires: commentaires[id] || null,
        // For photos, you'd typically upload them to Supabase Storage here
        // For now, we'll just mark the mission as delivered.
        // photos: photos[id] ? photos[id].map(f => f.name) : [], // Placeholder for photo URLs
      };
      await updateMissionDetails(id, missionUpdates); // Update comments/photos first
      await mettreAJourStatut(id, 'livrée'); // Then update status

      // Clear local state for comments and photos
      setCommentaires(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      setPhotos(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      toast({
        title: 'Mission livrée ✅',
        description: 'La mission a été marquée comme livrée.',
      });
    } catch (error: any) {
      console.error('Error marking mission as delivered:', error);
      toast({
        title: 'Échec de la livraison',
        description: error.message || 'Une erreur est survenue lors du marquage comme livrée.',
        variant: 'destructive',
      });
    }
  };

  const handleCommentChange = (id: string, value: string) => {
    setCommentaires(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(prev => ({ ...prev, [id]: Array.from(e.target.files) }));
      console.log(`Photos for mission ${id}:`, Array.from(e.target.files));
      toast({
        title: 'Photos sélectionnées',
        description: `${Array.from(e.target.files).length} fichier(s) sélectionné(s).`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Espace Convoyeur</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4"> {/* Added a tab for available missions */}
          <TabsTrigger value="profile">Mes Infos</TabsTrigger>
          <TabsTrigger value="available-missions">Missions disponibles</TabsTrigger>
          <TabsTrigger value="track-missions">Mes missions</TabsTrigger>
          <TabsTrigger value="history">Historique des missions</TabsTrigger>
        </TabsList>

        {/* Mes Infos Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil du Convoyeur</CardTitle>
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
                  <Label htmlFor="date_of_birth">Date de naissance</Label>
                  <Input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="languages">Langues (séparées par des virgules)</Label>
                  <Input id="languages" name="languages" value={formData.languages} onChange={handleChange} placeholder="Ex: Français, Anglais" />
                </div>
                <div>
                  <Label htmlFor="driver_license_number">Numéro de permis</Label>
                  <Input id="driver_license_number" name="driver_license_number" value={formData.driver_license_number} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="license_issue_date">Date d'obtention du permis</Label>
                  <Input type="date" id="license_issue_date" name="license_issue_date" value={formData.license_issue_date} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="license_issue_city">Ville de délivrance du permis</Label>
                  <Input id="license_issue_city" name="license_issue_city" value={formData.license_issue_city} onChange={handleChange} required />
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

        {/* Missions disponibles Tab */}
        <TabsContent value="available-missions">
          <Card>
            <CardHeader>
              <CardTitle>Missions disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMissions ? (
                <p>Chargement des missions...</p>
              ) : errorMissions ? (
                <p className="text-red-500">Erreur: {errorMissions}</p>
              ) : availableMissions.length === 0 ? (
                <p>Aucune mission disponible pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {availableMissions.map((mission) => (
                    <div key={mission.id} className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                      <h2 className="text-xl font-bold mb-2">{mission.modele} - {mission.immatriculation}</h2>
                      <p><strong>Départ:</strong> {mission.depart}</p>
                      <p><strong>Arrivée:</strong> {mission.arrivee}</p>
                      <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                      <p><strong>Statut:</strong> {mission.statut}</p>
                      <Button
                        onClick={() => handlePrendreEnCharge(mission.id)}
                        className="mt-4 bg-green-500 text-white hover:bg-green-600"
                      >
                        Prendre en charge
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mes missions acceptées/en cours */}
        <TabsContent value="track-missions">
          <Card>
            <CardHeader>
              <CardTitle>Mes missions (acceptées et en cours)</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMissions ? (
                <p>Chargement des missions...</p>
              ) : errorMissions ? (
                <p className="text-red-500">Erreur: {errorMissions}</p>
              ) : myAcceptedMissions.length === 0 ? (
                <p>Vous n'avez pas de missions acceptées ou en cours.</p>
              ) : (
                <div className="space-y-4">
                  {myAcceptedMissions.map((mission) => (
                    <div key={mission.id} className="p-4 bg-white rounded-md shadow-md border border-blue-200">
                      <h2 className="text-xl font-bold mb-2">{mission.modele} - {mission.immatriculation}</h2>
                      <p><strong>Départ:</strong> {mission.depart}</p>
                      <p><strong>Arrivée:</strong> {mission.arrivee}</p>
                      <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                      <p><strong>Statut:</strong> {mission.statut}</p>

                      {mission.statut === 'acceptée' && (
                        <Button
                          onClick={() => handleDebutMission(mission.id)}
                          className="mt-4 bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                          Débuter la mission
                        </Button>
                      )}
                      {mission.statut === 'en cours' && (
                        <>
                          <Button
                            onClick={() => handleMarquerCommeLivree(mission.id)}
                            className="mt-4 bg-blue-500 text-white hover:bg-blue-600"
                          >
                            Marquer comme livrée
                          </Button>
                          <div className="mt-4">
                            <Label htmlFor={`commentaires-${mission.id}`} className="block text-sm font-medium mb-1">
                              Commentaires
                            </Label>
                            <Textarea
                              id={`commentaires-${mission.id}`}
                              value={commentaires[mission.id] || ''}
                              onChange={(e) => handleCommentChange(mission.id, e.target.value)}
                              placeholder="Ajouter des commentaires sur la mission..."
                            />
                          </div>
                          <div className="mt-4">
                            <Label htmlFor={`photos-${mission.id}`} className="block text-sm font-medium mb-1">
                              Photos (avant/après)
                            </Label>
                            <Input
                              type="file"
                              id={`photos-${mission.id}`}
                              multiple
                              onChange={(e) => handlePhotoChange(mission.id, e)}
                            />
                            {photos[mission.id] && photos[mission.id].length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">{photos[mission.id].length} fichier(s) sélectionné(s).</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique des missions terminées */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique des missions terminées</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMissions ? (
                <p>Chargement de l'historique des missions...</p>
              ) : errorMissions ? (
                <p className="text-red-500">Erreur: {errorMissions}</p>
              ) : myCompletedMissions.length === 0 ? (
                <p>Vous n'avez pas encore de missions terminées.</p>
              ) : (
                <div className="space-y-4">
                  {myCompletedMissions.map((mission) => (
                    <div key={mission.id} className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                      <h2 className="text-xl font-bold mb-2">{mission.modele} - {mission.immatriculation}</h2>
                      <p><strong>Départ:</strong> {mission.depart}</p>
                      <p><strong>Arrivée:</strong> {mission.arrivee}</p>
                      <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                      <p><strong>Statut:</strong> {mission.statut}</p>
                      {mission.commentaires && <p><strong>Commentaires:</strong> {mission.commentaires}</p>}
                      {mission.photos && mission.photos.length > 0 && (
                        <p><strong>Photos:</strong> {mission.photos.length} photo(s) soumise(s).</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConvoyeurAccount;