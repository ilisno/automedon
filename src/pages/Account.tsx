import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'concessionnaire' | 'convoyeur' | null;
  phone: string | null;
  date_of_birth: string | null; // ISO string
  languages: string[] | null;
  company_type: string | null;
  siret: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  driver_license_number: string | null;
  license_issue_date: string | null; // ISO string
  license_issue_city: string | null;
  is_profile_complete: boolean;
};

const Account = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'concessionnaire' | 'convoyeur' | ''>("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [languages, setLanguages] = useState(""); // Comma separated string
  const [companyType, setCompanyType] = useState("");
  const [siret, setSiret] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [licenseIssueDate, setLicenseIssueDate] = useState<Date | undefined>(undefined);
  const [licenseIssueCity, setLicenseIssueCity] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          showError("Erreur lors du chargement du profil.");
        } else if (data) {
          setProfile(data);
          setFirstName(data.first_name || "");
          setLastName(data.last_name || "");
          setRole(data.role || "");
          setPhone(data.phone || "");
          setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : undefined);
          setLanguages(data.languages ? data.languages.join(", ") : "");
          setCompanyType(data.company_type || "");
          setSiret(data.siret || "");
          setAddress(data.address || "");
          setPostalCode(data.postal_code || "");
          setCity(data.city || "");
          setDriverLicenseNumber(data.driver_license_number || "");
          setLicenseIssueDate(data.license_issue_date ? new Date(data.license_issue_date) : undefined);
          setLicenseIssueCity(data.license_issue_city || "");
          setIsProfileComplete(data.is_profile_complete);
        }
      } else {
        navigate("/login"); // Redirect if not logged in
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showError("Vous devez être connecté pour mettre à jour votre profil.");
      setLoading(false);
      return;
    }

    const updatedProfile: Omit<Profile, 'id'> = {
      first_name: firstName,
      last_name: lastName,
      role: role || null,
      phone: phone || null,
      date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
      languages: languages ? languages.split(",").map(lang => lang.trim()) : null,
      company_type: companyType || null,
      siret: siret || null,
      address: address || null,
      postal_code: postalCode || null,
      city: city || null,
      driver_license_number: driverLicenseNumber || null,
      license_issue_date: licenseIssueDate ? format(licenseIssueDate, "yyyy-MM-dd") : null,
      license_issue_city: licenseIssueCity || null,
      is_profile_complete: isProfileComplete,
    };

    const { error } = await supabase
      .from('profiles')
      .upsert({ ...updatedProfile, id: user.id });

    if (error) {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil.");
    } else {
      showSuccess("Profil mis à jour avec succès !");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Mon Compte</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={(value: 'concessionnaire' | 'convoyeur') => setRole(value)}>
                <SelectTrigger className="w-full mt-1">
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
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1"
              />
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
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="languages">Langues parlées (séparées par des virgules)</Label>
              <Input
                id="languages"
                type="text"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                placeholder="Ex: Français, Anglais"
                className="mt-1"
              />
            </div>

            {role === 'concessionnaire' && (
              <>
                <div>
                  <Label htmlFor="companyType">Type d'entreprise</Label>
                  <Input
                    id="companyType"
                    type="text"
                    value={companyType}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="siret">Numéro SIRET</Label>
                  <Input
                    id="siret"
                    type="text"
                    value={siret}
                    onChange={(e) => setSiret(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Code Postal</Label>
                <Input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {role === 'convoyeur' && (
              <>
                <div>
                  <Label htmlFor="driverLicenseNumber">Numéro de permis de conduire</Label>
                  <Input
                    id="driverLicenseNumber"
                    type="text"
                    value={driverLicenseNumber}
                    onChange={(e) => setDriverLicenseNumber(e.target.value)}
                    className="mt-1"
                  />
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
                      <Calendar
                        mode="single"
                        selected={licenseIssueDate}
                        onSelect={setLicenseIssueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="licenseIssueCity">Ville de délivrance du permis</Label>
                  <Input
                    id="licenseIssueCity"
                    type="text"
                    value={licenseIssueCity}
                    onChange={(e) => setLicenseIssueCity(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isProfileComplete"
                checked={isProfileComplete}
                onCheckedChange={(checked) => setIsProfileComplete(checked === true)}
              />
              <Label htmlFor="isProfileComplete">Avez-vous complété votre profil ?</Label>
            </div>

            <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Account;