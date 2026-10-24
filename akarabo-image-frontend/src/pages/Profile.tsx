import { Link } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { PageHeader } from '../components/PageHeader';
import { StatusMessage } from '../components/StatusMessage';
import { ProfileForm } from '../forms/ProfileForm';
import { LoadingBlock } from '../ui/LoadingBlock';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../hooks';
import { initials, roleLabel, roleTone } from '../mappers/authMapper';
import { canManageUsers } from '../util/permissions';
import { formatDate, formatDateTime } from '../util/formatters';

/** The signed-in user's own account. */
export function Profile() {
  const { user } = useAuth();
  const canEdit = canManageUsers(user?.role);

  // Owners and managers read the authoritative record from the users API;
  // the other roles only ever see what the session carries.
  const account = useUser(canEdit ? user?.id : undefined);
  const record = account.data ?? user;

  if (!record) {
    return <LoadingBlock message="Loading your profile…" />;
  }

  return (
    <>
      <PageHeader
        title="My profile"
        subtitle="Your account details and how you sign in to the studio."
      />

      <div className="ak-card ak-mb-4">
        <div className="ak-card__body ak-row ak-gap-4 ak-wrap">
          <span
            className="ak-avatar"
            style={{ width: 56, height: 56, fontSize: 'var(--text-lg)' }}
          >
            {initials(record.fullName)}
          </span>
          <div className="ak-stack ak-grow">
            <span className="ak-strong" style={{ fontSize: 'var(--text-lg)' }}>
              {record.fullName}
            </span>
            <span className="ak-small ak-muted">{record.email}</span>
            <span className="ak-row ak-gap-2 ak-mt-2">
              <Badge tone={roleTone(record.role)}>{roleLabel(record.role)}</Badge>
              <Badge tone={record.isActive ? 'success' : 'neutral'}>
                {record.isActive ? 'Active' : 'Deactivated'}
              </Badge>
            </span>
          </div>
        </div>
      </div>

      <div className="ak-card ak-mb-4">
        <div className="ak-card__header">
          <h2 className="ak-card__title">Account details</h2>
        </div>
        <div className="ak-card__body">
          <div className="ak-detail-grid">
            <div>
              <p className="ak-detail__label">Full name</p>
              <p className="ak-detail__value">{record.fullName}</p>
            </div>
            <div>
              <p className="ak-detail__label">Email address</p>
              <p className="ak-detail__value ak-mono">{record.email}</p>
            </div>
            <div>
              <p className="ak-detail__label">Phone number</p>
              <p className="ak-detail__value">{record.phone ?? '—'}</p>
            </div>
            <div>
              <p className="ak-detail__label">Role</p>
              <p className="ak-detail__value">{roleLabel(record.role)}</p>
            </div>
            <div>
              <p className="ak-detail__label">Last sign-in</p>
              <p className="ak-detail__value">
                {record.lastLoginAt ? formatDateTime(record.lastLoginAt) : '—'}
              </p>
            </div>
            <div>
              <p className="ak-detail__label">Member since</p>
              <p className="ak-detail__value">{formatDate(record.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ak-card">
        <div className="ak-card__header">
          <h2 className="ak-card__title">Update my details</h2>
        </div>
        <div className="ak-card__body">
          {canEdit ? (
            <ProfileForm account={record} />
          ) : (
            <StatusMessage tone="info">
              Only managers and the owner can change account details. Ask the
              studio owner to update your contact information — your bookings
              and shoots stay unaffected.
            </StatusMessage>
          )}
        </div>
      </div>

      {canEdit && (
        <p className="ak-small ak-muted ak-mt-4">
          Need a different role?{' '}
          <Link to="/staff">Manage the staff accounts</Link>.
        </p>
      )}
    </>
  );
}

export default Profile;
