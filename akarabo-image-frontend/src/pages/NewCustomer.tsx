import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../forms/CustomerForm';
import { useAuth } from '../context/AuthContext';
import { canRegisterCustomers } from '../util/permissions';
import { StatusMessage } from '../components/StatusMessage';

/** Screen that registers a new customer. */
export function NewCustomer() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canRegisterCustomers(user?.role)) {
    return (
      <>
        <PageHeader title="New customer" />
        <StatusMessage tone="warning">
          Photographers, cashiers, managers, and the owner can register customers.
        </StatusMessage>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="New customer"
        subtitle="Register a person or company the studio books work for."
        crumbs={[{ label: 'Customers', to: '/customers' }, { label: 'New' }]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/customers')}>
            <ArrowLeftIcon size={18} />
            Cancel
          </Button>
        }
      />

      <div className="ak-card">
        <div className="ak-card__body">
          <CustomerForm
            onSuccess={(customer) => navigate(user?.role === 'PHOTOGRAPHER' ? '/customers' : `/customers/${customer.id}`)}
            onCancel={() => navigate('/customers')}
          />
        </div>
      </div>
    </>
  );
}

export default NewCustomer;
