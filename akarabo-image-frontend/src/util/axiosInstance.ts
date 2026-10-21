/**
 * The single axios client used by every service.
 *
 * Responsibilities:
 *  - talk to the versioned API base URL,
 *  - attach the bearer token to authenticated requests,
 *  - turn every failure into a predictable `ApiError`,
 *  - broadcast session expiry so the app can bounce back to the login page.
 */
import axios, { AxiosError, type AxiosInstance } from 'axios';
import { API_BASE_URL } from './apiUrl';
import { tokenStore, userStore } from './auth';
import { ApiError, type ApiErrorEnvelope } from '../types/api';

/** Called when the backend rejects the token (401) or the role (403). */
type AuthFailureHandler = (statusCode: number) => void;

let authFailureHandler: AuthFailureHandler | null = null;

/** Registers the handler invoked on authentication/authorization failures. */
export function setAuthFailureHandler(handler: AuthFailureHandler | null): void {
  authFailureHandler = handler;
}

function normaliseError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorEnvelope>;
    const payload = axiosError.response?.data;
    const statusCode = axiosError.response?.status ?? 0;

    if (payload && typeof payload === 'object' && 'statusCode' in payload) {
      const raw = payload.message;
      const messages = Array.isArray(raw) ? raw : [raw];
      return new ApiError(
        messages[0] ?? 'Something went wrong.',
        payload.statusCode ?? statusCode,
        messages,
        payload.error,
      );
    }

    if (axiosError.code === 'ERR_NETWORK') {
      return new ApiError(
        'Cannot reach the Akarabo Image API. Check that the backend is running.',
        0,
        [],
        'Network Error',
      );
    }

    return new ApiError(
      axiosError.message || 'Something went wrong.',
      statusCode,
      [],
      axiosError.code ?? 'Request Error',
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0, [], error.name);
  }

  return new ApiError('Something went wrong.', 0, [], 'Unknown Error');
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = normaliseError(error);

    if (apiError.isUnauthorized || apiError.isForbidden) {
      authFailureHandler?.(apiError.statusCode);
    }

    return Promise.reject(apiError);
  },
);

/** Clears the persisted session (used on logout and on session expiry). */
export function clearSession(): void {
  tokenStore.clear();
  userStore.clear();
}
