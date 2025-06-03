import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

// Define the Profile type based on your Supabase 'profiles' table
type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  date_of_birth: string | null;
  languages: string[] | null;
  company_type: string | null;
  siret: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  driver_license_number: string | null;
  license_issue_date: string | null;
  license_issue_city: string | null;
  is_profile_complete: boolean;
  role: 'concessionnaire' | 'convoyeur' | null; // Explicit roles
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<Profile | null>;
  updateProfile: (userId: string, updates: Partial<Profile>) => Promise<Profile | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setLoading(false);
    if (error) {
      console.error('AuthContext: Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  // Function to update user profile
  const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    setLoading(false);
    if (error) {
      console.error('AuthContext: Error updating profile:', error);
      return null;
    }
    setProfile(data as Profile); // Update local state with new profile data
    return data as Profile;
  };

  // Effect to listen for auth state changes and fetch profile
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false); // Always set loading to false after state change is processed
    });

    // Initial check for session on mount
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, fetchProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};