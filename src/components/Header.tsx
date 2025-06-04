import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const isMobile = useIsMobile();

  const navLinks = (
    <>
      <Link to="/" className="text-lg font-medium hover:text-primary-foreground transition-colors">
        Accueil
      </Link>
      <Link to="/concessionnaire" className="text-lg font-medium hover:text-primary-foreground transition-colors">
        Concessionnaire
      </Link>
      <Link to="/convoyeur" className="text-lg font-medium hover:text-primary-foreground transition-colors">
        Convoyeur
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