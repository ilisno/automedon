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
    console.log('AuthContext: fetchProfile started for userId:', userId);
    setLoading(true); // Sets loading to true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('AuthContext: Error fetching profile:', error);
        console.error('AuthContext: Full error object:', JSON.stringify(error, null, 2));
        return null;
      }
      console.log('AuthContext: Profile fetched:', data);
      return data as Profile;
    } catch (err) {
      console.error('AuthContext: Unexpected error during fetchProfile:', err);
      console.error('AuthContext: Full unexpected error object:', JSON.stringify(err, null, 2));
      return null;
    } finally {
      setLoading(false); // Ensure loading is always set to false
      console.log('AuthContext: fetchProfile finished, loading set to false.');
    }
  };

  // Function to update user profile
  const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
    console.log('AuthContext: updateProfile started for userId:', userId, 'updates:', updates);
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
    console.log('AuthContext: Profile updated:', data);
    return data as Profile;
  };

  // Effect to listen for auth state changes and fetch profile
  useEffect(() => {
    console.log('AuthContext: useEffect mounted, starting auth state listener and initial session check.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (session) {
        setUser(session.user);
        console.log('AuthContext: User set:', session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        console.log('AuthContext: Profile set after auth state change:', userProfile);
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: User and profile cleared (signed out).');
      }
      // setLoading(false); // This line is now handled by fetchProfile's finally block
      console.log('AuthContext: Auth state change processed.');
    });

    // Initial check for session on mount
    const getInitialSession = async () => {
      console.log('AuthContext: getInitialSession started.');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        console.log('AuthContext: Initial user set:', session.user);
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        console.log('AuthContext: Initial profile set:', userProfile);
      } else {
        console.log('AuthContext: No initial session found.');
        setLoading(false); // Ensure loading is false if no session
      }
      // setLoading(false); // This line is now handled by fetchProfile's finally block or the else branch
      console.log('AuthContext: Initial session check processed.');
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
      console.log('AuthContext: Auth state subscription unsubscribed.');
    };
  }, []); // Empty dependency array, runs once on mount

  console.log('AuthContext: Render - loading:', loading, 'user:', user?.id, 'profile:', profile);

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