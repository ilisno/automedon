import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { MissionsProvider } from "@/context/MissionsContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CreateMission from "./pages/CreateMission";
import AccountRedirect from "./pages/AccountRedirect";
import Account from "./pages/Account";
import Contact from "./pages/Contact";
import CGV from "./pages/CGV";
import AdminLogin from "./pages/AdminLogin"; // Import new AdminLogin page
import AdminDashboard from "./pages/AdminDashboard"; // Import new AdminDashboard page

const queryClient = new QueryClient();

const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        // Redirect to login if not authenticated and not on login page, home page, or admin pages
        if (window.location.pathname !== "/login" && window.location.pathname !== "/" && !window.location.pathname.startsWith("/admin")) {
          navigate("/login");
        }
      } else if (session && window.location.pathname === "/login") {
        // Redirect to account if authenticated and on login page
        navigate("/account");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-mission" element={<CreateMission />} />
      <Route path="/account-redirect" element={<AccountRedirect />} />
      <Route path="/account" element={<Account />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cgv" element={<CGV />} />
      <Route path="/admin" element={<AdminLogin />} /> {/* New route for Admin Login */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* New route for Admin Dashboard */}
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
          <MissionsProvider>
            <AppContent />
          </MissionsProvider>
        </BrowserRouter>
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;