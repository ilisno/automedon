import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientDashboard from "@/components/client/ClientDashboard";
import ConvoyeurDashboard from "@/components/convoyeur/ConvoyeurDashboard";
import { Button } from "@/components/ui/button"; // Import Button

const Account = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'client' | 'convoyeur' | 'admin' | null>(null); // Include 'admin' role
  const [userId, setUserId] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
        .select('role, is_profile_complete')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching profile for account page:", profileError);
        showError("Erreur lors du chargement de votre profil. Veuillez compléter vos informations.");
        setUserRole('client'); // Default to client if profile is missing or role is not set
        setIsProfileComplete(false);
        setLoading(false);
        return;
      }

      setUserRole(profile.role); // Set the actual role
      setIsProfileComplete(profile.is_profile_complete);
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
        {userRole === 'client' && <ClientDashboard userId={userId!} isProfileComplete={isProfileComplete} onProfileCompleteChange={setIsProfileComplete} />}
        {userRole === 'convoyeur' && <ConvoyeurDashboard userId={userId!} isProfileComplete={isProfileComplete} onProfileCompleteChange={setIsProfileComplete} />}
        {userRole === 'admin' && ( // NEW: Admin specific content
          <div className="flex flex-col items-center justify-center p-4 text-center h-full">
            <h1 className="text-4xl font-bold mb-6">Espace Administrateur</h1>
            <p className="text-lg mb-8 text-center">
              Vous êtes connecté en tant qu'administrateur. Accédez à votre tableau de bord.
            </p>
            <Link to="/admin/dashboard">
              <Button className="px-8 py-4 text-lg">Accéder à l'espace Admin</Button>
            </Link>
          </div>
        )}
        {!userRole && ( // Fallback if role is not set or unknown
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