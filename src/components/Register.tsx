import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Input } from '@/components/ui/input'; // Import shadcn Input
import { Label } from '@/components/ui/label'; // Import shadcn Label
import { Button } from '@/components/ui/button'; // Import shadcn Button


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, user, profile, loading } = useAuth(); // Get user, profile, loading from context
  const navigate = useNavigate(); // Initialize useNavigate
  const { toast } = useToast(); // Initialize useToast

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
    try {
      const { user: registeredUser, profile: userProfile } = await register(email, password);
      console.log('Registration successful!');
       if (registeredUser) {
         toast({
            title: 'Inscription réussie !',
            description: 'Veuillez compléter votre profil.',
          });
         // Redirection is handled by the useEffect hook based on user/profile state
         // navigate('/complete-profile');
       }

    } catch (error: any) { // Catch error as any to access message
      console.error('Error registering:', error);
      toast({
        title: 'Échec de l\'inscription',
        description: error.message || 'Veuillez réessayer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">S'inscrire</h2>
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
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Se connecter ici
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;