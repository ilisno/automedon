import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSession } from '@supabase/auth-ui-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const session = useSession(); // Get the session from Supabase Auth UI context

  useEffect(() => {
    if (session) {
      // If a session exists, redirect to the home page or a dashboard
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion / Inscription</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]} // No third-party providers for now
          redirectTo={window.location.origin + '/complete-profile'} // Redirect after successful signup/login
        />
      </div>
    </div>
  );
};

export default AuthPage;