import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyType, setCompanyType] = useState(''); // New state for company type
  const { register, user, profile, loading } = useAuth();
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
    try {
      const { user: registeredUser, profile: userProfile } = await register(email, password, companyType); // Pass companyType
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
          <div className="mb-4">
            <Label htmlFor="companyType">Vous êtes un(e)</Label>
            <Select onValueChange={setCompanyType} value={companyType} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner votre rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concessionnaire">Concessionnaire</SelectItem>
                <SelectItem value="convoyeur">Convoyeur</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
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