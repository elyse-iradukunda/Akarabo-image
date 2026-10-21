/**
 * Axios configuration that attaches the bearer token to every call.
 *
 * Kept separate from `axiosInstance` so it can be reused by any client that
 * is not the shared instance (e.g. a one-off download request).
 */
import type { AxiosRequestConfig } from 'axios';
import { tokenStore } from './auth';

/** Returns request config carrying the `Authorization` header, if signed in. */
export function authConfig(): AxiosRequestConfig {
  const token = tokenStore.get();
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
