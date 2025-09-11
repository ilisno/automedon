import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientDashboard from "@/components/client/ClientDashboard";
import ConvoyeurDashboard from "@/components/convoyeur/ConvoyeurDashboard";

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'client' | 'convoyeur' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false); // NEW state for profile completion

  useEffect(() => {
    const checkUserRole = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        showError("Vous devez être connecté pour accéder à cette page.");
        navigate("/login");
        return;
      }

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_profile_complete') // Fetch is_profile_complete
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching profile for account page:", profileError);
        showError("Erreur lors du chargement de votre profil. Veuillez compléter vos informations.");
        setUserRole('client'); // Default to client if profile is missing or role is not set
        setIsProfileComplete(false); // Profile is definitely not complete
        setLoading(false);
        return;
      }

      if (profile.role === 'client' || profile.role === 'convoyeur') {
        setUserRole(profile.role);
      } else {
        showError("Votre rôle n'est pas défini. Veuillez compléter votre profil.");
        setUserRole('client'); // Default to client if role is unknown
      }
      setIsProfileComplete(profile.is_profile_complete); // Set profile completion status
      setLoading(false);
    };

    checkUserRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow">
        {userRole === 'client' && <ClientDashboard userId={userId!} isProfileComplete={isProfileComplete} />}
        {userRole === 'convoyeur' && <ConvoyeurDashboard userId={userId!} isProfileComplete={isProfileComplete} />}
        {!userRole && (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-bold mb-6">Bienvenue sur votre compte</h1>
            <p className="text-lg mb-8 text-center">
              Votre rôle n'est pas encore défini. Veuillez contacter l'administrateur ou compléter votre profil.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;