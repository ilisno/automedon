import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user || profile?.role !== 'admin') {
    // Redirect to home or login if not an admin
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;