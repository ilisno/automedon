import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // Import Input
import { Label } from '@/components/ui/label'; // Import Label
import { Button } from '@/components/ui/button'; // Import Button


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if user is already logged in and profile is complete
  useEffect(() => {
    if (!loading && user && profile?.is_profile_complete) {
      navigate('/');
    } else if (!loading && user && !profile?.is_profile_complete) {
       navigate('/complete-profile');
    }
  }, [user, profile, loading, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login button clicked, attempting to log in...');
    try {
      const { user: loggedInUser, profile: userProfile } = await login(email, password);
      console.log('Login successful!');
      // Redirection is now handled by the useEffect hook based on user/profile state
      if (loggedInUser && userProfile?.is_profile_complete) {
         toast({
            title: 'Connexion réussie !',
            description: 'Bienvenue !',
          });
         // navigate('/'); // useEffect handles this
      } else if (loggedInUser && !userProfile?.is_profile_complete) {
         toast({
            title: 'Connexion réussie !',
            description: 'Veuillez compléter votre profil.',
          });
         // navigate('/complete-profile'); // useEffect handles this
      }

    } catch (error: any) { // Catch error as any to access message
      console.error('Error logging in:', error);
       toast({
        title: 'Échec de la connexion',
        description: error.message || 'Veuillez vérifier vos identifiants.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-500 hover:underline">
            S'inscrire ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;