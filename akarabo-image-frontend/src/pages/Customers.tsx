import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon } from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { InputField } from '../ui/InputField';
import { useAuth } from '../context/AuthContext';
import {
  useCustomers,
  usePaginationControls,
  usePaginationState,
} from '../hooks';
import {
  customerStatusLabel,
  customerStatusTone,
  toCustomerView,
} from '../mappers/customerMapper';
import { canManageCustomers } from '../util/permissions';
import { formatDate } from '../util/formatters';
import type { Customer } from '../types/customer';

/** Customer directory with search, status filter and pagination. */
export function Customers() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState<'' | 'true' | 'false'>('');

  const pagination = usePaginationState();

  const query = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(isActive ? { isActive: isActive === 'true' } : {}),
    }),
    [pagination.page, pagination.limit, searchTerm, isActive],
  );

  const customers = useCustomers(query);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: customers.data?.meta.total ?? 0,
  });

  const rows: Customer[] = customers.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="People and companies the studio books work for."
        actions={
          canManageCustomers(user?.role) && (
            <Link to="/customers/new" className="ak-button ak-button--primary">
              <PlusIcon size={18} />
              New customer
            </Link>
          )
        }
      />

      <div className="ak-card">
        <div className="ak-toolbar">
          <form
            className="ak-toolbar__search ak-row ak-gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchTerm(search.trim());
              pagination.reset();
            }}
          >
            <InputField
              aria-label="Search customers"
              placeholder="Search by name, phone or email…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" className="ak-button ak-button--secondary">
              <SearchIcon size={18} />
            </button>
          </form>

          <select
            className="ak-select"
            aria-label="Filter by status"
            value={isActive}
            onChange={(event) => {
              setIsActive(event.target.value as '' | 'true' | 'false');
              pagination.reset();
            }}
          >
            <option value="">All customers</option>
            <option value="true">Active only</option>
            <option value="false">Deactivated only</option>
          </select>
        </div>

        {customers.error && (
          <div className="ak-mb-4" style={{ padding: '0 1.5rem' }}>
            <ErrorMessage
              error={customers.error}
              onRetry={() => void customers.refetch()}
            />
          </div>
        )}

        {customers.isLoading ? (
          <LoadingBlock message="Loading customers…" />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(customer) => customer.id}
            empty={
              <EmptyState
                title="No customers found"
                description={
                  searchTerm
                    ? 'No customer matches that search.'
                    : 'Register the first customer to start booking work.'
                }
                action={
                  canManageCustomers(user?.role) && (
                    <Link
                      to="/customers/new"
                      className="ak-button ak-button--primary"
                    >
                      New customer
                    </Link>
                  )
                }
              />
            }
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (customer) => {
                  const view = toCustomerView(customer);
                  return (
                    <span className="ak-stack">
                      <span className="ak-strong">{view.displayName}</span>
                      <span className="ak-tiny ak-subtle">{view.displayEmail}</span>
                    </span>
                  );
                },
              },
              {
                key: 'phone',
                header: 'Phone',
                render: (customer) => toCustomerView(customer).displayPhone,
              },
              {
                key: 'address',
                header: 'Address',
                render: (customer) => toCustomerView(customer).shortAddress,
              },
              {
                key: 'registered',
                header: 'Registered',
                render: (customer) => formatDate(customer.createdAt),
              },
              {
                key: 'status',
                header: 'Status',
                render: (customer) => (
                  <Badge tone={customerStatusTone(customer.isActive)}>
                    {customerStatusLabel(customer.isActive)}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (customer) => (
                  <Link
                    to={`/customers/${customer.id}`}
                    className="ak-button ak-button--secondary ak-button--sm"
                  >
                    Open
                  </Link>
                ),
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
    </>
  );
}

export default Customers;
