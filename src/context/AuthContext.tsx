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
  register: (email: string, password: string, companyType: string) => Promise<{ user: User | null; profile: Profile | null }>;
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
    console.log('AuthContext: getProfile - Starting fetch for user ID:', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('AuthContext: getProfile - Error fetching profile for user ID', userId, ':', error);
      return null;
    }

    if (!data) {
      console.warn('AuthContext: getProfile - No profile data returned for user ID:', userId);
      return null;
    }

    console.log('AuthContext: getProfile - Profile data received for user ID', userId, ':', data);
    return data as Profile;
  };

  // Effect to listen for auth state changes and fetch profile
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setLoading(true); // Set loading to true at the start of any auth state change
      if (session) {
        setUser(session.user);
        const userProfile = await getProfile(session.user.id);
        setProfile(userProfile);
        console.log('AuthContext: Profile after auth state change:', userProfile); // Added log
        console.log('AuthContext: Finished processing auth state change for event:', event); // NEW LOG
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: Finished processing auth state change for signed out user.'); // NEW LOG
      }
      console.log('AuthContext: About to set loading to false (onAuthStateChange).'); // NEW LOG
      setLoading(false); // Set loading to false after all async operations are done
      console.log('AuthContext: Loading set to false after auth state change.');
    });

    // Initial check
    const checkInitialAuth = async () => {
      console.log('AuthContext: Performing initial auth check...');
      setLoading(true); // Ensure loading is true during initial check
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthContext: Initial session data:', session);
      if (session) {
        setUser(session.user);
        const userProfile = await getProfile(session.user.id);
        setProfile(userProfile);
        console.log('AuthContext: Profile after initial check:', userProfile); // Added log
        console.log('AuthContext: Finished initial auth check with session.'); // NEW LOG
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: Finished initial auth check without session.'); // NEW LOG
      }
      console.log('AuthContext: About to set loading to false (checkInitialAuth).'); // NEW LOG
      setLoading(false); // Set loading to false after initial check is complete
      console.log('AuthContext: Loading set to false after initial check.');
    };

    checkInitialAuth();


    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  const login = async (email: string, password: string): Promise<{ user: User | null; profile: Profile | null }> => {
    console.log('AuthContext: Attempting login with email:', email);
    console.log('AuthContext: Password length:', password.length); // Log password length, not password itself for security
    setLoading(true);
    try { // Added try-catch for login
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('AuthContext: Supabase login error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase login successful, user data:', data.user);
      setUser(data.user);
      const userProfile = data.user ? await getProfile(data.user.id) : null;
      setProfile(userProfile);
      console.log('AuthContext: Profile after login:', userProfile); // Added log
      return { user: data.user, profile: userProfile };
    } finally { // Ensure loading is set to false in finally block
      setLoading(false);
      console.log('AuthContext: Loading set to false after login attempt.');
    }
  };

  const register = async (email: string, password: string, companyType: string): Promise<{ user: User | null; profile: Profile | null }> => {
    console.log('AuthContext: Attempting registration with email:', email, 'companyType:', companyType);
    setLoading(true);
    try { // Added try-catch for register
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_type: companyType,
            // You can add first_name, last_name here if you want them at signup
          },
        },
      });
      if (error) {
        console.error('AuthContext: Supabase registration error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase registration successful, user data:', data.user);
       // Profile is created by trigger, fetch it
      const userProfile = data.user ? await getProfile(data.user.id) : null;
      setProfile(userProfile);
      console.log('AuthContext: Profile after registration:', userProfile); // Added log
      return { user: data.user, profile: userProfile };
    } finally { // Ensure loading is set to false in finally block
      setLoading(false);
      console.log('AuthContext: Loading set to false after registration attempt.');
    }
  };

  const logout = async () => {
    console.log('AuthContext: Attempting logout');
    setLoading(true);
    try { // Added try-catch for logout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Supabase logout error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase logout successful');
      setUser(null);
      setProfile(null);
    } finally { // Ensure loading is set to false in finally block
      setLoading(false);
      console.log('AuthContext: Loading set to false after logout attempt.');
    }
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