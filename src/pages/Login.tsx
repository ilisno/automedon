import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignUpForm from "@/components/auth/SignUpForm";
import SignInForm from "@/components/auth/SignInForm"; // NEW: Import custom sign-in form
import ForgotPasswordDialog from "@/components/auth/ForgotPasswordDialog"; // NEW: Import forgot password dialog
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') as 'client' | 'convoyeur' | null;
  const [viewMode, setViewMode] = useState<'signin' | 'signup'>(preselectedRole ? 'signup' : 'signin');
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] = useState(false); // NEW: State for forgot password dialog

  useEffect(() => {
    // Check for session on initial load and redirect if authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUpSuccess = () => {
    setViewMode('signin');
  };

  const handleSignInSuccess = () => {
    navigate("/"); // Redirect to home or account page after successful sign-in
  };

  const handleOpenForgotPasswordDialog = () => {
    setIsForgotPasswordDialogOpen(true);
  };

  const handleCloseForgotPasswordDialog = () => {
    setIsForgotPasswordDialogOpen(false);
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
            <SignUpForm
              initialRole={preselectedRole}
              onSignUpSuccess={handleSignUpSuccess}
              onForgotPasswordClick={handleOpenForgotPasswordDialog} // Pass handler
            />
          ) : (
            <SignInForm
              onSignInSuccess={handleSignInSuccess}
              onForgotPasswordClick={handleOpenForgotPasswordDialog} // Pass handler
            />
          )}
        </div>
      </main>
      <Footer />
      <ForgotPasswordDialog
        isOpen={isForgotPasswordDialogOpen}
        onClose={handleCloseForgotPasswordDialog}
      />
    </div>
  );
};

export default Login;