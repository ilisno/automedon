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

      // Redirect directly to the unified account page
      navigate("/account");
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