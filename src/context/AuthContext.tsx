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
  login: (email: string, password: string) => Promise<void>; // Changed return type
  register: (email: string, password: string, companyType: string) => Promise<void>; // Changed return type
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

    console.log('AuthContext: getProfile - Supabase query returned.'); // NEW LOG HERE

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
        // Only fetch profile if it's not already loaded
        if (!profile || profile.id !== session.user.id) {
          const userProfile = await getProfile(session.user.id);
          setProfile(userProfile);
        }
        console.log('AuthContext: Profile after auth state change:', profile);
        console.log('AuthContext: Finished processing auth state change for event:', event);
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: Finished processing auth state change for signed out user.');
      }
      console.log('AuthContext: About to set loading to false (onAuthStateChange).');
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
        // Only fetch profile if it's not already loaded
        if (!profile || profile.id !== session.user.id) {
          const userProfile = await getProfile(session.user.id);
          setProfile(userProfile);
        }
        console.log('AuthContext: Profile after initial check:', profile);
        console.log('AuthContext: Finished initial auth check with session.');
      } else {
        setUser(null);
        setProfile(null);
        console.log('AuthContext: Finished initial auth check without session.');
      }
      console.log('AuthContext: About to set loading to false (checkInitialAuth).');
      setLoading(false); // Set loading to false after initial check is complete
      console.log('AuthContext: Loading set to false after initial check.');
    };

    checkInitialAuth();


    return () => subscription.unsubscribe();
  }, [profile]); // Add profile to dependency array to ensure it's updated

  const login = async (email: string, password: string): Promise<void> => {
    console.log('AuthContext: Attempting login with email:', email);
    console.log('AuthContext: Password length:', password.length);
    // setLoading(true); // Removed: onAuthStateChange will handle loading state
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('AuthContext: Supabase login error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase login successful.');
      // setUser and setProfile are now handled by onAuthStateChange
    } catch (e) {
      console.error('AuthContext: Error during login:', e);
      throw e;
    } finally {
      // setLoading(false); // Removed: onAuthStateChange will handle loading state
      console.log('AuthContext: Login attempt finished.');
    }
  };

  const register = async (email: string, password: string, companyType: string): Promise<void> => {
    console.log('AuthContext: Attempting registration with email:', email, 'companyType:', companyType);
    // setLoading(true); // Removed: onAuthStateChange will handle loading state
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            company_type: companyType,
          },
        },
      });
      if (error) {
        console.error('AuthContext: Supabase registration error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase registration successful.');
      // setUser and setProfile are now handled by onAuthStateChange
    } catch (e) {
      console.error('AuthContext: Error during registration:', e);
      throw e;
    } finally {
      // setLoading(false); // Removed: onAuthStateChange will handle loading state
      console.log('AuthContext: Registration attempt finished.');
    }
  };

  const logout = async (): Promise<void> => {
    console.log('AuthContext: Attempting logout');
    // setLoading(true); // Removed: onAuthStateChange will handle loading state
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthContext: Supabase logout error:', error);
        throw error;
      }
      console.log('AuthContext: Supabase logout successful');
      // setUser and setProfile are now handled by onAuthStateChange
    } catch (e) {
      console.error('AuthContext: Error during logout:', e);
      throw e;
    } finally {
      // setLoading(false); // Removed: onAuthStateChange will handle loading state
      console.log('AuthContext: Logout attempt finished.');
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