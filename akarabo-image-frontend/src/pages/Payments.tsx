import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatusMessage } from '../components/StatusMessage';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { DateField } from '../ui/DateField';
import { SelectField } from '../ui/SelectField';
import { ReasonDialog } from '../ui/ReasonDialog';
import { useAuth } from '../context/AuthContext';
import {
  usePaginationControls,
  usePaginationState,
  usePayments,
  useReversePayment,
} from '../hooks';
import {
  paymentStatusLabel,
  paymentStatusTone,
  toPaymentView,
} from '../mappers/paymentMapper';
import { paymentMethodOptions, paymentStatusOptions } from '../data/constants';
import {
  canRecordPayments,
  canReverseFinance,
} from '../util/permissions';
import { formatMoney } from '../util/formatters';
import type { Payment, PaymentMethod, PaymentStatus } from '../types/payment';

/** Payments received by the studio. */
export function Payments() {
  const { user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [method, setMethod] = useState<PaymentMethod | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reverseTarget, setReverseTarget] = useState<Payment | null>(null);
  const [notice, setNotice] = useState<string | undefined>(undefined);

  const pagination = usePaginationState();
  const reversePayment = useReversePayment();

  const query = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(status ? { status } : {}),
      ...(method ? { method } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [pagination.page, pagination.limit, status, method, dateFrom, dateTo],
  );

  const payments = usePayments(query);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: payments.data?.meta.total ?? 0,
  });

  const rows: Payment[] = payments.data?.data ?? [];

  const handleReverse = async (reason: string) => {
    if (!reverseTarget) return;
    try {
      await reversePayment.mutateAsync({ id: reverseTarget.id, reason });
      setReverseTarget(null);
      setNotice('Payment reversed. The record was kept with its reason.');
    } catch (error) {
      setNotice(errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Money received by the studio — records are reversed, never deleted."
        actions={
          canRecordPayments(user?.role) && (
            <Link to="/payments/new" className="ak-button ak-button--primary">
              <PlusIcon size={18} />
              Record payment
            </Link>
          )
        }
      />

      {notice && (
        <div className="ak-mb-4">
          <StatusMessage tone="info">{notice}</StatusMessage>
        </div>
      )}

      <div className="ak-card">
        <div className="ak-toolbar">
          <SelectField
            aria-label="Filter by status"
            placeholder="All statuses"
            options={paymentStatusOptions}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as PaymentStatus | '');
              pagination.reset();
            }}
          />
          <SelectField
            aria-label="Filter by method"
            placeholder="All methods"
            options={paymentMethodOptions}
            value={method}
            onChange={(event) => {
              setMethod(event.target.value as PaymentMethod | '');
              pagination.reset();
            }}
          />
          <DateField
            aria-label="From date"
            value={dateFrom}
            onChange={(event) => {
              setDateFrom(event.target.value);
              pagination.reset();
            }}
          />
          <DateField
            aria-label="To date"
            value={dateTo}
            onChange={(event) => {
              setDateTo(event.target.value);
              pagination.reset();
            }}
          />
        </div>

        {payments.error && (
          <div className="ak-mb-4" style={{ padding: '0 1.5rem' }}>
            <ErrorMessage
              error={payments.error}
              onRetry={() => void payments.refetch()}
            />
          </div>
        )}

        {payments.isLoading ? (
          <LoadingBlock message="Loading payments…" />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(payment) => payment.id}
            empty={
              <EmptyState
                title="No payments recorded"
                description="Record the first payment to start tracking the studio's income."
                action={
                  canRecordPayments(user?.role) && (
                    <Link
                      to="/payments/new"
                      className="ak-button ak-button--primary"
                    >
                      Record payment
                    </Link>
                  )
                }
              />
            }
            columns={[
              {
                key: 'amount',
                header: 'Amount',
                render: (payment) => {
                  const view = toPaymentView(payment);
                  return (
                    <span className="ak-stack">
                      <span className="ak-strong">
                        {formatMoney(payment.amount, payment.currency)}
                      </span>
                      <span className="ak-tiny ak-subtle">{view.displayDate}</span>
                    </span>
                  );
                },
              },
              {
                key: 'method',
                header: 'Method',
                render: (payment) => toPaymentView(payment).displayMethod,
              },
              {
                key: 'reference',
                header: 'Reference',
                render: (payment) => payment.reference ?? '—',
              },
              {
                key: 'notes',
                header: 'Notes',
                render: (payment) => payment.notes ?? '—',
              },
              {
                key: 'status',
                header: 'Status',
                render: (payment) => (
                  <Badge tone={paymentStatusTone(payment.status)}>
                    {paymentStatusLabel(payment.status)}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (payment) =>
                  canReverseFinance(user?.role) &&
                  payment.status === 'COMPLETED' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setReverseTarget(payment)}
                    >
                      Reverse
                    </Button>
                  ) : null,
              },
            ]}
          />
        )}

        <Pagination
          page={pagination.page}
          limit={pagination.limit}
          total={controls.total}
          canGoPrevious={controls.canGoPrevious}
          canGoNext={controls.canGoNext}
          onPageChange={pagination.setPage}
          onLimitChange={pagination.setLimit}
        />
      </div>

      <ReasonDialog
        open={Boolean(reverseTarget)}
        title="Reverse this payment?"
        description="Payments are never deleted. This record becomes REVERSED and the reason below is kept forever."
        confirmLabel="Reverse payment"
        isSubmitting={reversePayment.isPending}
        onCancel={() => setReverseTarget(null)}
        onConfirm={(reason) => void handleReverse(reason)}
      />
    </>
  );
}

export default Payments;
