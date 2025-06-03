import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Concessionnaire from "./pages/Concessionnaire";
import Convoyeur from "./pages/Convoyeur";
import { MissionsProvider } from "./context/missionsContext";
import Header from "./components/Header";
import { SessionContextProvider } from '@supabase/auth-ui-react';
import { supabase } from './lib/supabaseClient';
import AuthPage from "./pages/AuthPage"; // New Auth page
import CompleteProfile from "./pages/CompleteProfile"; // Re-add CompleteProfile
import Account from "./pages/Account"; // Re-add Account
import ProtectedRoute from "./components/ProtectedRoute"; // Re-add ProtectedRoute
import { AuthProvider } from "./context/AuthContext"; // New AuthProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider> {/* New AuthProvider for profile management */}
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} /> {/* Unified Auth page */}
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/concessionnaire"
                element={
                  <ProtectedRoute>
                    <Concessionnaire />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/convoyeur"
                element={
                  <ProtectedRoute>
                    <Convoyeur />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </SessionContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;