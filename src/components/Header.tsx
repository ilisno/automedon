import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn, LogOut, User, Shield } from "lucide-react"; // Import Shield icon for admin
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Profile } from "@/context/MissionsContext"; // Import Profile type

const Header = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<Profile['role'] | null>(null); // State to store user role

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setUserRole(null);
        } else if (profile) {
          setUserRole(profile.role);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchSessionAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Re-fetch profile when auth state changes
      if (session) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching user profile on auth change:", error);
              setUserRole(null);
            } else if (profile) {
              setUserRole(profile.role);
            }
          });
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = (
    <>
      {session ? (
        <>
          {userRole === 'admin' && (
            <Link to="/admin/dashboard" className="text-lg font-medium hover:text-primary-foreground transition-colors flex items-center">
              <Shield className="mr-2 h-5 w-5" /> Espace Admin
            </Link>
          )}
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
    </>
  );

  return (
    <header className="w-full bg-primary text-primary-foreground p-4 shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <img src="/automedonlogo.jpg" alt="Automedon Logo" className="h-8 w-8 mr-2 rounded-full" />
          Automedon
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