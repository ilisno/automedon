import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Bienvenue sur Automédon</h1>
      <div className="space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => navigate('/concessionnaire')}
        >
          Je suis concessionnaire
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
          onClick={() => navigate('/convoyeur')}
        >
          Je suis convoyeur
        </button>
      </div>
    </div>
  );
};

export default Index;