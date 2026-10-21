/**
 * Session state.
 *
 * The AuthContext owns the signed-in user and the token; these hooks are the
 * only way components should read or change it.
 */
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { tokenStore, userStore } from '../util/auth';
import { clearSession } from '../util/axiosInstance';
import { toAuthUser } from '../mappers/authMapper';
import type { AuthUser, LoginCredentials } from '../types/auth';
import { queryKeys } from './queryKeys';

/** Reads the current session from the auth context. */
export function useAuthSession() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { user, isAuthenticated, isLoading };
}

/** The signed-in user's profile. */
export function useCurrentUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}

/** Signs a user in and persists the session. */
export function useLogin() {
  const { login } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(
    async (credentials: LoginCredentials) => {
      const result = await login(credentials);
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      return result;
    },
    [login, queryClient],
  );
}

/**
 * Signs the user out.
 *
 * The backend records the logout in the audit trail; the client then throws
 * the token away and clears every cached query.
 */
export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await logout();
    } finally {
      clearSession();
      tokenStore.clear();
      userStore.clear();
      queryClient.clear();
    }
  }, [logout, queryClient]);
}

/**
 * Re-reads the profile from the API — used to pick up role changes that
 * happened while the tab was open.
 */
export function useRefreshProfile() {
  const { setUser } = useAuth();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    const profile = await authService.me();
    setUser(profile);
    queryClient.setQueryData(queryKeys.auth.me, profile);
    return profile;
  }, [setUser, queryClient]);
}

/** Restores the persisted profile into the context after a page reload. */
export function hydrateUser(): AuthUser | null {
  const stored = userStore.get<AuthUser>();
  return stored ? toAuthUser(stored) : null;
}
