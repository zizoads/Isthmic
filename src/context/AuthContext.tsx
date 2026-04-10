import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, n: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
  refreshProfile: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAndSetProfile = async (firebaseUser: any) => {
    try {
      const profile = await AuthService.syncUserProfile(firebaseUser);
      setUser(profile);
    } catch (error) {
      console.error("Failed to sync profile", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        await fetchAndSetProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      await fetchAndSetProfile(currentUser);
    }
  };

  const login = async () => {
    try {
      await AuthService.loginWithGoogle();
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.warn('Login popup closed by user.');
      } else {
        console.error('Login failed:', error);
      }
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await AuthService.loginWithEmail(email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    await AuthService.registerWithEmail(email, pass, name);
  };

  const logout = async () => {
    await AuthService.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithEmail, registerWithEmail, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
