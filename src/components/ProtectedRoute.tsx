import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, profile, loading } = useAuth(); // Get user, profile, and loading state from our AuthContext

  if (loading) {
    // Optionally, render a loading spinner or message while profile is being fetched
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    // If no user, redirect to the authentication page
    return <Navigate to="/auth" replace />;
  }

  // If user exists but profile is not complete, redirect to complete-profile page
  // unless the current path is already /complete-profile to avoid infinite redirects
  if (user && profile && !profile.is_profile_complete && window.location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;