/** Staff account queries and mutations. */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { userService } from '../services/userService';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UserQuery,
} from '../types/user';
import type { Paginated } from '../types/api';
import { queryKeys } from './queryKeys';

/** Paginated staff accounts matching the given filters. */
export function useUsers(
  query: UserQuery = {},
): UseQueryResult<Paginated<User>> {
  return useQuery({
    queryKey: queryKeys.users.list(query),
    queryFn: () => userService.list(query),
  });
}

/** A single staff account. */
export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => userService.get(id as string),
    enabled: Boolean(id),
  });
}

/** Creates a staff account. */
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

/** Updates a staff account (role, password, contact details). */
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      userService.update(id, payload),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
    },
  });
}

/** Activates / deactivates a staff account. */
export function useUserStatusActions() {
  const queryClient = useQueryClient();

  const invalidate = (user: User) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(user.id) });
  };

  const deactivate = useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: invalidate,
  });

  const activate = useMutation({
    mutationFn: (id: string) => userService.activate(id),
    onSuccess: invalidate,
  });

  return { deactivate, activate };
}
