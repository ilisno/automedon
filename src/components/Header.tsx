import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, LogOut, User, Shield } from "lucide-react"; // Import Shield icon
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = (
    <>
      <Link to="/" className="text-lg font-medium hover:text-primary-foreground transition-colors">
        Accueil
      </Link>
      {session ? (
        <>
          <Link to="/account" className="text-lg font-medium hover:text-primary-foreground transition-colors flex items-center">
            <User className="mr-2 h-5 w-5" /> Mon Compte
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-lg font-medium hover:text-primary-foreground transition-colors">
            <LogOut className="mr-2 h-5 w-5" /> Déconnexion
          </Button>
        </>
      ) : (
        <Link to="/login">
          <Button variant="ghost" className="text-lg font-medium hover:text-primary-foreground transition-colors">
            <LogIn className="mr-2 h-5 w-5" /> Connexion
          </Button>
        </Link>
      )}
      {/* New Admin Link */}
      <Link to="/admin" className="text-lg font-medium hover:text-primary-foreground transition-colors flex items-center">
        <Shield className="mr-2 h-5 w-5" /> Admin
      </Link>
    </>
  );

  return (
    <header className="w-full bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold">
          Automédon
        </Link>
      </div>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px] bg-background text-foreground p-6">
            <nav className="flex flex-col space-y-4">
              {navLinks}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex space-x-6">
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Header;