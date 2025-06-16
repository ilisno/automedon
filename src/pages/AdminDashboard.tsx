import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { showError } from "@/utils/toast";

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
          Bienvenue dans l'espace d'administration. Ici, vous pourrez gérer les utilisateurs, les missions et d'autres paramètres de la plateforme.
        </p>
        {/* Add admin-specific content here later */}
        <Button onClick={handleLogout} className="px-8 py-4 text-lg bg-red-600 hover:bg-red-700 text-white">
          Déconnexion Admin
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;