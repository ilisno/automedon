import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm"; // Import the new custom sign-in form
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog"; // Import the new forgot password dialog
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') as 'client' | 'convoyeur' | null;
  const [viewMode, setViewMode] = useState<'signin' | 'signup'>(preselectedRole ? 'signup' : 'signin');
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignInSuccess = () => {
    navigate("/account-redirect"); // Redirect to account after successful sign-in
  };

  const handleSignUpSuccess = () => {
    setViewMode('signin'); // After successful signup, switch to sign-in view
  };

  const handleForgotPasswordClick = () => {
    setIsForgotPasswordDialogOpen(true);
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
            <SignInForm onSignInSuccess={handleSignInSuccess} onForgotPasswordClick={handleForgotPasswordClick} />
          )}
        </div>
      </main>
      <Footer />
      <ForgotPasswordDialog
        isOpen={isForgotPasswordDialogOpen}
        onClose={() => setIsForgotPasswordDialogOpen(false)}
      />
    </div>
  );
};

export default Login;