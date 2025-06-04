import { MadeWithDyad } from "@/components/made-with-dyad";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
          Bienvenue sur Automédon
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl">
          Votre plateforme pour la gestion et le convoyage de véhicules.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Button
            onClick={() => navigate("/concessionnaire")}
            className="px-8 py-4 text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300 shadow-lg"
          >
            Je suis concessionnaire
          </Button>
          <Button
            onClick={() => navigate("/convoyeur")}
            className="px-8 py-4 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors duration-300 shadow-lg"
          >
            Je suis convoyeur
          </Button>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;