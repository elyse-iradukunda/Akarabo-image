/** Payment queries and mutations. */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import type {
  CreatePaymentPayload,
  Payment,
  PaymentQuery,
} from '../types/payment';
import type { Paginated } from '../types/api';
import { queryKeys } from './queryKeys';

/** Paginated payments matching the given filters. */
export function usePayments(
  query: PaymentQuery = {},
  options: { enabled?: boolean } = {},
): UseQueryResult<Paginated<Payment>> {
  return useQuery({
    queryKey: queryKeys.payments.list(query),
    queryFn: () => paymentService.list(query),
    enabled: options.enabled ?? true,
  });
}

/** A single payment. */
export function usePayment(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id ?? ''),
    queryFn: () => paymentService.get(id as string),
    enabled: Boolean(id),
  });
}

/** Registers money received. */
export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentPayload) =>
      paymentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
    },
  });
}

/** Reverses a payment with a reason — records are never deleted. */
export function useReversePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      paymentService.reverse(id, reason),
    onSuccess: (payment) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(payment.id),
      });
    },
  });
}
