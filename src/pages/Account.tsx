import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Account = () => {
  const { user, profile, updateProfile, loading, fetchProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    languages: [] as string[],
    company_type: '',
    siret: '',
    address: '',
    postal_code: '',
    city: '',
    driver_license_number: '',
    license_issue_date: '',
    license_issue_city: '',
    role: '' as 'concessionnaire' | 'convoyeur' | '',
  });

  useEffect(() => {
    if (!loading && user && profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
        languages: profile.languages || [],
        company_type: profile.company_type || '',
        siret: profile.siret || '',
        address: profile.address || '',
        postal_code: profile.postal_code || '',
        city: profile.city || '',
        driver_license_number: profile.driver_license_number || '',
        license_issue_date: profile.license_issue_date || '',
        license_issue_city: profile.license_issue_city || '',
        role: profile.role || '',
      });
    }
  }, [loading, user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      languages: value.split(',').map(lang => lang.trim()).filter(lang => lang !== '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Utilisateur non authentifié.',
        variant: 'destructive',
      });
      return;
    }

    const updates = {
      ...formData,
      is_profile_complete: true, // Ensure profile is marked as complete after update
    };

    const updatedProfile = await updateProfile(user.id, updates);

    if (updatedProfile) {
      toast({
        title: 'Profil mis à jour ✅',
        description: 'Votre profil a été mis à jour avec succès.',
      });
      // Re-fetch profile to ensure the local state is fully synchronized
      await fetchProfile(user.id);
    } else {
      toast({
        title: 'Erreur',
        description: 'Échec de la mise à jour du profil.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement du profil...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Veuillez vous connecter pour accéder à votre compte.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Mon Compte</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">Prénom</Label>
              <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="last_name">Nom</Label>
              <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="role">Vous êtes :</Label>
            <Select name="role" value={formData.role} onValueChange={(value) => handleSelectChange('role', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concessionnaire">Concessionnaire</SelectItem>
                <SelectItem value="convoyeur">Convoyeur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="date_of_birth">Date de naissance</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" value={formData.date_of_birth} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="languages">Langues (séparées par des virgules)</Label>
            <Input id="languages" name="languages" value={formData.languages.join(', ')} onChange={handleLanguageChange} />
          </div>

          {formData.role === 'concessionnaire' && (
            <>
              <div>
                <Label htmlFor="company_type">Type d'entreprise</Label>
                <Input id="company_type" name="company_type" value={formData.company_type} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="siret">Numéro SIRET</Label>
                <Input id="siret" name="siret" value={formData.siret} onChange={handleChange} />
              </div>
            </>
          )}

          {formData.role === 'convoyeur' && (
            <>
              <div>
                <Label htmlFor="driver_license_number">Numéro de permis de conduire</Label>
                <Input id="driver_license_number" name="driver_license_number" value={formData.driver_license_number} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="license_issue_date">Date de délivrance du permis</Label>
                <Input id="license_issue_date" name="license_issue_date" type="date" value={formData.license_issue_date} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="license_issue_city">Ville de délivrance du permis</Label>
                <Input id="license_issue_city" name="license_issue_city" value={formData.license_issue_city} onChange={handleChange} />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postal_code">Code Postal</Label>
              <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Mettre à jour le profil
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Account;