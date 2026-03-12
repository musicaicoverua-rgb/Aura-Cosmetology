import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: { name: string; phone?: string }) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const session = await authService.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || 'client',
          phone: session.user.user_metadata?.phone,
          createdAt: session.user.created_at,
        });
      }
      setIsLoading(false);
    };

    initAuth();

    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || '',
          role: session.user.user_metadata?.role || 'client',
          phone: session.user.user_metadata?.phone,
          createdAt: session.user.created_at,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await authService.signIn(email, password);
    if (error) return { error };
    
    if (data?.user) {
      setUser({
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'client',
        phone: data.user.user_metadata?.phone,
        createdAt: data.user.created_at,
      });
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, userData: { name: string; phone?: string }) => {
    const { error } = await authService.signUp(email, password, userData);
    if (error) return { error };
    return { error: null };
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};