/**
 * Where the session lives between reloads.
 *
 * The backend issues a stateless JWT that is valid for one day, so the token
 * is kept in `localStorage` to survive a page refresh. `sessionStorage` would
 * log the user out on every new tab.
 */
const TOKEN_KEY = 'akarabo.accessToken';
const USER_KEY = 'akarabo.user';

export const tokenStore = {
  get(): string | null {
    try {
      return window.localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* storage unavailable (private mode) — the session stays in memory */
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* no-op */
    }
  },
};

export const userStore = {
  get<T>(): T | null {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(user: T): void {
    try {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      /* no-op */
    }
  },
  clear(): void {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      /* no-op */
    }
  },
};

/** True when a usable access token is present. */
export function hasSession(): boolean {
  return Boolean(tokenStore.get());
}
