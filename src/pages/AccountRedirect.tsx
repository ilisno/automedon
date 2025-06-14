import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";

const AccountRedirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        showError("Vous devez être connecté pour accéder à cette page.");
        navigate("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        console.error("Error fetching profile for redirection:", profileError);
        showError("Erreur lors du chargement de votre profil. Veuillez compléter vos informations.");
        // If profile doesn't exist or role is not set, default to concessionnaire page for now
        // In a real app, you might redirect to a "complete profile" page
        navigate("/concessionnaire");
        return;
      }

      if (profile.role === 'concessionnaire') {
        navigate("/concessionnaire");
      } else if (profile.role === 'convoyeur') {
        navigate("/convoyeur");
      } else {
        // If role is null or unknown, default to concessionnaire page or a profile completion page
        showError("Votre rôle n'est pas défini. Veuillez compléter votre profil.");
        navigate("/concessionnaire"); // Default redirect
      }
      setLoading(false);
    };

    checkUserRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Redirection vers votre espace...</p>
      </div>
    );
  }

  return null; // This component only redirects
};

export default AccountRedirect;