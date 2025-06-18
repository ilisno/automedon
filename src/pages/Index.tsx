import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingSession(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const handleNavigateToAccount = () => {
    navigate("/account");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
          Bienvenue sur Automédon
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-12 max-w-2xl">
          Votre plateforme pour la gestion et le convoyage de véhicules.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          {loadingSession ? (
            <Button className="px-8 py-4 text-lg" disabled>Chargement...</Button>
          ) : (
            session ? (
              <Button
                onClick={handleNavigateToAccount}
                className="px-8 py-4 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 shadow-lg"
              >
                Accéder à mon espace
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleNavigateToLogin}
                  className="px-8 py-4 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 shadow-lg"
                >
                  Je dois déplacer un véhicule
                </Button>
                <Button
                  onClick={handleNavigateToLogin}
                  variant="outline"
                  className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary/10 dark:border-primary-foreground dark:text-primary-foreground dark:hover:bg-primary-foreground/10 transition-colors duration-300 shadow-lg"
                >
                  Je suis convoyeur
                </Button>
              </>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;