import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import Header from "@/components/Header";
import { useMissions } from "@/context/MissionsContext";
import { supabase } from "@/integrations/supabase/client";

const CreateMission = () => {
  const { addMission } = useMissions();
  const [concessionnaireId, setConcessionnaireId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [immatriculation, setImmatriculation] = useState("");
  const [modele, setModele] = useState("");
  const [lieuDepart, setLieuDepart] = useState("");
  const [lieuArrivee, setLieuArrivee] = useState("");
  const [heureLimite, setHeureLimite] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setConcessionnaireId(user.id);
      } else {
        showError("Vous devez être connecté pour créer une mission.");
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concessionnaireId) {
      showError("Impossible de créer la mission : utilisateur non identifié.");
      return;
    }

    try {
      await addMission({
        immatriculation,
        modele,
        lieuDepart,
        lieuArrivee,
        heureLimite,
        concessionnaire_id: concessionnaireId,
      });

      // Vider le formulaire
      setImmatriculation("");
      setModele("");
      setLieuDepart("");
      setLieuArrivee("");
      setHeureLimite("");
    } catch (error) {
      // Error handled by useMutation in MissionsContext
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Créer une mission de convoyage</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="immatriculation">Immatriculation</Label>
              <Input
                id="immatriculation"
                type="text"
                value={immatriculation}
                onChange={(e) => setImmatriculation(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="modele">Modèle</Label>
              <Input
                id="modele"
                type="text"
                value={modele}
                onChange={(e) => setModele(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lieuDepart">Lieu de départ</Label>
              <Input
                id="lieuDepart"
                type="text"
                value={lieuDepart}
                onChange={(e) => setLieuDepart(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lieuArrivee">Lieu d'arrivée</Label>
              <Input
                id="lieuArrivee"
                type="text"
                value={lieuArrivee}
                onChange={(e) => setLieuArrivee(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="heureLimite">Heure limite de livraison</Label>
              <Input
                id="heureLimite"
                type="datetime-local"
                value={heureLimite}
                onChange={(e) => setHeureLimite(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full px-8 py-2 text-lg">
              Créer la mission
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/concessionnaire">
              <Button variant="link" className="text-primary dark:text-primary-foreground">Retour à l'espace Concessionnaire</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateMission;