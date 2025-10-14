import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Session } from "@supabase/supabase-js";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let isMounted = true;

    const handleSessionCheck = async () => {
      console.log("UpdatePassword: Checking session on mount...");
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("UpdatePassword: Error getting session on mount:", error);
      }
      if (isMounted) {
        setSession(currentSession);
        setLoading(false);
        if (!currentSession) {
          console.log("UpdatePassword: No session found on mount, redirecting to login.");
          showError("Accès non autorisé. Veuillez utiliser le lien de réinitialisation de mot de passe.");
          navigate("/login");
        } else {
          console.log("UpdatePassword: Session found on mount:", currentSession);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("UpdatePassword: Auth state changed event:", event, "session:", currentSession);
      if (isMounted) {
        setSession(currentSession);
        setLoading(false);
        if (!currentSession) {
          console.log("UpdatePassword: No session found on auth state change, redirecting to login.");
          showError("Accès non autorisé. Veuillez utiliser le lien de réinitialisation de mot de passe.");
          navigate("/login");
        } else {
          console.log("UpdatePassword: Session found on auth state change:", currentSession);
        }
      }
    });

    handleSessionCheck();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      showError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      showError("Le mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        showError(`Erreur lors de la mise à jour du mot de passe: ${error.message}`);
      } else {
        showSuccess("Votre mot de passe a été mis à jour avec succès !");
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error during password update:", err);
      showError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Vérification de l'accès...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Mettre à jour votre mot de passe</h1>
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UpdatePassword;