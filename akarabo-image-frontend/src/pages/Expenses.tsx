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
  useExpenses,
  usePaginationControls,
  usePaginationState,
  useReverseExpense,
} from '../hooks';
import {
  expenseStatusLabel,
  expenseStatusTone,
  toExpenseView,
} from '../mappers/expenseMapper';
import { expenseCategoryOptions, expenseStatusOptions } from '../data/constants';
import {
  canRecordExpenses,
  canReverseFinance,
} from '../util/permissions';
import { formatMoney } from '../util/formatters';
import type { Expense, ExpenseCategory, ExpenseStatus } from '../types/expense';

/** Studio spending. */
export function Expenses() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ExpenseStatus | ''>('');
  const [category, setCategory] = useState<ExpenseCategory | ''>('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reverseTarget, setReverseTarget] = useState<Expense | null>(null);
  const [notice, setNotice] = useState<string | undefined>(undefined);

  const pagination = usePaginationState();
  const reverseExpense = useReverseExpense();

  const query = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      ...(dateFrom ? { dateFrom } : {}),
      ...(dateTo ? { dateTo } : {}),
    }),
    [pagination.page, pagination.limit, status, category, dateFrom, dateTo],
  );

  const expenses = useExpenses(query);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: expenses.data?.meta.total ?? 0,
  });

  const rows: Expense[] = expenses.data?.data ?? [];

  const handleReverse = async (reason: string) => {
    if (!reverseTarget) return;
    try {
      await reverseExpense.mutateAsync({ id: reverseTarget.id, reason });
      setReverseTarget(null);
      setNotice('Expense reversed. The record was kept with its reason.');
    } catch (error) {
      setNotice(errorMessage(error));
    }
  };

  return (
    <>
      <PageHeader
        title="Expenses"
        subtitle="What the studio spends — records are reversed, never deleted."
        actions={
          canRecordExpenses(user?.role) && (
            <Link to="/expenses/new" className="ak-button ak-button--primary">
              <PlusIcon size={18} />
              Record expense
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
            options={expenseStatusOptions}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ExpenseStatus | '');
              pagination.reset();
            }}
          />
          <SelectField
            aria-label="Filter by category"
            placeholder="All categories"
            options={expenseCategoryOptions}
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as ExpenseCategory | '');
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

        {expenses.error && (
          <div className="ak-mb-4" style={{ padding: '0 1.5rem' }}>
            <ErrorMessage
              error={expenses.error}
              onRetry={() => void expenses.refetch()}
            />
          </div>
        )}

        {expenses.isLoading ? (
          <LoadingBlock message="Loading expenses…" />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(expense) => expense.id}
            empty={
              <EmptyState
                title="No expenses recorded"
                description="Record studio spending so the books always add up."
                action={
                  canRecordExpenses(user?.role) && (
                    <Link
                      to="/expenses/new"
                      className="ak-button ak-button--primary"
                    >
                      Record expense
                    </Link>
                  )
                }
              />
            }
            columns={[
              {
                key: 'description',
                header: 'Description',
                render: (expense) => {
                  const view = toExpenseView(expense);
                  return (
                    <span className="ak-stack">
                      <span className="ak-strong">{expense.description}</span>
                      <span className="ak-tiny ak-subtle">
                        {view.displayCategory} · {view.displayDate}
                      </span>
                    </span>
                  );
                },
              },
              {
                key: 'category',
                header: 'Category',
                render: (expense) => toExpenseView(expense).displayCategory,
              },
              {
                key: 'amount',
                header: 'Amount',
                align: 'right',
                render: (expense) =>
                  formatMoney(expense.amount, expense.currency),
              },
              {
                key: 'status',
                header: 'Status',
                render: (expense) => (
                  <Badge tone={expenseStatusTone(expense.status)}>
                    {expenseStatusLabel(expense.status)}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (expense) =>
                  canReverseFinance(user?.role) &&
                  expense.status === 'RECORDED' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setReverseTarget(expense)}
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
        title="Reverse this expense?"
        description="Expenses are never deleted. This record becomes REVERSED and the reason below is kept forever."
        confirmLabel="Reverse expense"
        isSubmitting={reverseExpense.isPending}
        onCancel={() => setReverseTarget(null)}
        onConfirm={(reason) => void handleReverse(reason)}
      />
    </>
  );
}

export default Expenses;
