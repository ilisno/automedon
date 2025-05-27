import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';

type AuthContextType = {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);

  const login = async (email: string, password: string) => {
    console.log('AuthContext: Attempting login with email:', email); // Log start of login
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('AuthContext: Supabase login error:', error); // Log Supabase error
      throw error; // Re-throw the error so it can be caught in the component
    }
    console.log('AuthContext: Supabase login successful, user data:', data.user); // Log success with user data
    setUser(data.user);
  };

  const register = async (email: string, password: string) => {
    console.log('AuthContext: Attempting registration with email:', email); // Log start of registration
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error('AuthContext: Supabase registration error:', error); // Log Supabase error
      throw error; // Re-throw the error
    }
    console.log('AuthContext: Supabase registration successful, user data:', data.user); // Log success with user data
    setUser(data.user);
  };

  const logout = async () => {
    console.log('AuthContext: Attempting logout'); // Log start of logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthContext: Supabase logout error:', error); // Log Supabase error
      throw error; // Re-throw the error
    }
    console.log('AuthContext: Supabase logout successful'); // Log success
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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