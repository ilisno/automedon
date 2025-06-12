import React, { useState } from 'react';
import { useMissions } from '@/context/missionsContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Concessionnaire = () => {
  const [formData, setFormData] = useState({
    immatriculation: '',
    modele: '',
    lieuDepart: '',
    lieuArrivee: '',
    heureLimite: '',
  });

  const { ajouterMission } = useMissions();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ajouterMission({
        immatriculation: formData.immatriculation,
        modele: formData.modele,
        depart: formData.lieuDepart,
        arrivee: formData.lieuArrivee,
        heureLimite: formData.heureLimite,
      });
      setFormData({
        immatriculation: '',
        modele: '',
        lieuDepart: '',
        lieuArrivee: '',
        heureLimite: '',
      });
      toast({
        title: 'Mission créée ✅',
        description: 'La mission a été créée avec succès.',
      });
    } catch (error: any) {
      console.error('Error creating mission:', error);
      toast({
        title: 'Échec de la création de mission',
        description: error.message || 'Une erreur est survenue lors de la création de la mission.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Créer une mission de convoyage</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <Label htmlFor="immatriculation" className="block text-sm font-medium mb-1">
            Immatriculation
          </Label>
          <Input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="modele" className="block text-sm font-medium mb-1">
            Modèle
          </Label>
          <Input
            type="text"
            id="modele"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="lieuDepart" className="block text-sm font-medium mb-1">
            Lieu de départ
          </Label>
          <Input
            type="text"
            id="lieuDepart"
            name="lieuDepart"
            value={formData.lieuDepart}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="lieuArrivee" className="block text-sm font-medium mb-1">
            Lieu d’arrivée
          </Label>
          <Input
            type="text"
            id="lieuArrivee"
            name="lieuArrivee"
            value={formData.lieuArrivee}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="heureLimite" className="block text-sm font-medium mb-1">
            Heure limite de livraison
          </Label>
          <Input
            type="datetime-local"
            id="heureLimite"
            name="heureLimite"
            value={formData.heureLimite}
            onChange={handleChange}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Créer la mission
        </Button>
      </form>
    </div>
  );
};

export default Concessionnaire;