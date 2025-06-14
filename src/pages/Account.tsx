import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import ConcessionnaireAccount from '@/components/ConcessionnaireAccount';
import ConvoyeurAccount from '@/components/ConvoyeurAccount'; // Import the new component
import { Button } from '@/components/ui/button';

const Account = () => {
  const { user, profile, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('Account component mounted');
    setIsMounted(true);

    return () => {
      console.log('Account component unmounted');
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    console.log('Account useEffect - user:', user, 'profile:', profile, 'loading:', loading);
  }, [user, profile, loading]);

  if (!isMounted) {
    return null; // Prevent flash of loading state on initial mount
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du compte...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter pour voir cette page.</div>;
  }

  if (!profile || !profile.is_profile_complete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Profil incomplet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.</p>
            <Link to="/complete-profile">
              <Button>Compléter mon profil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render specific account view based on role
  if (profile.role === 'concessionnaire') {
    return <ConcessionnaireAccount />;
  }

  if (profile.role === 'convoyeur') {
    return <ConvoyeurAccount />;
  }

  // Default rendering for other roles or if no specific view is defined
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
          <p><strong>Prénom:</strong> {profile.first_name || 'Non renseigné'}</p>
          <p><strong>Nom:</strong> {profile.last_name || 'Non renseigné'}</p>
          <p><strong>Téléphone:</strong> {profile.phone || 'Non renseigné'}</p>
          <p><strong>Type de société:</strong> {profile.company_type || 'Non renseigné'}</p>
          <p><strong>Rôle:</strong> {profile.role || 'Non défini'}</p>
          {/* Add other profile fields as needed */}
        </CardContent>
      </Card>

      {profile.role === 'admin' && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Accès Administrateur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">En tant qu'administrateur, vous avez accès à toutes les données et la gestion des tarifs.</p>
            <Link to="/admin-dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Accéder au Tableau de Bord Admin</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {profile.role === 'autre' && (
        <Card className="mb-6 bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Votre Espace</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bienvenue sur votre compte. Votre rôle est défini comme "Autre".</p>
            <p className="mt-2">Si vous souhaitez changer votre rôle ou accéder à des fonctionnalités spécifiques, veuillez contacter l'administrateur.</p>
          </CardContent>
        </Card>
      )}

      {/* Placeholder for Statistics - visible for all roles, but data might vary */}
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