import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useMissions, Mission } from "@/context/MissionsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'concessionnaire' | 'convoyeur' | null;
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
};

const Convoyeur = () => {
  const { getAvailableMissions, getConvoyeurMissions, takeMission, completeMission, getMonthlyTurnover, isLoadingMissions } = useMissions();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'concessionnaire' | 'convoyeur' | ''>("");
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

  const [missionComments, setMissionComments] = useState<{ [key: string]: string }>({});
  const [missionPhotos, setMissionPhotos] = useState<{ [key: string]: string[] }>({}); // Storing as string[] for URLs
  const [missionPrices, setMissionPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingProfile(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
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
          setIsProfileComplete(data.is_profile_complete);
        }
      } else {
        showError("Vous devez être connecté pour accéder à cette page.");
      }
      setLoadingProfile(false);
    };
    fetchUserProfile();
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);

    if (!userId) {
      showError("Utilisateur non identifié.");
      setLoadingProfile(false);
      return;
    }

    const updatedProfile: Omit<Profile, 'id'> = {
      first_name: firstName,
      last_name: lastName,
      role: role || null,
      phone: phone || null,
      date_of_birth: dateOfBirth ? format(dateOfBirth, "yyyy-MM-dd") : null,
      languages: languages ? languages.split(",").map(lang => lang.trim()) : null,
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
      .upsert({ ...updatedProfile, id: userId });

    if (error) {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil.");
    } else {
      showSuccess("Profil mis à jour avec succès !");
    }
    setLoadingProfile(false);
  };

  const handlePrendreEnCharge = async (id: string) => {
    if (userId) {
      await takeMission(id, userId);
    } else {
      showError("Veuillez vous connecter pour prendre en charge une mission.");
    }
  };

  const handleMarquerCommeLivree = async (id: string) => {
    const comments = missionComments[id] || "";
    const photos = missionPhotos[id] || []; // Currently empty, would be URLs
    const price = missionPrices[id] || 0;

    if (price <= 0) {
      showError("Veuillez entrer un prix valide pour la mission.");
      return;
    }

    await completeMission(id, comments, photos, price);
    // Clear local state for this mission
    setMissionComments(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
    setMissionPhotos(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
    setMissionPrices(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
  };

  const handleCommentChange = (id: string, value: string) => {
    setMissionComments(prev => ({ ...prev, [id]: value }));
  };

  const handlePriceChange = (id: string, value: string) => {
    setMissionPrices(prev => ({ ...prev, [id]: parseFloat(value) || 0 }));
  };

  // For now, photos are not uploaded, just showing placeholder
  const handlePhotoChange = (id: string, files: FileList | null) => {
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setMissionPhotos(prev => ({ ...prev, [id]: fileNames }));
      console.log(`Photos sélectionnées pour mission ${id}:`, fileNames);
      showSuccess("Photos sélectionnées (non uploadées pour l'instant).");
    }
  };

  const availableMissions = getAvailableMissions();
  const convoyeurMissions = userId ? getConvoyeurMissions(userId) : [];
  const monthlyTurnover = userId ? getMonthlyTurnover(userId) : 0;

  if (loadingProfile || isLoadingMissions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-6">Espace Convoyeur</h1>
        <p className="text-lg mb-8 text-center">
          Gérez vos missions, consultez votre chiffre d'affaires et mettez à jour votre profil.
        </p>

        {/* Section Profil */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Mon Profil</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-6">
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
            <div className="flex items-center space-x-2">
              <Checkbox id="isProfileComplete" checked={isProfileComplete} onCheckedChange={(checked) => setIsProfileComplete(checked === true)} />
              <Label htmlFor="isProfileComplete">Avez-vous complété votre profil ?</Label>
            </div>
            <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loadingProfile}>
              {loadingProfile ? "Sauvegarde..." : "Sauvegarder le profil"}
            </Button>
          </form>
        </div>

        {/* Section Chiffre d'affaires */}
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Chiffre d'affaires du mois</h2>
          <p className="text-4xl font-extrabold text-primary dark:text-primary-foreground">
            {monthlyTurnover.toFixed(2)} €
          </p>
        </div>

        {/* Section Missions Disponibles */}
        <div className="w-full max-w-4xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Missions Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableMissions && availableMissions.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Aucune mission disponible pour le moment.</p>
            ) : (
              availableMissions?.map((mission) => (
                <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      De: {mission.lieu_depart} à {mission.lieu_arrivee}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>Statut:</strong> <span className="font-medium text-blue-600 dark:text-blue-400">{mission.statut}</span></p>
                    <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                    <Button onClick={() => handlePrendreEnCharge(mission.id)} className="w-full">
                      Prendre en charge
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Section Mes Missions (en cours et livrées) */}
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions (En cours & Livrées)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {convoyeurMissions && convoyeurMissions.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Vous n'avez pas de missions en cours ou livrées.</p>
            ) : (
              convoyeurMissions?.map((mission) => (
                <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      De: {mission.lieu_depart} à {mission.lieu_arrivee}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>Statut:</strong> <span className={`font-medium ${
                      mission.statut === 'en cours' ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>{mission.statut}</span></p>
                    <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>

                    {mission.statut === 'en cours' && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`comments-${mission.id}`}>Commentaires</Label>
                          <Textarea
                            id={`comments-${mission.id}`}
                            value={missionComments[mission.id] || ""}
                            onChange={(e) => handleCommentChange(mission.id, e.target.value)}
                            placeholder="Ajouter des commentaires sur la livraison..."
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`price-${mission.id}`}>Prix de la mission (€)</Label>
                          <Input
                            id={`price-${mission.id}`}
                            type="number"
                            step="0.01"
                            value={missionPrices[mission.id] || ""}
                            onChange={(e) => handlePriceChange(mission.id, e.target.value)}
                            placeholder="Ex: 150.00"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor={`photos-${mission.id}`}>Photos</Label>
                          <Input
                            id={`photos-${mission.id}`}
                            type="file"
                            multiple
                            onChange={(e) => handlePhotoChange(mission.id, e.target.files)}
                            className="mt-1"
                          />
                          {missionPhotos[mission.id] && missionPhotos[mission.id].length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                              Fichiers sélectionnés: {missionPhotos[mission.id].join(', ')} (Non uploadés)
                            </p>
                          )}
                        </div>
                        <Button onClick={() => handleMarquerCommeLivree(mission.id)} className="w-full bg-green-600 hover:bg-green-700">
                          Marquer comme livrée
                        </Button>
                      </div>
                    )}

                    {mission.statut === 'livrée' && (
                      <>
                        {mission.commentaires && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Commentaires:</strong> {mission.commentaires}
                          </p>
                        )}
                        {mission.photos && mission.photos.length > 0 && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Photos:</strong> {mission.photos.join(', ')} (Fichiers non affichés)
                          </p>
                        )}
                        {mission.price && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Prix:</strong> {mission.price} €
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline" className="px-8 py-4 text-lg">Retour à l'accueil</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Convoyeur;