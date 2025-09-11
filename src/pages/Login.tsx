import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm"; // Import the new custom signup form
import { Button } from "@/components/ui/button"; // Import Button for tab switching

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') as 'client' | 'convoyeur' | null;
  const [viewMode, setViewMode] = useState<'signin' | 'signup'>(preselectedRole ? 'signup' : 'signin');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUpSuccess = () => {
    // Optionally redirect to sign-in or show a message
    setViewMode('signin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            {viewMode === 'signin' ? "Connectez-vous" : "Créez un compte"}
          </h2>

          <div className="flex justify-center mb-6 space-x-4">
            <Button
              variant={viewMode === 'signin' ? 'default' : 'outline'}
              onClick={() => setViewMode('signin')}
            >
              Se connecter
            </Button>
            <Button
              variant={viewMode === 'signup' ? 'default' : 'outline'}
              onClick={() => setViewMode('signup')}
            >
              S'inscrire
            </Button>
          </div>

          {viewMode === 'signup' ? (
            <SignUpForm initialRole={preselectedRole} onSignUpSuccess={handleSignUpSuccess} />
          ) : (
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'hsl(var(--primary))',
                      brandAccent: 'hsl(var(--primary-foreground))',
                    },
                  },
                },
              }}
              theme="light"
              view="sign_in" // Force sign_in view for the Auth component
              localization={{
                variables: {
                  sign_in: {
                    email_label: "Adresse e-mail",
                    password_label: "Mot de passe",
                    email_input_placeholder: "Votre adresse e-mail",
                    password_input_placeholder: "Votre mot de passe",
                    button_label: "Se connecter",
                    social_provider_text: "Se connecter avec {{provider}}",
                    link_text: "", // Removed the "Don't have an account? Sign up" link
                  },
                  // Removed sign_up localization as it's handled by custom form
                  forgotten_password: {
                    email_label: "Adresse e-mail",
                    password_label: "Votre mot de passe",
                    email_input_placeholder: "Votre adresse e-mail",
                    button_label: "Envoyer les instructions de réinitialisation",
                    link_text: "Mot de passe oublié ?",
                  },
                  update_password: {
                    password_label: "Nouveau mot de passe",
                    password_input_placeholder: "Votre nouveau mot de passe",
                    button_label: "Mettre à jour le mot de passe",
                  },
                },
              }}
              // Removed extra_fields as role selection is now custom
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;