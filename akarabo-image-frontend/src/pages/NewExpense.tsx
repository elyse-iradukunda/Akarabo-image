import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useAuth } from '../context/AuthContext';
import { canRecordExpenses } from '../util/permissions';

/** Screen that records studio spending. */
export function NewExpense() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!canRecordExpenses(user?.role)) {
    return (
      <>
        <PageHeader title="Record expense" />
        <StatusMessage tone="warning">
          Only managers and the owner can manage expenses.
        </StatusMessage>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Record expense"
        subtitle="Log what the studio spent."
        crumbs={[{ label: 'Expenses', to: '/expenses' }, { label: 'New' }]}
        actions={
          <Button variant="secondary" onClick={() => navigate('/expenses')}>
            <ArrowLeftIcon size={18} />
            Cancel
          </Button>
        }
      />

      <div className="ak-card ak-finance-form-card">
        <div className="ak-card__body">
          <ExpenseForm
            onSuccess={() => navigate('/expenses')}
            onCancel={() => navigate('/expenses')}
          />
        </div>
      </div>
    </>
  );
}

export default NewExpense;
