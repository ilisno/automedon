import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { showError, showSuccess } from "@/utils/toast";
import AdminMissions from "@/components/admin/AdminMissions";
import AdminConvoyeurs from "@/components/admin/AdminConvoyeurs";
import AdminClients from "@/components/admin/AdminClients";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        showError("Accès non autorisé. Veuillez vous connecter en tant qu'administrateur.");
        navigate("/admin");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut(); // Sign out if not an admin
        showError("Accès non autorisé. Votre rôle n'est pas administrateur.");
        navigate("/admin");
      }
    };
    checkAdminAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Use Supabase signOut
    showSuccess("Déconnexion administrateur réussie.");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Tableau de Bord Administrateur</h1>
        <p className="text-lg mb-8 max-w-prose">
          Bienvenue dans l'espace d'administration. Gérez les missions, les convoyeurs et les clients.
        </p>

        <Tabs defaultValue="missions" className="w-full max-w-6xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="convoyeurs">Convoyeurs</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="missions" className="mt-6">
            <AdminMissions />
          </TabsContent>
          <TabsContent value="convoyeurs" className="mt-6">
            <AdminConvoyeurs />
          </TabsContent>
          <TabsContent value="clients" className="mt-6">
            <AdminClients />
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button onClick={handleLogout} className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white">
            Déconnexion Admin
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;