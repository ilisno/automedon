import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useMissions } from "@/context/MissionsContext";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'client' | 'convoyeur' | 'admin' | null;
  phone: string | null;
  company_type: string | null;
  siret: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  is_profile_complete: boolean;
  avatar_url: string | null;
};

interface ClientProfileProps {
  userId: string;
  onProfileCompleteChange: (isComplete: boolean) => void; // NEW: Callback to update parent
}

const ClientProfile: React.FC<ClientProfileProps> = ({ userId, onProfileCompleteChange }) => {
  const { updateProfile } = useMissions();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'client' | 'convoyeur' | 'admin' | ''>("");
  const [phone, setPhone] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [siret, setSiret] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Local state for completion

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        showError("Erreur lors du chargement de l'utilisateur.");
        setLoading(false);
        return;
      }
      setEmail(user.email || "");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        showError("Erreur lors du chargement du profil.");
      } else if (data) {
        setFirstName(data.first_name || "");
        setLastName(data.last_name || "");
        setRole(data.role || "");
        setPhone(data.phone || "");
        setCompanyType(data.company_type || "");
        setSiret(data.siret || "");
        setAddress(data.address || "");
        setPostalCode(data.postal_code || "");
        setCity(data.city || "");
        setIsProfileComplete(data.is_profile_complete);
        onProfileCompleteChange(data.is_profile_complete); // Inform parent on initial load
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [userId, onProfileCompleteChange]);

  const checkClientProfileCompletion = (
    fName: string, lName: string, p: string, cType: string, s: string, addr: string, pCode: string, c: string
  ) => {
    return (
      fName.trim() !== "" &&
      lName.trim() !== "" &&
      p.trim() !== "" &&
      cType.trim() !== "" &&
      s.trim() !== "" &&
      addr.trim() !== "" &&
      pCode.trim() !== "" &&
      c.trim() !== ""
    );
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isClientProfileNowComplete = checkClientProfileCompletion(
      firstName, lastName, phone, companyType, siret, address, postalCode, city
    );

    const updatedProfile: Partial<Omit<Profile, 'id' | 'avatar_url' | 'role'>> = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim() || null,
      company_type: companyType.trim() || null,
      siret: siret.trim() || null,
      address: address.trim() || null,
      postal_code: postalCode.trim() || null,
      city: city.trim() || null,
      is_profile_complete: isClientProfileNowComplete,
    };

    try {
      await updateProfile(userId, updatedProfile);
      setIsProfileComplete(isClientProfileNowComplete); // Update local state
      onProfileCompleteChange(isClientProfileNowComplete); // Inform parent
      showSuccess("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-700 dark:text-gray-300">Chargement du profil...</p>;
  }

  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Mon Profil</h2>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Adresse e-mail</Label>
          <Input id="email" type="email" value={email} disabled className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="role">Rôle</Label>
          <Input id="role" type="text" value={role.charAt(0).toUpperCase() + role.slice(1)} disabled className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="companyType">Type d'entreprise</Label>
          <Input id="companyType" type="text" value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="siret">Numéro SIRET</Label>
          <Input id="siret" type="text" value={siret} onChange={(e) => setSiret(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="address">Adresse</Label>
          <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Code Postal</Label>
            <Input id="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="city">Ville</Label>
            <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" />
          </div>
        </div>
        <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
          {loading ? "Sauvegarde..." : "Sauvegarder le profil"}
        </Button>
      </form>
    </div>
  );
};

export default ClientProfile;