import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { showError, showSuccess } from "@/utils/toast";
import AdminMissions from "@/components/admin/AdminMissions";
import AdminConvoyeurs from "@/components/admin/AdminConvoyeurs";
import AdminClients from "@/components/admin/AdminClients"; // Updated import

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");
    if (isAdminAuthenticated !== "true") {
      showError("Accès non autorisé. Veuillez vous connecter en tant qu'administrateur.");
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
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