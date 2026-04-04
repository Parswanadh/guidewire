// Auth Context - Manages API-backed authentication state
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { apiClient, type AuthUser, type RiderUser } from '../lib/apiClient';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  riderSignIn: (mobile: string, password: string) => Promise<RiderUser>;
  riderSignUp: (payload: {
    name: string;
    mobile: string;
    password: string;
    plan: 'basic' | 'standard' | 'premium';
    hubId?: string;
    partnerId?: string;
    location?: { lat: number; lng: number };
  }) => Promise<RiderUser>;
  insurerSignIn: (email: string, password: string) => Promise<AuthUser>;
  refreshUser: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((nextUser: AuthUser, nextToken: string) => {
    setUserState(nextUser);
    setToken(nextToken);
    try {
      localStorage.setItem('shieldride_auth_token', nextToken);
      localStorage.setItem('shieldride_auth_user', JSON.stringify(nextUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUserState(null);
    setToken(null);
    try {
      localStorage.removeItem('shieldride_auth_token');
      localStorage.removeItem('shieldride_auth_user');
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    const boot = async () => {
      try {
        const storedToken = localStorage.getItem('shieldride_auth_token');
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        setToken(storedToken);
        const profile = await apiClient.getMe(storedToken);
        setUserState(profile.user);
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    boot();
  }, [clearAuth]);

  const riderSignIn = useCallback(async (mobile: string, password: string): Promise<RiderUser> => {
    const response = await apiClient.riderLogin(mobile, password);
    persistAuth(response.user, response.token);
    return response.user;
  }, [persistAuth]);

  const riderSignUp = useCallback(async (payload: {
    name: string;
    mobile: string;
    password: string;
    plan: 'basic' | 'standard' | 'premium';
    hubId?: string;
    partnerId?: string;
    location?: { lat: number; lng: number };
  }): Promise<RiderUser> => {
    const response = await apiClient.riderSignup(payload);
    persistAuth(response.user, response.token);
    return response.user;
  }, [persistAuth]);

  const insurerSignIn = useCallback(async (email: string, password: string): Promise<AuthUser> => {
    const response = await apiClient.insurerLogin(email, password);
    persistAuth(response.user, response.token);
    return response.user;
  }, [persistAuth]);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await apiClient.getMe(token);
      setUserState(profile.user);
      try {
        localStorage.setItem('shieldride_auth_user', JSON.stringify(profile.user));
      } catch {
        // Ignore storage errors
      }
    } catch {
      clearAuth();
    }
  }, [clearAuth, token]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const setUser = useCallback((nextUser: AuthUser) => {
    setUserState(nextUser);
    try {
      localStorage.setItem('shieldride_auth_user', JSON.stringify(nextUser));
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        riderSignIn,
        riderSignUp,
        insurerSignIn,
        refreshUser,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
