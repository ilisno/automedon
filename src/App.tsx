import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Concessionnaire from "./pages/Concessionnaire";
import Convoyeur from "./pages/Convoyeur";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Redirect to login if not authenticated and not on login page
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      } else if (session && window.location.pathname === "/login") {
        // Redirect to home if authenticated and on login page
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/concessionnaire" element={<Concessionnaire />} />
      <Route path="/convoyeur" element={<Convoyeur />} />
      <Route path="/login" element={<Login />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SessionContextProvider supabaseClient={supabase}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;