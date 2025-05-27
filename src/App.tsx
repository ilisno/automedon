import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Concessionnaire from "./pages/Concessionnaire";
import Convoyeur from "./pages/Convoyeur";
import CompleteProfile from "./pages/CompleteProfile"; // Import the new page
import { MissionsProvider } from "./context/missionsContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <MissionsProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
               {/* Add the new route for completing the profile */}
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute> {/* Protect this route */}
                    <CompleteProfile />
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
        </MissionsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;