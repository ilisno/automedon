import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";

interface SignUpFormProps {
  initialRole?: 'client' | 'convoyeur' | null;
  onSignUpSuccess: () => void;
  onForgotPasswordClick: () => void; // NEW: Add prop for forgot password
}

const SignUpForm: React.FC<SignUpFormProps> = ({ initialRole, onSignUpSuccess, onForgotPasswordClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"client" | "convoyeur" | "">(initialRole || "");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!role) {
      showError("Veuillez sélectionner votre rôle (Client ou Convoyeur).");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
          },
        },
      });

      if (error) {
        showError(`Erreur d'inscription: ${error.message}`);
      } else if (data.user) {
        showSuccess("Inscription réussie ! Veuillez vérifier votre e-mail pour confirmer votre compte.");
        onSignUpSuccess();
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      showError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <div>
        <Label htmlFor="role-select">Je suis...</Label>
        <Select value={role} onValueChange={(value: "client" | "convoyeur") => setRole(value)} required>
          <SelectTrigger id="role-select" className="mt-1">
            <SelectValue placeholder="Sélectionnez votre rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="convoyeur">Convoyeur</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1"
        />
      </div>
      <Button type="submit" className="w-full px-8 py-2 text-lg" disabled={loading}>
        {loading ? "Inscription..." : "S'inscrire"}
      </Button>
      <Button type="button" variant="link" onClick={onForgotPasswordClick} className="w-full text-sm mt-2">
        Mot de passe oublié ?
      </Button>
    </form>
  );
};

export default SignUpForm;