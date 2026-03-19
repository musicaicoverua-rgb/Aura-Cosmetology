// ============================================================================
// AUTHENTICATION CONTEXT
// ============================================================================
// Provides global authentication state and methods for the application
// Handles real Supabase authentication with session persistence
// ============================================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import {
  supabase,
  signInWithPassword as supabaseSignIn,
  signOut as supabaseSignOut,
} from '@/lib/supabase';

// =============================================================================
// TYPES
// =============================================================================

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// =============================================================================
// CONTEXT CREATION
// =============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ---------------------------------------------------------------------------
  // DERIVED STATE
  // ---------------------------------------------------------------------------
  const isAuthenticated = !!user && !!session;

  // ---------------------------------------------------------------------------
  // INITIAL SESSION LOAD
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Get current session from storage
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setUser(null);
          setSession(null);
          return;
        }

        if (currentSession) {
          setSession(currentSession);

          // Get current user
          const {
            data: { user: currentUser },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            console.error('Error getting user:', userError);
            setUser(null);
          } else {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ---------------------------------------------------------------------------
  // AUTH STATE CHANGE LISTENER
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event);

      switch (event) {
        case 'SIGNED_IN':
          setSession(newSession);
          setUser(newSession?.user ?? null);
          break;

        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          break;

        case 'TOKEN_REFRESHED':
          setSession(newSession);
          break;

        case 'USER_UPDATED':
          if (newSession?.user) {
            setUser(newSession.user);
          }
          break;

        case 'PASSWORD_RECOVERY':
          // Handle password recovery if needed
          break;

        default:
          break;
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // AUTHENTICATION METHODS
  // ---------------------------------------------------------------------------

  /**
   * Sign in with email and password
   * Throws error on failure for proper error handling in UI
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const { user: signedInUser, session: signedInSession } =
        await supabaseSignIn(email, password);

      // Update state immediately after successful sign in
      setUser(signedInUser);
      setSession(signedInSession);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out the current user
   */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);

      await supabaseSignOut();

      // State will be updated by onAuthStateChange listener
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Manually refresh the session
   */
  const refreshSession = useCallback(async () => {
    try {
      const {
        data: { session: refreshedSession },
        error,
      } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      setSession(refreshedSession);
      setUser(refreshedSession?.user ?? null);
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------------------------
  const contextValue: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

/**
 * useAuth hook - Access authentication context anywhere in the app
 * Must be used within AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// =============================================================================
// PROTECTED ROUTE HELPER
// =============================================================================

/**
 * Hook to check if user is admin and redirect if not
 * Use in admin route components
 */
export const useRequireAuth = (redirectPath: string = '/admin/login') => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, isLoading, redirectPath]);

  return { isAuthenticated, isLoading };
};

export default AuthContext;
