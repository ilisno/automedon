import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/toast";
import Header from "@/components/Header";
import { useMissions } from "@/context/MissionsContext";
import { supabase } from "@/integrations/supabase/client";

const CreateMission = () => {
  const { addMission } = useMissions();
  const navigate = useNavigate();
  const [concessionnaireId, setConcessionnaireId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [immatriculation, setImmatriculation] = useState("");
  const [modele, setModele] = useState("");
  const [lieu_depart, setLieu_depart] = useState("");
  const [lieu_arrivee, setLieu_arrivee] = useState("");
  const [heureLimite, setHeureLimite] = useState("");

  useEffect(() => {
    const fetchUserAndRole = async () => {
      setLoadingUser(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        showError("Vous devez être connecté pour créer une mission.");
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'concessionnaire') {
        showError("Seuls les concessionnaires peuvent créer des missions.");
        navigate("/account"); // Redirect to account page if not a concessionnaire
        return;
      }

      setConcessionnaireId(user.id);
      setLoadingUser(false);
    };
    fetchUserAndRole();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!concessionnaireId) {
      showError("Impossible de créer la mission : utilisateur non identifié ou rôle incorrect.");
      return;
    }

    try {
      await addMission({
        immatriculation,
        modele,
        lieu_depart,
        lieu_arrivee,
        heureLimite,
        concessionnaire_id: concessionnaireId,
      });

      // Vider le formulaire
      setImmatriculation("");
      setModele("");
      setLieu_depart("");
      setLieu_arrivee("");
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
              <Label htmlFor="lieu_depart">Lieu de départ</Label>
              <Input
                id="lieu_depart"
                type="text"
                value={lieu_depart}
                onChange={(e) => setLieu_depart(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lieu_arrivee">Lieu d'arrivée</Label>
              <Input
                id="lieu_arrivee"
                type="text"
                value={lieu_arrivee}
                onChange={(e) => setLieu_arrivee(e.target.value)}
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