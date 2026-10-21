import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CameraIcon,
  MoneyIcon,
  ReceiptIcon,
  UsersIcon,
} from '../assets';
import { Badge } from '../components/Badge';
import { DataTable } from '../components/DataTable';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { EmptyState } from '../ui/EmptyState';
import { LoadingBlock } from '../ui/LoadingBlock';
import {
  useBookings,
  useCustomers,
  useExpenses,
  usePayments,
} from '../hooks';
import { useAuth } from '../context/AuthContext';
import {
  bookingEventDay,
  bookingStatusLabel,
  bookingStatusTone,
  serviceTypeLabel,
} from '../mappers/bookingMapper';
import { formatMoney } from '../util/formatters';
import { todayIso } from '../util/formatters';
import { canManageBookings, canRecordPayments } from '../util/permissions';

/** Landing screen: the studio at a glance. */
export function Dashboard() {
  const { user } = useAuth();
  const canSeeMoney = canRecordPayments(user?.role);

  const bookings = useBookings({ limit: 100 });
  const customers = useCustomers({ limit: 100 });
  const payments = usePayments({ limit: 100 }, { enabled: canSeeMoney });
  const expenses = useExpenses({ limit: 100 }, { enabled: canSeeMoney });

  const stats = useMemo(() => {
    const allBookings = bookings.data?.data ?? [];
    const today = todayIso();

    const upcoming = allBookings.filter(
      (booking) => booking.eventDate >= today && booking.status !== 'CANCELLED',
    );
    const pending = allBookings.filter((b) => b.status === 'PENDING');
    const confirmed = allBookings.filter((b) => b.status === 'CONFIRMED');

    const received = (payments.data?.data ?? [])
      .filter((payment) => payment.status === 'COMPLETED')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const spent = (expenses.data?.data ?? [])
      .filter((expense) => expense.status === 'RECORDED')
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      upcoming: upcoming.length,
      pending: pending.length,
      confirmed: confirmed.length,
      customers: customers.data?.meta.total ?? 0,
      received,
      spent,
      balance: received - spent,
      recent: [...allBookings]
        .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
        .slice(0, 6),
    };
  }, [bookings.data, customers.data, payments.data, expenses.data]);

  const isLoading =
    bookings.isLoading || customers.isLoading || payments.isLoading || expenses.isLoading;

  const failure =
    bookings.error ??
    customers.error ??
    (canSeeMoney ? (payments.error ?? expenses.error) : undefined);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user?.fullName?.split(' ')[0] ?? 'there'}`}
        subtitle="Here is what is happening in the studio today."
        actions={
          <>
            <Link
              to="/bookings"
              className="ak-button ak-button--secondary"
            >
              View bookings
            </Link>
            {canManageBookings(user?.role) && (
              <Link to="/bookings/new" className="ak-button ak-button--primary">
                New booking
              </Link>
            )}
          </>
        }
      />

      {failure && (
        <div className="ak-mb-4">
          <ErrorMessage
            error={failure}
            onRetry={() => {
              void bookings.refetch();
              void customers.refetch();
              void payments.refetch();
              void expenses.refetch();
            }}
          />
        </div>
      )}

      <div className="ak-stat-grid">
        <StatCard
          label="Upcoming bookings"
          value={stats.upcoming}
          meta={`${stats.pending} pending · ${stats.confirmed} confirmed`}
          icon={<CameraIcon size={20} />}
        />
        <StatCard
          label="Customers"
          value={stats.customers}
          meta="Registered in the studio"
          icon={<UsersIcon size={20} />}
        />
        {canSeeMoney && (
          <>
            <StatCard
              label="Money received"
              value={formatMoney(stats.received, 'RWF')}
              meta="Completed payments"
              icon={<MoneyIcon size={20} />}
            />
            <StatCard
              label="Money spent"
              value={formatMoney(stats.spent, 'RWF')}
              meta="Recorded expenses"
              icon={<ReceiptIcon size={20} />}
            />
          </>
        )}
      </div>

      <div className="ak-card">
        <div className="ak-card__header">
          <h2 className="ak-card__title">Latest bookings</h2>
          <Link to="/bookings" className="ak-small ak-strong">
            View all
          </Link>
        </div>

        {isLoading ? (
          <LoadingBlock message="Loading bookings…" />
        ) : (
          <DataTable
            rows={stats.recent}
            rowKey={(booking) => booking.id}
            empty={
              <EmptyState
                title="No bookings yet"
                description="Create the first booking to start filling the studio calendar."
                action={
                  <Link to="/bookings/new" className="ak-button ak-button--primary">
                    New booking
                  </Link>
                }
              />
            }
            columns={[
              {
                key: 'eventDate',
                header: 'Event date',
                render: (booking) => (
                  <span className="ak-strong">{bookingEventDay(booking)}</span>
                ),
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
                align: 'right',
                render: (booking) => (
                  <Badge tone={bookingStatusTone(booking.status)}>
                    {bookingStatusLabel(booking.status)}
                  </Badge>
                ),
              },
            ]}
          />
        )}
      </div>
    </>
  );
}

export default Dashboard;
