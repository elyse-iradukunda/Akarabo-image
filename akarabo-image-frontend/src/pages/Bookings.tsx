import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import { SelectField } from '../ui/SelectField';
import { DateField } from '../ui/DateField';
import { useAuth } from '../context/AuthContext';
import {
  useBookings,
  useCustomers,
  usePaginationControls,
  usePaginationState,
} from '../hooks';
import {
  bookingEventDay,
  bookingStatusLabel,
  bookingStatusTone,
  serviceTypeLabel,
  toBookingView,
} from '../mappers/bookingMapper';
import { bookingStatusOptions, serviceTypeOptions } from '../data/constants';
import { canManageBookings } from '../util/permissions';
import { formatMoney } from '../util/formatters';
import type { Booking, BookingServiceType, BookingStatus } from '../types/booking';

/** Booking list with filters, pagination and quick actions. */
export function Bookings() {
  const { user } = useAuth();
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [serviceType, setServiceType] = useState<BookingServiceType | ''>('');
  const [eventFrom, setEventFrom] = useState('');
  const [eventTo, setEventTo] = useState('');

  const pagination = usePaginationState();
  const customers = useCustomers({ limit: 100 });

  const query = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(status ? { status } : {}),
      ...(serviceType ? { serviceType } : {}),
      ...(eventFrom ? { eventFrom } : {}),
      ...(eventTo ? { eventTo } : {}),
    }),
    [
      pagination.page,
      pagination.limit,
      status,
      serviceType,
      eventFrom,
      eventTo,
    ],
  );

  const bookings = useBookings(query);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: bookings.data?.meta.total ?? 0,
  });

  const rows: Booking[] = bookings.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Bookings"
        subtitle="Every reservation the studio has made — never deleted, only cancelled."
        actions={
          canManageBookings(user?.role) && (
            <Link to="/bookings/new" className="ak-button ak-button--primary">
              <PlusIcon size={18} />
              New booking
            </Link>
          )
        }
      />

      <div className="ak-card">
        <div className="ak-toolbar">
          <SelectField
            aria-label="Filter by status"
            placeholder="All statuses"
            options={bookingStatusOptions}
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as BookingStatus | '');
              pagination.reset();
            }}
          />
          <SelectField
            aria-label="Filter by service type"
            placeholder="All services"
            options={serviceTypeOptions}
            value={serviceType}
            onChange={(event) => {
              setServiceType(event.target.value as BookingServiceType | '');
              pagination.reset();
            }}
          />
          <DateField
            aria-label="Events from"
            value={eventFrom}
            onChange={(event) => {
              setEventFrom(event.target.value);
              pagination.reset();
            }}
          />
          <DateField
            aria-label="Events to"
            value={eventTo}
            onChange={(event) => {
              setEventTo(event.target.value);
              pagination.reset();
            }}
          />
        </div>

        {bookings.error && (
          <div className="ak-mb-4" style={{ padding: '0 1.5rem' }}>
            <ErrorMessage
              error={bookings.error}
              onRetry={() => void bookings.refetch()}
            />
          </div>
        )}

        {bookings.isLoading ? (
          <LoadingBlock message="Loading bookings…" />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(booking) => booking.id}
            empty={
              <EmptyState
                title="No bookings match these filters"
                description="Try clearing the filters or create a new booking."
                action={
                  canManageBookings(user?.role) && (
                    <Link
                      to="/bookings/new"
                      className="ak-button ak-button--primary"
                    >
                      New booking
                    </Link>
                  )
                }
              />
            }
            columns={[
              {
                key: 'eventDate',
                header: 'Event date',
                render: (booking) => (
                  <span className="ak-strong">
                    {bookingEventDay(booking)}
                  </span>
                ),
              },
              {
                key: 'customer',
                header: 'Customer',
                render: (booking) => {
                  const view = toBookingView(booking, customers.data?.data ?? []);
                  return (
                    <span className="ak-stack">
                      <span className="ak-strong">{view.customerName}</span>
                      <span className="ak-tiny ak-subtle">
                        {view.customerPhone ?? '—'}
                      </span>
                    </span>
                  );
                },
              },
              {
                key: 'serviceType',
                header: 'Service',
                render: (booking) => serviceTypeLabel(booking.serviceType),
              },
              {
                key: 'venue',
                header: 'Venue',
                render: (booking) => (
                  <span className="ak-truncate">{booking.venue}</span>
                ),
              },
              {
                key: 'price',
                header: 'Price',
                align: 'right',
                render: (booking) =>
                  formatMoney(booking.priceAmount, booking.priceCurrency),
              },
              {
                key: 'status',
                header: 'Status',
                render: (booking) => (
                  <Badge tone={bookingStatusTone(booking.status)}>
                    {bookingStatusLabel(booking.status)}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (booking) => (
                  <Link
                    to={`/bookings/${booking.id}`}
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

export default Bookings;
