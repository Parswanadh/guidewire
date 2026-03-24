// Auth Context - Manages authentication state
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type MockUser, MOCK_USER } from '../lib/mockData';

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobile: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    if (typeof localStorage !== 'undefined') {
      const storedAuth = localStorage.getItem('shieldride_auth');
      if (storedAuth) {
        try {
          setUser(JSON.parse(storedAuth));
        } catch {
          localStorage.removeItem('shieldride_auth');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (_mobile: string, otp: string): Promise<boolean> => {
    // Mock login - accepts any 6-digit OTP
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      setUser(MOCK_USER);
      try {
        localStorage.setItem('shieldride_auth', JSON.stringify(MOCK_USER));
      } catch {
        // Ignore storage errors
      }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('shieldride_auth');
  }, []);

  const updateUser = useCallback((updates: Partial<MockUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const updatedUser = { ...prev, ...updates };
      try {
        localStorage.setItem('shieldride_auth', JSON.stringify(updatedUser));
      } catch {
        // Ignore storage errors
      }
      return updatedUser;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
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
