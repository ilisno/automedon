import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') as 'client' | 'convoyeur' | null;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            Connectez-vous ou créez un compte
          </h2>
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
            // Always set the initial view to 'sign_up' to ensure extra_fields are visible
            view="sign_up"
            localization={{
              variables: {
                sign_in: {
                  email_label: "Adresse e-mail",
                  password_label: "Mot de passe",
                  email_input_placeholder: "Votre adresse e-mail",
                  password_input_placeholder: "Votre mot de passe",
                  button_label: "Se connecter",
                  social_provider_text: "Se connecter avec {{provider}}",
                  link_text: "Vous avez déjà un compte ? Connectez-vous",
                },
                sign_up: {
                  email_label: "Adresse e-mail",
                  password_label: "Créer un mot de passe",
                  email_input_placeholder: "Votre adresse e-mail",
                  password_input_placeholder: "Votre mot de passe",
                  button_label: "S'inscrire",
                  social_provider_text: "S'inscrire avec {{provider}}",
                  link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                },
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
            extra_fields={[
              {
                name: 'role',
                label: 'Je suis...',
                input_type: 'select',
                options: [
                  { value: 'client', label: 'Client' },
                  { value: 'convoyeur', label: 'Convoyeur' },
                ],
                required: true,
                // Removed defaultValue to force user selection
              },
            ]}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;