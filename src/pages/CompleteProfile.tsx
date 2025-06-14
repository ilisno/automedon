import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompleteProfile = () => {
  const { user, getProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    languages: '', // Storing as comma-separated string for simplicity in form
    company_type: '',
    siret: '',
    address: '',
    postal_code: '',
    city: '',
    driver_license_number: '',
    license_issue_date: '',
    license_issue_city: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const profile = await getProfile(user.id);
        if (profile && profile.is_profile_complete) {
          // If profile is already complete, redirect
          navigate('/');
        } else if (profile) {
          // If profile exists but is incomplete, pre-fill form if data exists
          setFormData({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            phone: profile.phone || '',
            date_of_birth: profile.date_of_birth || '',
            languages: Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages || '',
            company_type: profile.company_type || '',
            siret: profile.siret || '',
            address: profile.address || '',
            postal_code: profile.postal_code || '',
            city: profile.city || '',
            driver_license_number: profile.driver_license_number || '',
            license_issue_date: profile.license_issue_date || '',
            license_issue_city: profile.license_issue_city || '',
          });
        }
      } else {
        // If no user, redirect to login
        navigate('/login');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, navigate, getProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Erreur',
        description: 'Vous devez être connecté pour compléter votre profil.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Convert comma-separated languages string to array
    const languagesArray = formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang !== '');

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        date_of_birth: formData.company_type === 'convoyeur' ? formData.date_of_birth || null : null,
        languages: formData.company_type === 'convoyeur' ? languagesArray : null,
        company_type: formData.company_type,
        role: formData.company_type, // IMPORTANT: Update role based on company_type
        siret: formData.company_type === 'concessionnaire' ? formData.siret : null,
        address: formData.address,
        postal_code: formData.postal_code,
        city: formData.city,
        driver_license_number: formData.company_type === 'convoyeur' ? formData.driver_license_number : null,
        license_issue_date: formData.company_type === 'convoyeur' ? formData.license_issue_date || null : null,
        license_issue_city: formData.company_type === 'convoyeur' ? formData.license_issue_city : null,
        is_profile_complete: true, // Mark profile as complete
      })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erreur lors de la mise à jour du profil',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      toast({
        title: 'Profil mis à jour avec succès !',
        description: 'Votre profil est maintenant complet.',
      });
      await getProfile(user.id); // IMPORTANT: Refresh profile in AuthContext
      navigate('/'); // Redirect to home page
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Compléter votre profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="first_name">Prénom</Label>
            <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="last_name">Nom</Label>
            <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>

          {/* Company Type Selection - Always visible */}
          <div>
            <Label htmlFor="company_type">Vous êtes un(e)</Label>
             <Select onValueChange={(value) => handleSelectChange('company_type', value)} value={formData.company_type} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concessionnaire">Concessionnaire</SelectItem>
                <SelectItem value="convoyeur">Convoyeur</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Concessionnaire Specific Fields */}
          {formData.company_type === 'concessionnaire' && (
            <>
              <div>
                <Label htmlFor="siret">SIRET</Label>
                <Input id="siret" name="siret" value={formData.siret} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="address">Adresse de l'entreprise</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="postal_code">Code postal de l'entreprise</Label>
                <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="city">Ville de l'entreprise</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </>
          )}

          {/* Convoyeur Specific Fields */}
          {formData.company_type === 'convoyeur' && (
            <>
              <div>
                <Label htmlFor="date_of_birth">Date de naissance</Label>
                <Input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="languages">Langues (séparées par des virgules)</Label>
                <Input id="languages" name="languages" value={formData.languages} onChange={handleChange} placeholder="Ex: Français, Anglais" />
              </div>
              <div>
                <Label htmlFor="driver_license_number">Numéro de permis</Label>
                <Input id="driver_license_number" name="driver_license_number" value={formData.driver_license_number} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="license_issue_date">Date d'obtention du permis</Label>
                <Input type="date" id="license_issue_date" name="license_issue_date" value={formData.license_issue_date} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="license_issue_city">Ville de délivrance du permis</Label>
                <Input id="license_issue_city" name="license_issue_city" value={formData.license_issue_city} onChange={handleChange} required />
              </div>
            </>
          )}

          {/* Common fields (address, postal_code, city) for 'autre' or if not specified */}
          {formData.company_type === 'autre' && (
            <>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="postal_code">Code postal</Label>
                <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
              </div>
            </>
          )}

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer le profil'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;