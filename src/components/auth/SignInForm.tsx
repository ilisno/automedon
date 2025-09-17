import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";

interface SignInFormProps {
  onSignInSuccess: () => void;
  onForgotPasswordClick: () => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSignInSuccess, onForgotPasswordClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showError(`Erreur de connexion: ${error.message}`);
      } else if (data.user) {
        showSuccess("Connexion réussie !");
        onSignInSuccess();
      }
    } catch (err) {
      console.error("Unexpected error during sign-in:", err);
      showError("Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
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
        {loading ? "Connexion..." : "Se connecter"}
      </Button>
      <Button type="button" variant="link" onClick={onForgotPasswordClick} className="w-full text-sm text-primary dark:text-primary-foreground">
        Mot de passe oublié ?
      </Button>
    </form>
  );
};

export default SignInForm;