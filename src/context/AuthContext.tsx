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
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(user);
  };

  const register = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
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