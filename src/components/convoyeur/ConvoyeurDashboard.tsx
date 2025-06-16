import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ConvoyeurProfile from "./ConvoyeurProfile";
import AvailableMissions from "./AvailableMissions";
import MyMissions from "./MyMissions";
import ConvoyeurTurnover from "./ConvoyeurTurnover";

const ConvoyeurDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [missionComments, setMissionComments] = useState<{ [key: string]: string }>({});
  const [missionPhotos, setMissionPhotos] = useState<{ [key: string]: string[] }>({});
  const [missionPrices, setMissionPrices] = useState<{ [key: string]: number }>({});

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
      <h1 className="text-4xl font-bold mb-6">Espace Convoyeur</h1>
      <p className="text-lg mb-8 text-center">
        Gérez vos missions, consultez votre chiffre d'affaires et mettez à jour votre profil.
      </p>

      <ConvoyeurTurnover userId={userId} />

      <Tabs defaultValue="available-missions" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available-missions">Missions Disponibles</TabsTrigger>
          <TabsTrigger value="my-missions">Mes Missions</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>
        <TabsContent value="available-missions" className="mt-6">
          <AvailableMissions userId={userId} />
        </TabsContent>
        <TabsContent value="my-missions" className="mt-6">
          <MyMissions
            userId={userId}
            missionComments={missionComments}
            missionPhotos={missionPhotos}
            missionPrices={missionPrices}
            setMissionComments={setMissionComments}
            setMissionPhotos={setMissionPhotos}
            setMissionPrices={setMissionPrices}
          />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ConvoyeurProfile userId={userId} />
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Link to="/">
          <Button variant="outline" className="px-8 py-4 text-lg">Retour à l'accueil</Button>
        </Link>
      </div>
    </div>
  );
};

export default ConvoyeurDashboard;