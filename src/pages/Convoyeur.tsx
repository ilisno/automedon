import React, { useState, useEffect } from 'react';
import { useMissions } from '@/context/missionsContext';
import { Mission } from '@/types/mission';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

const Convoyeur = () => {
  const { user } = useAuth();
  const { missions, mettreAJourStatut, updateMissionDetails, loadingMissions, errorMissions, assignerConvoyeur } = useMissions();
  const [commentaires, setCommentaires] = useState<{ [key: string]: string }>({});
  const [photos, setPhotos] = useState<{ [key: string]: File[] }>({}); // Still local for now, needs Supabase Storage for persistence

  useEffect(() => {
    // Initialize comments from mission data if available
    missions.forEach(mission => {
      if (mission.commentaires && typeof mission.commentaires === 'string') {
        setCommentaires(prev => ({ ...prev, [mission.id]: mission.commentaires as string }));
      }
    });
  }, [missions]);


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
      // First, update comments and photos if any
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
        description: `${Array.from(e.target.files).length} photo(s) prête(s) à être soumise(s).`,
      });
    }
  };

  if (loadingMissions) {
    return <div className="min-h-screen flex items-center justify-center">Chargement des missions...</div>;
  }

  if (errorMissions) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Erreur: {errorMissions}</div>;
  }

  const availableMissions = missions.filter(mission => mission.statut === 'en attente');
  const myAcceptedMissions = missions.filter(mission => mission.convoyeur_id === user?.id && (mission.statut === 'acceptée' || mission.statut === 'en cours'));
  const myCompletedMissions = missions.filter(mission => mission.convoyeur_id === user?.id && mission.statut === 'livrée');


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Espace Convoyeur</h1>

      <div className="w-full max-w-2xl space-y-8">
        {/* Missions disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Missions disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            {availableMissions.length === 0 ? (
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

        {/* Mes missions acceptées/en cours */}
        <Card>
          <CardHeader>
            <CardTitle>Mes missions (acceptées et en cours)</CardTitle>
          </CardHeader>
          <CardContent>
            {myAcceptedMissions.length === 0 ? (
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

        {/* Historique des missions terminées */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des missions terminées</CardTitle>
          </CardHeader>
          <CardContent>
            {myCompletedMissions.length === 0 ? (
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
      </div>
    </div>
  );
};

export default Convoyeur;