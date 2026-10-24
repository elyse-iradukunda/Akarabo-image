import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  LocationIcon,
  MoneyIcon,
  UsersIcon,
} from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { BookingForm } from '../forms/BookingForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { ReasonDialog } from '../ui/ReasonDialog';
import { useAuth } from '../context/AuthContext';
import {
  useActiveCustomers,
  useBooking,
  useBookingActions,
  useUpdateBooking,
} from '../hooks';
import {
  availableBookingActions,
  bookingEventDay,
  bookingStatusLabel,
  bookingStatusTone,
  serviceTypeLabel,
} from '../mappers/bookingMapper';
import { canManageBookings } from '../util/permissions';
import { formatDateTime, formatMoney } from '../util/formatters';

/** Full view of a single booking with its lifecycle actions. */
export function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const booking = useBooking(id);
  const customers = useActiveCustomers();
  const actions = useBookingActions();
  const updateBooking = useUpdateBooking();

  const [editing, setEditing] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [notice, setNotice] = useState<string | undefined>(undefined);

  const record = booking.data;
  const canManage = canManageBookings(user?.role);

  if (booking.isLoading) {
    return <LoadingBlock message="Loading booking…" />;
  }

  if (booking.error || !record) {
    return (
      <>
        <PageHeader title="Booking" />
        <ErrorMessage
          error={booking.error}
          message={booking.error ? undefined : 'This booking does not exist.'}
          onRetry={() => void booking.refetch()}
        />
      </>
    );
  }

  const allowed = availableBookingActions(record.status);
  const customer = customers.data?.data.find((c) => c.id === record.customerId);

  const runAction = async (
    action: 'confirm' | 'complete',
    message: string,
  ) => {
    try {
      if (action === 'confirm') {
        await actions.confirm.mutateAsync(record.id);
      } else {
        await actions.complete.mutateAsync(record.id);
      }
      setNotice(message);
    } catch (error) {
      setNotice(errorMessage(error));
    }
  };

  const handleCancel = async (reason: string) => {
    try {
      await actions.cancel.mutateAsync({ id: record.id, reason });
      setCancelOpen(false);
      setNotice('Booking cancelled. The reason was kept in the audit trail.');
    } catch (error) {
      setNotice(errorMessage(error));
    }
  };

  const handleUpdate = async () => {
    setEditing(false);
    setNotice('Booking updated.');
  };

  return (
    <>
      <PageHeader
        title={`${serviceTypeLabel(record.serviceType)} · ${bookingEventDay(record)}`}
        subtitle={`Created on ${formatDateTime(record.createdAt)}`}
        crumbs={[
          { label: 'Bookings', to: '/bookings' },
          { label: record.venue },
        ]}
        actions={
          <>
            <Link
              to="/bookings"
              className="ak-button ak-button--secondary"
            >
              <ArrowLeftIcon size={18} />
              Back
            </Link>
            {canManage && allowed.canEdit && !editing && (
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
            {canManage && allowed.canConfirm && (
              <Button
                variant="success"
                loading={actions.confirm.isPending}
                icon={<CheckIcon size={18} />}
                onClick={() => void runAction('confirm', 'Booking confirmed.')}
              >
                Confirm
              </Button>
            )}
            {canManage && allowed.canComplete && (
              <Button
                variant="success"
                loading={actions.complete.isPending}
                icon={<CheckIcon size={18} />}
                onClick={() => void runAction('complete', 'Booking completed.')}
              >
                Mark completed
              </Button>
            )}
            {canManage && allowed.canCancel && (
              <Button variant="danger" onClick={() => setCancelOpen(true)}>
                Cancel booking
              </Button>
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
            <h2 className="ak-card__title">Details</h2>
            <Badge tone={bookingStatusTone(record.status)}>
              {bookingStatusLabel(record.status)}
            </Badge>
          </div>
          <div className="ak-card__body">
            <div className="ak-detail-grid">
              <div>
                <p className="ak-detail__label">Event date</p>
                <p className="ak-detail__value">
                  {bookingEventDay(record)}
                  {record.startTime ? ` · ${record.startTime}` : ''}
                </p>
              </div>
              <div>
                <p className="ak-detail__label">Customer</p>
                <p className="ak-detail__value">
                  {customer?.name ?? record.customerId}
                </p>
              </div>
              <div>
                <p className="ak-detail__label">Venue</p>
                <p className="ak-detail__value">{record.venue}</p>
              </div>
              <div>
                <p className="ak-detail__label">Agreed price</p>
                <p className="ak-detail__value">
                  {formatMoney(record.priceAmount, record.priceCurrency)}
                </p>
              </div>
              <div>
                <p className="ak-detail__label">Expected guests</p>
                <p className="ak-detail__value">
                  {record.expectedGuests ?? '—'}
                </p>
              </div>
              <div>
                <p className="ak-detail__label">Service</p>
                <p className="ak-detail__value">
                  {serviceTypeLabel(record.serviceType)}
                </p>
              </div>
              {record.notes && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className="ak-detail__label">Notes</p>
                  <p className="ak-detail__value">{record.notes}</p>
                </div>
              )}
              {record.cancellationReason && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p className="ak-detail__label">Cancellation reason</p>
                  <p className="ak-detail__value">
                    {record.cancellationReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="ak-card">
          <div className="ak-card__header">
            <h2 className="ak-card__title">Timeline</h2>
          </div>
          <div className="ak-card__body ak-stack ak-gap-4">
            <div className="ak-row ak-gap-3">
              <CalendarIcon size={18} />
              <div>
                <p className="ak-small ak-strong">Booked</p>
                <p className="ak-tiny ak-subtle">
                  {formatDateTime(record.createdAt)}
                </p>
              </div>
            </div>

            {record.confirmedAt && (
              <div className="ak-row ak-gap-3">
                <CheckIcon size={18} />
                <div>
                  <p className="ak-small ak-strong">Confirmed</p>
                  <p className="ak-tiny ak-subtle">
                    {formatDateTime(record.confirmedAt)}
                  </p>
                </div>
              </div>
            )}

            {record.completedAt && (
              <div className="ak-row ak-gap-3">
                <CheckIcon size={18} />
                <div>
                  <p className="ak-small ak-strong">Completed</p>
                  <p className="ak-tiny ak-subtle">
                    {formatDateTime(record.completedAt)}
                  </p>
                </div>
              </div>
            )}

            {record.cancelledAt && (
              <div className="ak-row ak-gap-3">
                <UsersIcon size={18} />
                <div>
                  <p className="ak-small ak-strong">Cancelled</p>
                  <p className="ak-tiny ak-subtle">
                    {formatDateTime(record.cancelledAt)}
                  </p>
                </div>
              </div>
            )}

            <div className="ak-row ak-gap-3">
              <LocationIcon size={18} />
              <div>
                <p className="ak-small ak-strong">Venue</p>
                <p className="ak-tiny ak-subtle">{record.venue}</p>
              </div>
            </div>

            <div className="ak-row ak-gap-3">
              <MoneyIcon size={18} />
              <div>
                <p className="ak-small ak-strong">Package price</p>
                <p className="ak-tiny ak-subtle">
                  {formatMoney(record.priceAmount, record.priceCurrency)}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {editing && (
        <section className="ak-card ak-mt-5">
          <div className="ak-card__header">
            <h2 className="ak-card__title">Edit booking</h2>
          </div>
          <div className="ak-card__body">
            <BookingForm
              booking={record}
              customers={(customers.data?.data ?? []).map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              onSuccess={() => void handleUpdate()}
              onCancel={() => setEditing(false)}
            />
            {updateBooking.error && (
              <div className="ak-mt-3">
                <ErrorMessage error={updateBooking.error} />
              </div>
            )}
          </div>
        </section>
      )}

      <ReasonDialog
        open={cancelOpen}
        title="Cancel this booking?"
        description="Bookings are never deleted. The booking becomes CANCELLED and the reason below is kept forever."
        confirmLabel="Cancel booking"
        isSubmitting={actions.cancel.isPending}
        onCancel={() => setCancelOpen(false)}
        onConfirm={(reason) => void handleCancel(reason)}
      />

      <div className="ak-mt-5">
        <Button variant="ghost" onClick={() => navigate('/bookings')}>
          <ArrowLeftIcon size={18} />
          Back to bookings
        </Button>
      </div>
    </>
  );
}

export default BookingDetails;
