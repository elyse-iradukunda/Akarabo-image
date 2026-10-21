import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, MailIcon, PhoneIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { CustomerForm } from '../forms/CustomerForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import {
  useBookings,
  useCustomer,
  useCustomerStatusActions,
} from '../hooks';
import {
  customerStatusLabel,
  customerStatusTone,
} from '../mappers/customerMapper';
import { canManageCustomers } from '../util/permissions';
import { formatDate, formatMoney } from '../util/formatters';
import { bookingEventDay } from '../mappers/bookingMapper';

/** Full view of a single customer, their bookings and quick actions. */
export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const customer = useCustomer(id);
  const bookings = useBookings({ customerId: id, limit: 50 });
  const statusActions = useCustomerStatusActions();

  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | undefined>(undefined);

  const record = customer.data;
  const canManage = canManageCustomers(user?.role);

  if (customer.isLoading) {
    return <LoadingBlock message="Loading customer…" />;
  }

  if (customer.error || !record) {
    return (
      <>
        <PageHeader title="Customer" />
        <ErrorMessage
          error={customer.error}
          message={customer.error ? undefined : 'This customer does not exist.'}
          onRetry={() => void customer.refetch()}
        />
      </>
    );
  }

  const toggleStatus = async () => {
    try {
      if (record.isActive) {
        await statusActions.deactivate.mutateAsync(record.id);
        setNotice('Customer deactivated. They can no longer be booked.');
      } else {
        await statusActions.reactivate.mutateAsync(record.id);
        setNotice('Customer reactivated.');
      }
    } catch (error) {
      setNotice(errorMessage(error));
    }
  };

  const customerBookings = bookings.data?.data ?? [];
  const totalValue = customerBookings.reduce(
    (sum, booking) => sum + booking.priceAmount,
    0,
  );

  return (
    <>
      <PageHeader
        title={record.name}
        subtitle={`Registered on ${formatDate(record.createdAt)}`}
        crumbs={[{ label: 'Customers', to: '/customers' }, { label: record.name }]}
        actions={
          <>
            <Link to="/customers" className="ak-button ak-button--secondary">
              <ArrowLeftIcon size={18} />
              Back
            </Link>
            {canManage && !editing && (
              <>
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant={record.isActive ? 'danger' : 'success'}
                  loading={
                    statusActions.deactivate.isPending ||
                    statusActions.reactivate.isPending
                  }
                  onClick={() => void toggleStatus()}
                >
                  {record.isActive ? 'Deactivate' : 'Reactivate'}
                </Button>
              </>
            )}
          </>
        }
      />

      {notice && (
        <div className="ak-mb-4">
          <StatusMessage tone="info">{notice}</StatusMessage>
        </div>
      )}

      <div className="ak-grid-2">
        <section className="ak-card">
          <div className="ak-card__header">
            <h2 className="ak-card__title">Contact</h2>
            <Badge tone={customerStatusTone(record.isActive)}>
              {customerStatusLabel(record.isActive)}
            </Badge>
          </div>
          <div className="ak-card__body">
            <div className="ak-detail-grid">
              <div>
                <p className="ak-detail__label">Phone</p>
                <p className="ak-detail__value ak-row ak-gap-2">
                  <PhoneIcon size={16} />
                  {record.phone}
                </p>
              </div>
              <div>
                <p className="ak-detail__label">Email</p>
                <p className="ak-detail__value ak-row ak-gap-2">
                  <MailIcon size={16} />
                  {record.email ?? '—'}
                </p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p className="ak-detail__label">Address</p>
                <p className="ak-detail__value">{record.address ?? '—'}</p>
              </div>
              {record.notes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className="ak-detail__label">Notes</p>
                  <p className="ak-detail__value">{record.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="ak-card">
          <div className="ak-card__header">
            <h2 className="ak-card__title">Booking history</h2>
            <span className="ak-small ak-muted">
              {customerBookings.length} bookings ·{' '}
              {formatMoney(totalValue, 'RWF')}
            </span>
          </div>
          <div className="ak-card__body">
            {bookings.isLoading ? (
              <LoadingBlock message="Loading bookings…" />
            ) : customerBookings.length === 0 ? (
              <p className="ak-muted ak-small">
                This customer has no bookings yet.
              </p>
            ) : (
              <ul className="ak-stack ak-gap-3">
                {customerBookings.map((booking) => (
                  <li key={booking.id}>
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="ak-row ak-between ak-gap-3"
                    >
                      <span className="ak-stack">
                        <span className="ak-strong">
                          {bookingEventDay(booking)}
                        </span>
                        <span className="ak-tiny ak-subtle">
                          {booking.venue}
                        </span>
                      </span>
                      <span className="ak-row ak-gap-3">
                        <span className="ak-small">
                          {formatMoney(
                            booking.priceAmount,
                            booking.priceCurrency,
                          )}
                        </span>
                        <Badge
                          tone={
                            booking.status === 'CANCELLED'
                              ? 'danger'
                              : booking.status === 'COMPLETED'
                                ? 'info'
                                : booking.status === 'CONFIRMED'
                                  ? 'success'
                                  : 'warning'
                          }
                        >
                          {booking.status}
                        </Badge>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {editing && (
        <section className="ak-card ak-mt-5">
          <div className="ak-card__header">
            <h2 className="ak-card__title">Edit customer</h2>
          </div>
          <div className="ak-card__body">
            <CustomerForm
              customer={record}
              onSuccess={() => {
                setEditing(false);
                setNotice('Customer updated.');
              }}
              onCancel={() => setEditing(false)}
            />
          </div>
        </section>
      )}

      <div className="ak-mt-5">
        <Button variant="ghost" onClick={() => navigate('/customers')}>
          <ArrowLeftIcon size={18} />
          Back to customers
        </Button>
      </div>
    </>
  );
}

export default CustomerDetails;
