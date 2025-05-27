import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Concessionnaire = () => {
  const [formData, setFormData] = useState({
    immatriculation: '',
    modele: '',
    lieuDepart: '',
    lieuArrivee: '',
    heureLimite: '',
  });

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    setFormData({
      immatriculation: '',
      modele: '',
      lieuDepart: '',
      lieuArrivee: '',
      heureLimite: '',
    });
    toast({
      title: 'Mission créée avec succès ✅',
      description: 'La mission a été créée avec succès.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">Créer une mission de convoyage</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="immatriculation" className="block text-sm font-medium mb-1">
            Immatriculation
          </label>
          <input
            type="text"
            id="immatriculation"
            name="immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="modele" className="block text-sm font-medium mb-1">
            Modèle
          </label>
          <input
            type="text"
            id="modele"
            name="modele"
            value={formData.modele}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lieuDepart" className="block text-sm font-medium mb-1">
            Lieu de départ
          </label>
          <input
            type="text"
            id="lieuDepart"
            name="lieuDepart"
            value={formData.lieuDepart}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lieuArrivee" className="block text-sm font-medium mb-1">
            Lieu d’arrivée
          </label>
          <input
            type="text"
            id="lieuArrivee"
            name="lieuArrivee"
            value={formData.lieuArrivee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="heureLimite" className="block text-sm font-medium mb-1">
            Heure limite de livraison
          </label>
          <input
            type="datetime-local"
            id="heureLimite"
            name="heureLimite"
            value={formData.heureLimite}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Créer la mission
        </button>
      </form>
    </div>
  );
};

export default Concessionnaire;