/**
 * Session provider.
 *
 * Owns the signed-in user and the access token. Every component reads the
 * session from here (via `useAuth`) instead of touching storage directly.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authService } from '../services/authService';
import { tokenStore, userStore } from '../util/auth';
import {
  clearSession,
  setAuthFailureHandler,
} from '../util/axiosInstance';
import { toAuthUser } from '../mappers/authMapper';
import type { AuthUser, LoginCredentials } from '../types/auth';

export interface AuthContextValue {
  /** The signed-in user, or `null` when signed out. */
  user: AuthUser | null;
  /** True while the stored session is being validated on boot. */
  isLoading: boolean;
  /** True when a valid session exists. */
  isAuthenticated: boolean;
  /** Signs a user in and persists the token. */
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  /** Signs the user out and clears every trace of the session. */
  logout: () => Promise<void>;
  /** Replaces the in-memory profile (e.g. after a refresh). */
  setUser: (user: AuthUser | null) => void;
  /** Called when the backend reports the session is no longer valid. */
  handleSessionExpiry: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Restores the persisted session when the app boots. */
  useEffect(() => {
    const token = tokenStore.get();
    const storedUser = userStore.get<AuthUser>();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Show the cached profile immediately, then refresh it from the API.
    if (storedUser) {
      setUser(toAuthUser(storedUser));
    }

    let cancelled = false;
    authService
      .me()
      .then((profile) => {
        if (cancelled) return;
        setUser(profile);
        userStore.set(profile);
      })
      .catch(() => {
        if (cancelled) return;
        clearSession();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSessionExpiry = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  // A 401 anywhere in the app ends the session.
  useEffect(() => {
    setAuthFailureHandler((statusCode) => {
      if (statusCode === 401) handleSessionExpiry();
    });
    return () => setAuthFailureHandler(null);
  }, [handleSessionExpiry]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await authService.login(credentials);
    tokenStore.set(result.accessToken);

    let profile: AuthUser;
    try {
      profile = await authService.me();
    } catch {
      // The token is valid but the profile call failed — keep the login
      // payload so the user is not stuck on the login screen.
      profile = toAuthUser(result.user);
    }

    setUser(profile);
    userStore.set(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // A failed audit entry must never block the local sign-out.
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      setUser,
      handleSessionExpiry,
    }),
    [user, isLoading, login, logout, handleSessionExpiry],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Reads the session. Must be used inside `AuthProvider`. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
