/** Staff account (user) API calls. */
import { axiosInstance } from '../util/axiosInstance';
import { cleanQuery } from '../util/apiUrl';
import type { Paginated } from '../types/api';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserQuery,
} from '../types/user';

export const userService = {
  async list(query: UserQuery = {}): Promise<Paginated<User>> {
    const { data } = await axiosInstance.get<Paginated<User>>('/users', {
      params: cleanQuery(query as Record<string, unknown>),
    });
    return data;
  },

  async get(id: string): Promise<User> {
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await axiosInstance.post<User>('/users', payload);
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const { data } = await axiosInstance.patch<User>(`/users/${id}`, payload);
    return data;
  },

  /** Revokes access (soft) — user rows are never deleted. */
  async deactivate(id: string): Promise<User> {
    const { data } = await axiosInstance.post<User>(`/users/${id}/deactivate`);
    return data;
  },

  /** Restores a deactivated account. */
  async activate(id: string): Promise<User> {
    const { data } = await axiosInstance.post<User>(`/users/${id}/activate`);
    return data;
  },
};
