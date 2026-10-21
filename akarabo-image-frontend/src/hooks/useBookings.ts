/** Booking queries and mutations. */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import type {
  Booking,
  BookingQuery,
  CreateBookingPayload,
  UpdateBookingPayload,
} from '../types/booking';
import type { Paginated } from '../types/api';
import { queryKeys } from './queryKeys';

/** Paginated bookings matching the given filters. */
export function useBookings(
  query: BookingQuery = {},
): UseQueryResult<Paginated<Booking>> {
  return useQuery({
    queryKey: queryKeys.bookings.list(query),
    queryFn: () => bookingService.list(query),
  });
}

/** A single booking. */
export function useBooking(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id ?? ''),
    queryFn: () => bookingService.get(id as string),
    enabled: Boolean(id),
  });
}

/** Creates a booking. */
export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => bookingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

/** Edits or reschedules a pending/confirmed booking. */
export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBookingPayload }) =>
      bookingService.update(id, payload),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookings.detail(booking.id),
      });
    },
  });
}

/**
 * Lifecycle transitions: confirm, complete and cancel.
 *
 * Cancelling always requires a reason — the backend keeps it forever.
 */
export function useBookingActions() {
  const queryClient = useQueryClient();

  const invalidate = (booking: Booking) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    queryClient.invalidateQueries({
      queryKey: queryKeys.bookings.detail(booking.id),
    });
  };

  const confirm = useMutation({
    mutationFn: (id: string) => bookingService.confirm(id),
    onSuccess: invalidate,
  });

  const complete = useMutation({
    mutationFn: (id: string) => bookingService.complete(id),
    onSuccess: invalidate,
  });

  const cancel = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      bookingService.cancel(id, reason),
    onSuccess: invalidate,
  });

  return { confirm, complete, cancel };
}
