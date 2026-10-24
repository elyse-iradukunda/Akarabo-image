import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { BookingForm } from '../forms/BookingForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useActiveCustomers } from '../hooks';
import { canManageBookings } from '../util/permissions';
import { useAuth } from '../context/AuthContext';

/** Screen that creates a new booking. */
export function NewBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const customers = useActiveCustomers();

  if (!canManageBookings(user?.role)) {
    return (
      <>
        <PageHeader title="New booking" />
        <StatusMessage tone="warning">
          Only managers and the owner can create bookings.
        </StatusMessage>
      </>
    );
  }

  if (customers.isLoading) {
    return <LoadingBlock message="Loading customers…" />;
  }

  const activeCustomers = customers.data?.data ?? [];

  return (
    <>
      <PageHeader
        title="New booking"
        subtitle="Reserve the studio for a customer."
        crumbs={[{ label: 'Bookings', to: '/bookings' }, { label: 'New' }]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/bookings')}>
            <ArrowLeftIcon size={18} />
            Cancel
          </Button>
        }
      />

      <div className="ak-card">
        <div className="ak-card__body">
          {activeCustomers.length === 0 ? (
            <StatusMessage tone="warning">
              There is no active customer to book for.{' '}
              <Link to="/customers/new">Register a customer first</Link>.
            </StatusMessage>
          ) : (
            <BookingForm
              customers={activeCustomers.map((customer) => ({
                id: customer.id,
                name: customer.name,
              }))}
              onSuccess={(booking) => navigate(`/bookings/${booking.id}`)}
              onCancel={() => navigate('/bookings')}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NewBooking;
