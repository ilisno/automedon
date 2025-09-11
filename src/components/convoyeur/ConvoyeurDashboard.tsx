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
import { useMissions } from "@/context/MissionsContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ConvoyeurDashboardProps {
  userId: string;
  isProfileComplete: boolean;
  onProfileCompleteChange: (isComplete: boolean) => void; // NEW: Prop to receive callback
}

const ConvoyeurDashboard: React.FC<ConvoyeurDashboardProps> = ({ userId, isProfileComplete, onProfileCompleteChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isProfileComplete ? "available-missions" : "profile"); // Set default tab based on profile completion
  const { useConvoyeurMissions } = useMissions();
  const { missions: convoyeurMissions } = useConvoyeurMissions(userId);

  useEffect(() => {
    if (!userId) {
      showError("Vous devez être connecté pour accéder à cette page.");
      navigate("/login");
    }
  }, [userId, navigate]);

  // Update activeTab if isProfileComplete changes
  useEffect(() => {
    if (!isProfileComplete && activeTab !== "profile") {
      setActiveTab("profile");
    }
  }, [isProfileComplete, activeTab]);

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold mb-6">Espace Convoyeur</h1>
      <p className="text-lg mb-8 text-center">
        Gérez vos missions, consultez votre chiffre d'affaires et mettez à jour votre profil.
      </p>

      {!isProfileComplete && (
        <Alert variant="destructive" className="mb-6 max-w-4xl">
          <Info className="h-4 w-4" />
          <AlertTitle>Profil incomplet !</AlertTitle>
          <AlertDescription>
            Veuillez compléter votre profil pour accéder à toutes les fonctionnalités.
          </AlertDescription>
        </Alert>
      )}

      <ConvoyeurTurnover userId={userId} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available-missions" disabled={!isProfileComplete}>Missions Disponibles</TabsTrigger>
          <TabsTrigger value="my-missions" disabled={!isProfileComplete}>Mes Missions</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>
        <TabsContent value="available-missions" className="mt-6">
          <AvailableMissions userId={userId} />
        </TabsContent>
        <TabsContent value="my-missions" className="mt-6">
          <MyMissions
            userId={userId}
            key={convoyeurMissions?.length}
          />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ConvoyeurProfile userId={userId} onProfileCompleteChange={onProfileCompleteChange} />
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