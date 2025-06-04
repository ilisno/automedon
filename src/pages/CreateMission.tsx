import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess } from "@/utils/toast";
import Header from "@/components/Header";
import { useMissions } from "@/context/MissionsContext"; // Import useMissions

const CreateMission = () => {
  const { ajouterMission } = useMissions(); // Utilisation du hook de contexte

  const [immatriculation, setImmatriculation] = useState("");
  const [modele, setModele] = useState("");
  const [lieuDepart, setLieuDepart] = useState("");
  const [lieuArrivee, setLieuArrivee] = useState("");
  const [heureLimite, setHeureLimite] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Appel de la fonction ajouterMission du contexte
    ajouterMission({
      immatriculation,
      modele,
      lieuDepart,
      lieuArrivee,
      heureLimite,
    });

    // Vider le formulaire
    setImmatriculation("");
    setModele("");
    setLieuDepart("");
    setLieuArrivee("");
    setHeureLimite("");

    showSuccess("Mission créée avec succès ✅");
  };

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