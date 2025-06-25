import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ConcessionnaireProfile from "./ConcessionnaireProfile";
import ConcessionnaireMissionsList from "./ConcessionnaireMissionsList";

const ConcessionnaireDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        showError("Vous devez être connecté pour accéder à cette page.");
        navigate("/login");
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [navigate]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Chargement de votre espace...</p>
      </div>
    );
  }

  if (!userId) {
    return null; // Should redirect to login, but just in case
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Espace Concessionnaire</h1>
      <p className="text-lg mb-8 text-center">
        Bienvenue dans votre espace dédié. Gérez vos missions et mettez à jour votre profil.
      </p>

      <Tabs defaultValue="missions" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-mission">Créer une mission</TabsTrigger>
          <TabsTrigger value="missions">Mes Missions</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>
        <TabsContent value="create-mission" className="mt-6">
          <div className="flex justify-center">
            <Link to="/create-mission">
              <Button className="px-8 py-4 text-lg">Créer une nouvelle mission</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="missions" className="mt-6">
          <ConcessionnaireMissionsList userId={userId} />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ConcessionnaireProfile userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConcessionnaireDashboard;