/**
 * Single source of truth for the API location.
 *
 * The backend serves the versioned REST API under `API_PREFIX` + `/v1`
 * (default `http://localhost:8000/api/v1`). The value is injected through
 * `VITE_API_BASE_URL` so no environment detail leaks into feature code.
 */
const RAW_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

/** Base URL without a trailing slash. */
export const API_BASE_URL = RAW_BASE_URL.replace(/\/+$/, '');

/** Builds a fully qualified URL for an API path. */
export function apiUrl(path: string): string {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Drops `undefined` / `null` / `''` entries so they never reach the query string. */
export function cleanQuery<T extends Record<string, unknown>>(query: T): T {
  const output = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    output[key] = value;
  }
  return output as T;
}
