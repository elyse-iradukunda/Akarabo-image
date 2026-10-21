import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { DataTable } from '../components/DataTable';
import { ErrorMessage, errorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { Pagination } from '../components/Pagination';
import { StatusMessage } from '../components/StatusMessage';
import { EmptyState } from '../ui/EmptyState';
import { InputField } from '../ui/InputField';
import { LoadingBlock } from '../ui/LoadingBlock';
import { Modal } from '../ui/Modal';
import { SelectField } from '../ui/SelectField';
import { useAuth } from '../context/AuthContext';
import {
  usePaginationControls,
  usePaginationState,
  useUserStatusActions,
  useUsers,
} from '../hooks';
import {
  toUserView,
  userRoleTone,
  userStatusLabel,
  userStatusTone,
} from '../mappers/userMapper';
import { roleOptions } from '../data/constants';
import { canManageUserAccess, canManageUsers } from '../util/permissions';
import type { Role } from '../types/auth';
import type { User } from '../types/user';

/** Staff accounts of the studio — owners and managers only. */
export function Staff() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState<Role | ''>('');
  const [isActive, setIsActive] = useState<'' | 'true' | 'false'>('');
  const [pendingAction, setPendingAction] = useState<
    { type: 'activate' | 'deactivate'; user: User } | undefined
  >(undefined);
  const [notice, setNotice] = useState<string | undefined>(undefined);

  const pagination = usePaginationState();
  const { activate, deactivate } = useUserStatusActions();

  const query = useMemo(
    () => ({
      page: pagination.page,
      limit: pagination.limit,
      ...(searchTerm ? { search: searchTerm } : {}),
      ...(role ? { role } : {}),
      ...(isActive ? { isActive: isActive === 'true' } : {}),
    }),
    [pagination.page, pagination.limit, searchTerm, role, isActive],
  );

  const staff = useUsers(query);

  const controls = usePaginationControls({
    page: pagination.page,
    limit: pagination.limit,
    total: staff.data?.meta.total ?? 0,
  });

  const rows: User[] = staff.data?.data ?? [];

  const handleAccessChange = async () => {
    if (!pendingAction) return;
    const { type, user: target } = pendingAction;

    try {
      if (type === 'activate') {
        await activate.mutateAsync(target.id);
        setNotice(`${target.fullName} can sign in again.`);
      } else {
        await deactivate.mutateAsync(target.id);
        setNotice(`${target.fullName} can no longer sign in.`);
      }
      setPendingAction(undefined);
    } catch (error) {
      setNotice(errorMessage(error));
      setPendingAction(undefined);
    }
  };

  if (!canManageUsers(user?.role)) {
    return (
      <>
        <PageHeader title="Staff" />
        <StatusMessage tone="warning">
          Only managers and the owner can manage staff accounts.
        </StatusMessage>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Staff"
        subtitle="Everyone with access to the studio system."
        actions={
          <Link to="/staff/new" className="ak-button ak-button--primary">
            <PlusIcon size={18} />
            New staff account
          </Link>
        }
      />

      {notice && (
        <div className="ak-mb-4">
          <StatusMessage tone="info">{notice}</StatusMessage>
        </div>
      )}

      <div className="ak-card">
        <div className="ak-toolbar">
          <form
            className="ak-toolbar__search ak-row ak-gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchTerm(search.trim());
              pagination.reset();
            }}
          >
            <InputField
              aria-label="Search staff"
              placeholder="Search by name, email or phone…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" className="ak-button ak-button--secondary">
              <SearchIcon size={18} />
            </button>
          </form>

          <SelectField
            aria-label="Filter by role"
            placeholder="All roles"
            options={roleOptions}
            value={role}
            onChange={(event) => {
              setRole(event.target.value as Role | '');
              pagination.reset();
            }}
          />

          <SelectField
            aria-label="Filter by status"
            placeholder="All statuses"
            options={[
              { value: 'true', label: 'Active only' },
              { value: 'false', label: 'Deactivated only' },
            ]}
            value={isActive}
            onChange={(event) => {
              setIsActive(event.target.value as '' | 'true' | 'false');
              pagination.reset();
            }}
          />
        </div>

        {staff.error && (
          <div className="ak-mb-4" style={{ padding: '0 1.5rem' }}>
            <ErrorMessage
              error={staff.error}
              onRetry={() => void staff.refetch()}
            />
          </div>
        )}

        {staff.isLoading ? (
          <LoadingBlock message="Loading staff…" />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(member) => member.id}
            empty={
              <EmptyState
                title="No staff found"
                description={
                  searchTerm
                    ? 'No staff account matches that search.'
                    : 'Create the first staff account to give someone access.'
                }
                action={
                  <Link to="/staff/new" className="ak-button ak-button--primary">
                    New staff account
                  </Link>
                }
              />
            }
            columns={[
              {
                key: 'name',
                header: 'Name',
                render: (member) => {
                  const view = toUserView(member);
                  return (
                    <span className="ak-row ak-gap-3">
                      <span className="ak-avatar">{view.displayInitials}</span>
                      <span className="ak-stack">
                        <span className="ak-strong">{view.displayName}</span>
                        <span className="ak-tiny ak-subtle">{view.displayEmail}</span>
                      </span>
                    </span>
                  );
                },
              },
              {
                key: 'role',
                header: 'Role',
                render: (member) => (
                  <Badge tone={userRoleTone(member.role)}>
                    {toUserView(member).displayRole}
                  </Badge>
                ),
              },
              {
                key: 'phone',
                header: 'Phone',
                render: (member) => toUserView(member).displayPhone,
              },
              {
                key: 'lastLogin',
                header: 'Last sign-in',
                render: (member) => toUserView(member).displayLastLogin,
              },
              {
                key: 'status',
                header: 'Status',
                render: (member) => (
                  <Badge tone={userStatusTone(member.isActive)}>
                    {userStatusLabel(member.isActive)}
                  </Badge>
                ),
              },
              {
                key: 'actions',
                header: '',
                align: 'right',
                render: (member) => (
                  <span className="ak-table__actions">
                    <Link
                      to={`/staff/${member.id}/edit`}
                      className="ak-button ak-button--secondary ak-button--sm"
                    >
                      Edit
                    </Link>
                    {canManageUserAccess(user?.role) &&
                      member.id !== user?.id &&
                      (member.isActive ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPendingAction({ type: 'deactivate', user: member })
                          }
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPendingAction({ type: 'activate', user: member })
                          }
                        >
                          Activate
                        </Button>
                      ))}
                  </span>
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

      <Modal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(undefined)}
        title={
          pendingAction?.type === 'deactivate'
            ? 'Deactivate this account?'
            : 'Restore access to this account?'
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPendingAction(undefined)}
              disabled={activate.isPending || deactivate.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={pendingAction?.type === 'deactivate' ? 'danger' : 'primary'}
              loading={activate.isPending || deactivate.isPending}
              onClick={() => void handleAccessChange()}
            >
              {pendingAction?.type === 'deactivate' ? 'Deactivate' : 'Activate'}
            </Button>
          </>
        }
      >
        <p className="ak-small ak-muted">
          {pendingAction?.type === 'deactivate'
            ? `${pendingAction.user.fullName} will no longer be able to sign in. Their bookings and financial history are kept.`
            : `${pendingAction?.user.fullName ?? 'This account'} will be able to sign in again.`}
        </p>
      </Modal>
    </>
  );
}

export default Staff;
