/** Authentication API calls. */
import { axiosInstance } from '../util/axiosInstance';
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
} from '../types/auth';

export const authService = {
  /** Exchanges credentials for a one-day access token. */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await axiosInstance.post<LoginResponse>(
      '/auth/login',
      credentials,
    );
    return data;
  },

  /** Records the logout in the audit trail — the client discards the token. */
  async logout(): Promise<LogoutResponse> {
    const { data } = await axiosInstance.post<LogoutResponse>('/auth/logout');
    return data;
  },

  /** Fresh profile of the signed-in user (role changes show up immediately). */
  async me(): Promise<AuthUser> {
    const { data } = await axiosInstance.get<AuthUser>('/auth/me');
    return data;
  },
};
