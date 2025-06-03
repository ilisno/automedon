import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js'; // Import User type

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
  role: string | null; // Assuming role might be part of the profile
};


type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null; profile: Profile | null }>;
  register: (email: string, password: string) => Promise<{ user: User | null; profile: Profile | null }>;
  logout: () => Promise<void>;
  getProfile: (userId: string) => Promise<Profile | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile
  const getProfile = async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('AuthContext: Error fetching profile:', error);
      // Don't throw here, just return null or handle appropriately
      return null;
    }
    return data as Profile;
  };

  // Effect to listen for auth state changes and fetch profile
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        setUser(session.user);
        const userProfile = await getProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false); // Always set loading to false after state change is processed
    });

    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  const login = async (email: string, password: string): Promise<{ user: User | null; profile: Profile | null }> => {
    console.log('AuthContext: Attempting login with email:', email);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false); // Set loading to false after the login attempt
    if (error) {
      console.error('AuthContext: Supabase login error:', error);
      throw error;
    }
    console.log('AuthContext: Supabase login successful, user data:', data.user);
    // The onAuthStateChange listener will update user and profile, but we can also update here for immediate feedback
    setUser(data.user);
    const userProfile = data.user ? await getProfile(data.user.id) : null;
    setProfile(userProfile);
    return { user: data.user, profile: userProfile };
  };

  const register = async (email: string, password: string): Promise<{ user: User | null; profile: Profile | null }> => {
    console.log('AuthContext: Attempting registration with email:', email);
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false); // Set loading to false after the registration attempt
    if (error) {
      console.error('AuthContext: Supabase registration error:', error);
      throw error;
    }
    console.log('AuthContext: Supabase registration successful, user data:', data.user);
    // The onAuthStateChange listener will update user and profile, but we can also update here for immediate feedback
    setUser(data.user);
    const userProfile = data.user ? await getProfile(data.user.id) : null;
    setProfile(userProfile);
    return { user: data.user, profile: userProfile };
  };

  const logout = async () => {
    console.log('AuthContext: Attempting logout');
    setLoading(true); // Indicate that logout is in progress
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthContext: Supabase logout error:', error);
      setLoading(false); // If there's an error, ensure loading is reset
      throw error;
    }
    console.log('AuthContext: Supabase logout successful (waiting for onAuthStateChange to update state)');
    // State (user, profile, loading) will be updated by the onAuthStateChange listener
    // when it receives the 'SIGNED_OUT' event.
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, getProfile }}>
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