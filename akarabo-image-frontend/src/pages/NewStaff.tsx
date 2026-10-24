import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '../assets';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { UserForm } from '../forms/UserForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks';
import { canManageUsers } from '../util/permissions';
import { ROLES, type Role } from '../types/auth';

/**
 * Screen that creates a staff account and the screen that edits one — the
 * route decides which mode the form runs in.
 */
export function NewStaff() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const staffMember = useUser(id);

  // Only the owner may hand out the owner role.
  const availableRoles = useMemo<Role[]>(() => {
    if (user?.role === 'OWNER') return ROLES;
    const withoutOwner: Role[] = ROLES.filter((role) => role !== 'OWNER');
    if (staffMember.data && !withoutOwner.includes(staffMember.data.role)) {
      return [...withoutOwner, staffMember.data.role];
    }
    return withoutOwner;
  }, [user?.role, staffMember.data]);

  if (!canManageUsers(user?.role)) {
    return (
      <>
        <PageHeader title="Staff account" />
        <StatusMessage tone="warning">
          Only managers and the owner can manage staff accounts.
        </StatusMessage>
      </>
    );
  }

  if (isEditing && staffMember.isLoading) {
    return <LoadingBlock message="Loading staff account…" />;
  }

  if (isEditing && staffMember.error) {
    return (
      <>
        <PageHeader
          title="Staff account"
          crumbs={[{ label: 'Staff', to: '/staff' }, { label: 'Edit' }]}
        />
        <ErrorMessage
          error={staffMember.error}
          onRetry={() => void staffMember.refetch()}
        />
      </>
    );
  }

  const edited = staffMember.data;

  return (
    <>
      <PageHeader
        title={isEditing ? 'Edit staff account' : 'New staff account'}
        subtitle={
          isEditing
            ? 'Update the role, contact details or reset the password.'
            : 'Give someone access to the studio system.'
        }
        crumbs={
          isEditing
            ? [
                { label: 'Staff', to: '/staff' },
                { label: edited?.fullName ?? 'Edit' },
              ]
            : [
                { label: 'Staff', to: '/staff' },
                { label: 'New' },
              ]
        }
        actions={
          <Button variant="secondary" onClick={() => navigate('/staff')}>
            <ArrowLeftIcon size={18} />
            Back to staff
          </Button>
        }
      />

      <div className="ak-card">
        <div className="ak-card__body">
          <UserForm
            user={edited}
            availableRoles={availableRoles}
            onSuccess={() => navigate('/staff')}
            onCancel={() => navigate('/staff')}
          />
        </div>
      </div>
    </>
  );
}

export default NewStaff;
