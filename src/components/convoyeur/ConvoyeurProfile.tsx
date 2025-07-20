import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useMissions } from "@/context/MissionsContext";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'client' | 'convoyeur' | 'admin' | null; // Corrected type
  phone: string | null;
  date_of_birth: string | null; // ISO string
  languages: string[] | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  driver_license_number: string | null;
  license_issue_date: string | null; // ISO string
  license_issue_city: string | null;
  is_profile_complete: boolean;
  avatar_url: string | null;
};

interface ConvoyeurProfileProps {
  userId: string;
}

const ConvoyeurProfile: React.FC<ConvoyeurProfileProps> = ({ userId }) => {
  const { updateProfile, uploadProfilePhoto } = useMissions();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(""); // NEW: State for user email
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'client' | 'convoyeur' | ''>(""); // Corrected type
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [languages, setLanguages] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState<Date | undefined>(undefined);
  const [licenseIssueCity, setLicenseIssueCity] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        showError("Erreur lors du chargement de l'utilisateur.");
        setLoading(false);
        return;
      }
      setEmail(user.email || ""); // NEW: Set user email

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
        setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : undefined);
        setLanguages(data.languages ? data.languages.join(", ") : "");
        setAddress(data.address || "");
        setPostalCode(data.postal_code || "");
        setCity(data.city || "");
        setDriverLicenseNumber(data.driver_license_number || "");
        setLicenseIssueDate(data.license_issue_date ? new Date(data.license_issue_date) : undefined);
        setLicenseIssueCity(data.license_issue_city || "");
        setAvatarUrl(data.avatar_url || null);
        setIsProfileComplete(data.is_profile_complete);
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [userId]);

  const checkConvoyeurProfileCompletion = (currentAvatarUrl: string | null) => {
    return (
      firstName !== "" &&
      lastName !== "" &&
      phone !== "" &&
      dateOfBirth !== undefined &&
      languages !== "" &&
      address !== "" &&
      postalCode !== "" &&
      city !== "" &&
      driverLicenseNumber !== "" &&
      licenseIssueDate !== undefined &&
      licenseIssueCity !== "" &&
      currentAvatarUrl !== null
    );
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let newAvatarUrl = avatarUrl;
    if (avatarFile) {
      try {
        newAvatarUrl = await uploadProfilePhoto(userId, avatarFile);
        setAvatarUrl(newAvatarUrl);
        showSuccess("Photo de profil téléchargée avec succès !");
      } catch (error) {
        console.error("Error uploading avatar:", error);
        showError("Erreur lors du téléchargement de la photo de profil.");
        setLoading(false);
        return;
      }
    }

    const updatedProfile: Partial<Omit<Profile, 'id'>> = { // Changed type to Partial<Omit<Profile, 'id'>>
      first_name: firstName,
      last_name: lastName,
      role: (role === 'client' || role === 'convoyeur' || role === 'admin') ? role : null, // Explicitly cast role
      phone: phone || null,
      date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
      languages: languages ? languages.split(",").map(lang => lang.trim()) : null,
      address: address || null,
      postal_code: postalCode || null,
      city: city || null,
      driver_license_number: driverLicenseNumber || null,
      license_issue_date: licenseIssueDate ? format(licenseIssueDate, "yyyy-MM-dd") : null,
      license_issue_city: licenseIssueCity || null,
      avatar_url: newAvatarUrl,
      is_profile_complete: checkConvoyeurProfileCompletion(newAvatarUrl),
    };

    try {
      await updateProfile(userId, updatedProfile);
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
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Mon Profil</h2>
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4 mb-6">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 border-4 border-primary shadow-md">
              <UserCircle2 size={64} />
            </div>
          )}
          <div>
            <Label htmlFor="avatar">Photo de profil</Label>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Une photo de profil est requise pour compléter votre profil de convoyeur.
            </p>
          </div>
        </div>

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
          <Select value={role} onValueChange={(value: 'client' | 'convoyeur') => setRole(value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Sélectionnez votre rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="convoyeur">Convoyeur</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date de naissance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !dateOfBirth && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfBirth ? format(dateOfBirth, "PPP") : <span>Sélectionnez une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={dateOfBirth} onSelect={setDateOfBirth} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="languages">Langues parlées (séparées par des virgules)</Label>
          <Input id="languages" type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Ex: Français, Anglais" className="mt-1" />
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
        <div>
          <Label htmlFor="driverLicenseNumber">Numéro de permis de conduire</Label>
          <Input id="driverLicenseNumber" type="text" value={driverLicenseNumber} onChange={(e) => setDriverLicenseNumber(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="licenseIssueDate">Date de délivrance du permis</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !licenseIssueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {licenseIssueDate ? format(licenseIssueDate, "PPP") : <span>Sélectionnez une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={licenseIssueDate} onSelect={setLicenseIssueDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="licenseIssueCity">Ville de délivrance du permis</Label>
          <Input id="licenseIssueCity" type="text" value={licenseIssueCity} onChange={(e) => setLicenseIssueCity(e.target.value)} className="mt-1" />
        </div>
        <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
          {loading ? "Sauvegarde..." : "Sauvegarder le profil"}
        </Button>
      </form>
    </div>
  );
};

export default ConvoyeurProfile;