import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, UserCircle2, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useMissions } from "@/context/MissionsContext";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'client' | 'convoyeur' | 'admin' | null;
  phone: string | null;
  date_of_birth: string | null;
  languages: string[] | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  driver_license_number: string | null;
  license_issue_date: string | null;
  license_issue_city: string | null;
  is_profile_complete: boolean;
  avatar_url: string | null;
};

interface ConvoyeurProfileProps {
  userId: string;
  onProfileCompleteChange: (isComplete: boolean) => void; // NEW: Callback to update parent
}

const LANGUAGES_OPTIONS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "es", label: "Espagnol" },
  { value: "de", label: "Allemand" },
  { value: "it", label: "Italien" },
  { value: "pt", label: "Portugais" },
  { value: "nl", label: "Néerlandais" },
  { value: "ar", label: "Arabe" },
  { value: "zh", label: "Chinois (Mandarin)" },
  { value: "ru", label: "Russe" },
  { value: "ja", label: "Japonais" },
  { value: "ko", label: "Coréen" },
  { value: "sv", label: "Suédois" },
    { value: "da", label: "Danois" },
  { value: "no", label: "Norvégien" },
  { value: "fi", label: "Finnois" },
  { value: "pl", label: "Polonais" },
  { value: "tr", label: "Turc" },
  { value: "el", label: "Grec" },
  { value: "he", label: "Hébreu" },
  { value: "hi", label: "Hindi" },
  { value: "th", label: "Thaï" },
  { value: "vi", label: "Vietnamien" },
  { value: "id", label: "Indonésien" },
  { value: "ms", label: "Malais" },
  { value: "cs", label: "Tchèque" },
  { value: "hu", label: "Hongrois" },
  { value: "ro", label: "Roumain" },
  { value: "bg", label: "Bulgare" },
  { value: "uk", label: "Ukrainien" },
];

const ConvoyeurProfile: React.FC<ConvoyeurProfileProps> = ({ userId, onProfileCompleteChange }) => {
  const { updateProfile, uploadProfilePhoto } = useMissions();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'client' | 'convoyeur' | 'admin' | ''>("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]); // Changed to array
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState<Date | undefined>(undefined);
  const [licenseIssueCity, setLicenseIssueCity] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Local state for completion
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [openLanguageSelect, setOpenLanguageSelect] = useState(false); // State for popover

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
        setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : undefined);
        setSelectedLanguages(data.languages || []); // Set array directly
        setAddress(data.address || "");
        setPostalCode(data.postal_code || "");
        setCity(data.city || "");
        setDriverLicenseNumber(data.driver_license_number || "");
        setLicenseIssueDate(data.license_issue_date ? new Date(data.license_issue_date) : undefined);
        setLicenseIssueCity(data.license_issue_city || "");
        setAvatarUrl(data.avatar_url || null);
        setIsProfileComplete(data.is_profile_complete);
        onProfileCompleteChange(data.is_profile_complete); // Inform parent on initial load
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [userId, onProfileCompleteChange]);

  const checkConvoyeurProfileCompletion = (
    fName: string, lName: string, p: string, dob: Date | undefined, langs: string[], // Now an array
    addr: string, pCode: string, c: string, dln: string, lid: Date | undefined, lic: string,
    currentAvatarUrl: string | null
  ) => {
    return (
      fName.trim() !== "" &&
      lName.trim() !== "" &&
      p.trim() !== "" &&
      dob !== undefined &&
      langs.length > 0 && // Check if at least one language is selected
      addr.trim() !== "" &&
      pCode.trim() !== "" &&
      c.trim() !== "" &&
      dln.trim() !== "" &&
      lid !== undefined &&
      lic.trim() !== "" &&
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

    const isConvoyeurProfileNowComplete = checkConvoyeurProfileCompletion(
      firstName, lastName, phone, dateOfBirth, selectedLanguages, // Pass selectedLanguages array
      address, postalCode, city, driverLicenseNumber, licenseIssueDate, licenseIssueCity,
      newAvatarUrl
    );

    const updatedProfile: Partial<Omit<Profile, 'id' | 'role'>> = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim() || null,
      date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
      languages: selectedLanguages.length > 0 ? selectedLanguages : null, // Send array or null
      address: address.trim() || null,
      postal_code: postalCode.trim() || null,
      city: city.trim() || null,
      driver_license_number: driverLicenseNumber.trim() || null,
      license_issue_date: licenseIssueDate ? format(licenseIssueDate, "yyyy-MM-dd") : null,
      license_issue_city: licenseIssueCity.trim() || null,
      avatar_url: newAvatarUrl,
      is_profile_complete: isConvoyeurProfileNowComplete,
    };

    try {
      await updateProfile(userId, updatedProfile);
      setIsProfileComplete(isConvoyeurProfileNowComplete); // Update local state
      onProfileCompleteChange(isConvoyeurProfileNowComplete); // Inform parent
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
          <Input id="role" type="text" value={role.charAt(0).toUpperCase() + role.slice(1)} disabled className="mt-1 bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
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
        <div className="relative">
          <Label htmlFor="languages">Langues parlées</Label>
          <Popover open={openLanguageSelect} onOpenChange={setOpenLanguageSelect}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openLanguageSelect}
                className="w-full justify-between mt-1 h-auto min-h-[40px] flex-wrap"
              >
                {selectedLanguages.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedLanguages.map((langValue) => {
                      const language = LANGUAGES_OPTIONS.find((l) => l.value === langValue);
                      return language ? (
                        <Badge key={langValue} variant="secondary" className="flex items-center">
                          {language.label}
                          <X
                            className="ml-1 h-3 w-3 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLanguages((prev) => prev.filter((item) => item !== langValue));
                            }}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <span className="text-muted-foreground">Sélectionnez les langues...</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Rechercher une langue..." />
                <CommandEmpty>Aucune langue trouvée.</CommandEmpty>
                <CommandGroup>
                  {LANGUAGES_OPTIONS.map((language) => (
                    <CommandItem
                      key={language.value}
                      value={language.label}
                      onSelect={() => {
                        setSelectedLanguages((prev) =>
                          prev.includes(language.value)
                            ? prev.filter((item) => item !== language.value)
                            : [...prev, language.value]
                        );
                      }}
                      className="flex items-center justify-between"
                    >
                      {language.label}
                      <Checkbox
                        checked={selectedLanguages.includes(language.value)}
                        onCheckedChange={(checked) => {
                          setSelectedLanguages((prev) =>
                            checked
                              ? [...prev, language.value]
                              : prev.filter((item) => item !== language.value)
                          );
                        }}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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