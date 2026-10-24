import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { canRegisterCustomers } from '../util/permissions';
import { formatDate } from '../util/formatters';
import type { Customer } from '../types/customer';
import { axiosInstance } from '../util/axiosInstance';

type UnfinishedClient = { id: string; customerId: string; customerName: string; phoneNumber: string; serviceDate: string; photosTaken: number };

/** Customer directory with search, status filter and pagination. */
export function Customers() {
  const { user } = useAuth();
  const isPhotographer = user?.role === 'PHOTOGRAPHER';
  const unfinishedClients = useQuery({
    queryKey: ['studio-services', 'unfinished'],
    queryFn: async () => (await axiosInstance.get<UnfinishedClient[]>('/studio-services/unfinished')).data,
    enabled: isPhotographer,
    refetchInterval: 15_000,
  });
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

  const customers = useCustomers(query, !isPhotographer);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: customers.data?.meta.total ?? 0,
  });

  const rows: Customer[] = customers.data?.data ?? [];

  if (isPhotographer) {
    return <>
      <PageHeader title="Clients in progress" subtitle="Only clients whose studio service is not complete." actions={<Link to="/customers/new" className="ak-button ak-button--primary"><PlusIcon size={18} />New client</Link>} />
      <div className="ak-card">
        {unfinishedClients.error && <div className="ak-card__body"><ErrorMessage error={unfinishedClients.error} onRetry={() => void unfinishedClients.refetch()} /></div>}
        {unfinishedClients.isLoading ? <LoadingBlock message="Loading clients in progress…" /> : <div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Client</th><th>Phone</th><th>Service date</th><th>Photos taken</th><th>Status</th></tr></thead><tbody>{(unfinishedClients.data ?? []).map((client) => <tr key={client.id}><td className="ak-strong">{client.customerName}</td><td>{client.phoneNumber}</td><td>{client.serviceDate}</td><td>{client.photosTaken}</td><td><Badge tone="warning">In progress</Badge></td></tr>)}</tbody></table>{!unfinishedClients.data?.length && <p className="ak-card__body ak-subtle">There are no unfinished client services.</p>}</div>}
      </div>
    </>;
  }

  return (
    <>
      <PageHeader
        title="Customers"
        subtitle="People and companies the studio books work for."
        actions={
          canRegisterCustomers(user?.role) && (
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
                  canRegisterCustomers(user?.role) && (
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
