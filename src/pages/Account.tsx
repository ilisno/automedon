import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

const Account = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du compte...</div>;
  }

  if (!user) {
    // This case should ideally be handled by ProtectedRoute, but good to have a fallback
    return <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter pour voir cette page.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mon Compte</h1>

      {/* Basic Profile Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations du profil</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Email:</strong> {user.email}</p>
          {profile ? (
            <>
              <p><strong>Prénom:</strong> {profile.first_name || 'Non renseigné'}</p>
              <p><strong>Nom:</strong> {profile.last_name || 'Non renseigné'}</p>
              <p><strong>Téléphone:</strong> {profile.phone || 'Non renseigné'}</p>
              <p><strong>Type de société:</strong> {profile.company_type || 'Non renseigné'}</p>
              {/* Add other profile fields as needed */}
            </>
          ) : (
            <p>Chargement du profil ou profil incomplet...</p>
          )}
        </CardContent>
      </Card>

      {/* Placeholder for Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions en cours</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder data */}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missions du mois</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div> {/* Placeholder data */}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rémunération en cours</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00€</div> {/* Placeholder data */}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rémunération du mois</CardTitle>
            {/* Icon placeholder */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.00€</div> {/* Placeholder data */}
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Charts */}
      <Card className="mb-6">
         <CardHeader>
          <CardTitle>Statistiques (Graphiques)</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Les graphiques des missions et rémunérations seront affichés ici.</p> {/* Placeholder */}
        </CardContent>
      </Card>

      {/* Placeholder for Recent Missions */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <Card>
            <CardHeader>
              <CardTitle>Dernières missions ajoutées</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Liste des dernières missions ajoutées.</p> {/* Placeholder */}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Missions de dernière minute</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Liste des missions de dernière minute.</p> {/* Placeholder */}
            </CardContent>
          </Card>
       </div>

      {/* Add other sections as needed */}
    </div>
  );
};

export default Account;