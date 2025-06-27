import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "@/utils/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); // Change username to email for Supabase auth
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        showError(`Erreur de connexion: ${error.message}`);
      } else if (data.user) {
        // Check if the authenticated user has the 'admin' role in the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin') {
          await supabase.auth.signOut(); // Sign out if not an admin
          showError("Accès refusé. Seuls les administrateurs peuvent se connecter ici.");
        } else {
          showSuccess("Connexion administrateur réussie !");
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      showError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Connexion Administrateur</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                type="email" // Change type to email
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;