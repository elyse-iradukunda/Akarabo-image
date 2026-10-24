import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { PaymentForm } from '../forms/PaymentForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks';
import { canRecordPayments } from '../util/permissions';

/** Screen that records money received by the studio. */
export function NewPayment() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const bookings = useBookings({ limit: 100 });

  if (!canRecordPayments(user?.role)) {
    return (
      <>
        <PageHeader title="Record payment" />
        <StatusMessage tone="warning">
          Only managers and the owner can manage payments.
        </StatusMessage>
      </>
    );
  }

  if (bookings.isLoading) {
    return <LoadingBlock message="Loading bookings…" />;
  }

  return (
    <>
      <PageHeader
        title="Record payment"
        subtitle="Log money received by the studio."
        crumbs={[{ label: 'Payments', to: '/payments' }, { label: 'New' }]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/payments')}>
            <ArrowLeftIcon size={18} />
            Cancel
          </Button>
        }
      />

      <div className="ak-card ak-finance-form-card">
        <div className="ak-card__body">
          <PaymentForm
            bookings={bookings.data?.data ?? []}
            onSuccess={() => navigate('/payments')}
            onCancel={() => navigate('/payments')}
          />
        </div>
      </div>
    </>
  );
}

export default NewPayment;
