import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import ClientProfile from "./ClientProfile";
import ClientMissionsList from "./ClientMissionsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ClientDashboardProps {
  userId: string;
  isProfileComplete: boolean;
  onProfileCompleteChange: (isComplete: boolean) => void; // NEW: Prop to receive callback
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ userId, isProfileComplete, onProfileCompleteChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(isProfileComplete ? "missions" : "profile"); // Set default tab based on profile completion

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
      <h1 className="text-4xl font-bold mb-6">Espace Client</h1>
      <p className="text-lg mb-8 text-center">
        Bienvenue dans votre espace dédié. Gérez vos missions et mettez à jour votre profil.
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create-mission" disabled={!isProfileComplete}>Créer une mission</TabsTrigger>
          <TabsTrigger value="missions" disabled={!isProfileComplete}>Mes Missions</TabsTrigger>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
        </TabsList>
        <TabsContent value="create-mission" className="mt-6">
          <div className="flex justify-center">
            <Link to="/create-mission">
              <Button className="px-8 py-4 text-lg" disabled={!isProfileComplete}>Créer une nouvelle mission</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="missions" className="mt-6">
          <ClientMissionsList userId={userId} />
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <ClientProfile userId={userId} onProfileCompleteChange={onProfileCompleteChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;