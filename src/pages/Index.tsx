import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMissions } from '@/context/missionsContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const Index = () => {
  const navigate = useNavigate();
  const { missions } = useMissions();
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const [search, setSearch] = useState({
    depart: '',
    arrivee: '',
    date: '',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };

  const filteredMissions = missions.filter((mission) => {
    const missionDate = new Date(mission.heureLimite).toLocaleDateString();
    const searchDate = search.date ? new Date(search.date).toLocaleDateString() : '';
    return (
      (search.depart === '' || mission.depart.toLowerCase().includes(search.depart.toLowerCase())) &&
      (search.arrivee === '' || mission.arrivee.toLowerCase().includes(search.arrivee.toLowerCase())) &&
      (search.date === '' || missionDate === searchDate)
    );
  });

  const handleRoleButtonClick = (role: 'concessionnaire' | 'convoyeur') => {
    if (authLoading) {
      // Do nothing if auth is still loading
      return;
    }
    if (user) {
      navigate('/account'); // If logged in, go to account page
    } else {
      navigate('/login'); // If not logged in, go to login page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Bienvenue sur Automédon</h1>
          <p className="text-xl mb-8">Gérez vos missions de convoyage de manière efficace et intuitive</p>
          <div className="space-x-4">
            <button
              className="px-6 py-3 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleRoleButtonClick('concessionnaire')}
              disabled={authLoading}
            >
              Je suis concessionnaire
            </button>
            <button
              className="px-6 py-3 bg-white text-blue-500 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleRoleButtonClick('convoyeur')}
              disabled={authLoading}
            >
              Je suis convoyeur
            </button>
          </div>
        </div>
        <div className="bg-white text-black p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-3xl font-bold mb-6">Rechercher une mission</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="depart" className="block text-sm font-medium mb-1">
                Ville de départ
              </label>
              <input
                type="text"
                id="depart"
                name="depart"
                value={search.depart}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="arrivee" className="block text-sm font-medium mb-1">
                Ville d’arrivée
              </label>
              <input
                type="text"
                id="arrivee"
                name="arrivee"
                value={search.arrivee}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={search.date}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
        </div>
        <div className="bg-white text-black p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Missions récentes</h2>
          <div className="space-y-6">
            {filteredMissions.slice(0, 3).map((mission) => (
              <div key={mission.id} className="p-4 bg-gray-100 rounded-md shadow-md">
                <h3 className="text-2xl font-semibold">{mission.modele}</h3>
                <p><strong>Immatriculation:</strong> {mission.immatriculation}</p>
                <p><strong>Départ:</strong> {mission.depart}</p>
                <p><strong>Arrivée:</strong> {mission.arrivee}</p>
                <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                <p><strong>Statut:</strong> {mission.statut}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;