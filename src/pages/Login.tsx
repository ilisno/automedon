// ... (autres imports restent inchangés)

const Login = () => {
  // ... (le reste du code précédent reste inchangé)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
            {viewMode === 'signin' ? "Connectez-vous à votre compte" : "Créez un nouveau compte"}
          </h2>

          {/* Boutons de navigation restent inchangés */}

          {viewMode === 'signup' ? (
            <SignUpForm initialRole={preselectedRole} onSignUpSuccess={handleSignUpSuccess} />
          ) : (
            <Auth
              supabaseClient={supabase}
              providers={[]}
              appearance={{/* ... reste inchangé ... */}}
              theme="light"
              view="sign_in"
              localization={{
                variables: {
                  sign_in: {
                    // Modification ici pour supprimer le lien
                    email_label: "Adresse e-mail",
                    password_label: "Mot de passe",
                    email_input_placeholder: "Votre adresse e-mail",
                    password_input_placeholder: "Votre mot de passe",
                    button_label: "Se connecter",
                    social_provider_text: "Se connecter avec {{provider}}",
                    link_text: "", // <-- Texte vide pour supprimer le lien
                  },
                  // ... autres localizations restent inchangées ...
                },
              }}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};