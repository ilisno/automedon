import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useMissions } from "@/context/MissionsContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { showSuccess, showError } from "@/utils/toast";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: 'concessionnaire' | 'convoyeur' | null;
  phone: string | null;
  company_type: string | null;
  siret: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  is_profile_complete: boolean;
};

const Concessionnaire = () => {
  const { useConcessionnaireMissions } = useMissions();
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<'concessionnaire' | 'convoyeur' | ''>("");
  const [phone, setPhone] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [siret, setSiret] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
          setCompanyType(data.company_type || "");
          setSiret(data.siret || "");
          setAddress(data.address || "");
          setPostalCode(data.postal_code || "");
          setCity(data.city || "");
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
      company_type: companyType || null,
      siret: siret || null,
      address: address || null,
      postal_code: postalCode || null,
      city: city || null,
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

  const { missions: concessionnaireMissions, isLoading: isLoadingMissions } = useConcessionnaireMissions(userId || undefined);

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
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Espace Concessionnaire</h1>
        <p className="text-lg mb-8 text-center">
          Bienvenue dans votre espace dédié. Gérez vos missions et mettez à jour votre profil.
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
            <div className="flex items-center space-x-2">
              <Checkbox id="isProfileComplete" checked={isProfileComplete} onCheckedChange={(checked) => setIsProfileComplete(checked === true)} />
              <Label htmlFor="isProfileComplete">Avez-vous complété votre profil ?</Label>
            </div>
            <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loadingProfile}>
              {loadingProfile ? "Sauvegarde..." : "Sauvegarder le profil"}
            </Button>
          </form>
        </div>

        {/* Section Missions */}
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Mes Missions</h2>
          <div className="flex justify-center mb-6">
            <Link to="/create-mission">
              <Button className="px-8 py-4 text-lg">Créer une nouvelle mission</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concessionnaireMissions && concessionnaireMissions.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 dark:text-gray-400">Aucune mission créée pour le moment.</p>
            ) : (
              concessionnaireMissions?.map((mission) => (
                <Card key={mission.id} className="w-full bg-white dark:bg-gray-800 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{mission.modele} ({mission.immatriculation})</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      De: {mission.lieu_depart} à {mission.lieu_arrivee}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p><strong>Statut:</strong> <span className={`font-medium ${
                      mission.statut === 'Disponible' ? 'text-blue-600 dark:text-blue-400' :
                      mission.statut === 'en attente' ? 'text-yellow-600 dark:text-yellow-400' :
                      mission.statut === 'en cours' ? 'text-orange-600 dark:text-orange-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>{mission.statut}</span></p>
                    <p><strong>Heure limite:</strong> {new Date(mission.heureLimite).toLocaleString()}</p>
                    {mission.convoyeur_id && <p><strong>Convoyeur:</strong> {mission.convoyeur_id}</p>} {/* Placeholder for convoyeur name */}
                    {mission.commentaires && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Commentaires:</strong> {mission.commentaires}</p>}
                    {mission.price && <p className="text-sm text-gray-700 dark:text-gray-300"><strong>Prix:</strong> {mission.price} €</p>}
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

export default Concessionnaire;