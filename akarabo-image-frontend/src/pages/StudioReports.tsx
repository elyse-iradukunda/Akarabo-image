import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CameraIcon, MoneyIcon, UsersIcon } from '../assets';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../util/axiosInstance';
import { formatMoney, todayIso } from '../util/formatters';
import { photographerTaskService } from '../services/photographerTaskService';

type RangeKey = 'day' | 'week' | 'month';
type ClientRow = { id: string; customerId: string; customerName: string; phoneNumber: string; serviceDate: string; photosTaken: number; softPhotos: number; hardPhotos: number; totalAmount: number; paidAmount: number; remainingAmount: number; paymentStatus: string; serviceStatus: 'IN_PROGRESS' | 'SERVED'; needsUrgentService: boolean };
type Report = {
  summary: { clientCount: number; photosTaken: number; moneyReceived: number };
  clients: ClientRow[];
  servedClients: ClientRow[];
  urgentClients: ClientRow[];
  payments: Array<{ id: string; customerName: string; amount: number; currency: string; method: string; reference?: string; receivedAt: string; receivedBy: string }>;
  photographerTotals: Array<{ photographerUserId: string; photographerName: string; photosAssigned: number; photosEdited: number }>;
  photographerTasks: Array<{ id: string; customerName: string; photographerName: string; taskDate: string; photosToEdit: number; editedPhotos?: number; status: string; notes?: string }>;
};

function dateRange(range: RangeKey) {
  const currentDate = new Date();
  const to = todayIso();
  if (range === 'day') return { from: to, to };
  if (range === 'week') {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - ((currentDate.getDay() + 6) % 7));
    return { from: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`, to };
  }
  return { from: `${to.slice(0, 7)}-01`, to };
}

function ClientTable({ rows, action }: { rows: ClientRow[]; action?: (row: ClientRow) => React.ReactNode }) {
  return <div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Customer</th><th>Phone</th><th>Date</th><th>Photos</th><th>Soft</th><th>Hard</th><th>Paid</th><th>Remaining</th><th>Service</th>{action && <th>Action</th>}</tr></thead><tbody>{rows.map((client) => <tr key={client.id}><td className="ak-strong">{client.customerName}</td><td>{client.phoneNumber}</td><td>{client.serviceDate}</td><td>{client.photosTaken}</td><td>{client.softPhotos}</td><td>{client.hardPhotos}</td><td>{formatMoney(client.paidAmount, 'RWF')}</td><td>{formatMoney(client.remainingAmount, 'RWF')}</td><td><Badge tone={client.serviceStatus === 'SERVED' ? 'success' : 'warning'}>{client.serviceStatus === 'SERVED' ? 'Served' : 'In progress'}</Badge></td>{action && <td>{action(client)}</td>}</tr>)}</tbody></table>{rows.length === 0 && <p className="ak-card__body ak-subtle">No customers in this list for the selected period.</p>}</div>;
}

export function StudioReports() {
  const { user } = useAuth();
  const isPhotographer = user?.role === 'PHOTOGRAPHER';
  const queryClient = useQueryClient();
  const [range, setRange] = useState<RangeKey>('day');
  const [editedPhotos, setEditedPhotos] = useState<Record<string, string>>({});
  const bounds = useMemo(() => dateRange(range), [range]);
  const refreshReport = () => queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
  const report = useQuery({ queryKey: ['studio-reports', bounds.from, bounds.to], queryFn: async () => (await axiosInstance.get<Report>('/studio-reports', { params: bounds })).data, enabled: !isPhotographer, refetchInterval: 15000 });
  const myTasks = useQuery({ queryKey: ['photographer-tasks', 'mine'], queryFn: photographerTaskService.mine, enabled: isPhotographer, refetchInterval: 15000 });
  const updateTask = useMutation({ mutationFn: ({ id, status, photos }: { id: string; status: 'IN_PROGRESS' | 'COMPLETED'; photos?: number }) => photographerTaskService.update(id, status, photos), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['photographer-tasks', 'mine'] }); void refreshReport(); } });

  return <>
    <PageHeader title={isPhotographer ? 'My editing tasks' : 'Studio reports'} subtitle={isPhotographer ? 'Review work assigned to you and record completed photos.' : 'Automatically generated cash receipts, client service, and editing progress.'} actions={!isPhotographer ? <span className="ak-row ak-gap-2"><Link className="ak-button ak-button--secondary" to="/customers/new">Register customer</Link><Link className="ak-button ak-button--primary" to="/tasks/new">Assign editing task</Link></span> : undefined} />

    {isPhotographer ? (
      <section className="ak-card"><div className="ak-card__header"><h2 className="ak-card__title">Daily editing assignments</h2><Badge tone="info">Refreshes every 15 seconds</Badge></div><div className="ak-card__body">
        {myTasks.error && <ErrorMessage error={myTasks.error} onRetry={() => void myTasks.refetch()} />}
        {myTasks.isLoading ? <p className="ak-subtle">Loading your assignments…</p> : myTasks.data?.length ? <div className="ak-stack ak-gap-3">{myTasks.data.map((task) => <article key={task.id} className="ak-card"><div className="ak-card__body ak-stack ak-gap-3"><div className="ak-row ak-between ak-gap-3"><div><h3 className="ak-strong">{task.customerName}</h3><p className="ak-small ak-subtle">{task.taskDate} · {task.photosToEdit} photos assigned</p></div><Badge tone={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'info' : 'warning'}>{task.status.replace('_', ' ')}</Badge></div>{task.notes && <p className="ak-small">{task.notes}</p>}{task.status === 'ASSIGNED' && <Button size="sm" onClick={() => updateTask.mutate({ id: task.id, status: 'IN_PROGRESS' })}>Start task</Button>}{task.status === 'IN_PROGRESS' && <form className="ak-row ak-gap-2 ak-wrap" onSubmit={(event) => { event.preventDefault(); updateTask.mutate({ id: task.id, status: 'COMPLETED', photos: Number(editedPhotos[task.id] ?? task.photosToEdit) }); }}><label className="ak-field"><span className="ak-label">Photos edited</span><input className="ak-input" type="number" min="0" max={task.photosToEdit} required value={editedPhotos[task.id] ?? ''} onChange={(event) => setEditedPhotos({ ...editedPhotos, [task.id]: event.target.value })} /></label><Button size="sm" type="submit" loading={updateTask.isPending}>Complete task</Button></form>}{task.status === 'COMPLETED' && <p className="ak-small ak-success-text" role="status">Completed · {task.editedPhotos ?? 0} photos edited</p>}</div></article>)}</div> : <p className="ak-subtle">No editing tasks have been assigned to you yet.</p>}
      </div></section>
    ) : <>
      {report.error && <div className="ak-mb-4"><ErrorMessage error={report.error} onRetry={() => void report.refetch()} /></div>}
      <div className="ak-toolbar ak-mb-4"><div><h2 className="ak-card__title">Reporting period</h2><p className="ak-small ak-subtle">{bounds.from} through {bounds.to}</p></div><select className="ak-select" aria-label="Report period" value={range} onChange={(event) => setRange(event.target.value as RangeKey)}><option value="day">Today</option><option value="week">This week</option><option value="month">This month</option></select></div>

      <div className="ak-stat-grid">
        <StatCard label="Money received" value={formatMoney(report.data?.summary.moneyReceived ?? 0, 'RWF')} meta="Receipts in selected period" icon={<MoneyIcon size={20} />} />
        <StatCard label="Clients served / in progress" value={report.data?.summary.clientCount ?? 0} meta="Recorded client visits" icon={<UsersIcon size={20} />} />
        <StatCard label="Photos taken" value={report.data?.summary.photosTaken ?? 0} meta="Across all clients" icon={<CameraIcon size={20} />} />
      </div>

      <section className="ak-card ak-mb-6"><div className="ak-card__header"><h2 className="ak-card__title">Clients needing service ASAP</h2><Badge tone="warning">{report.data?.urgentClients.length ?? 0} prioritized</Badge></div><ClientTable rows={report.data?.urgentClients ?? []} /></section>

      <section className="ak-card ak-mb-6"><div className="ak-card__header"><h2 className="ak-card__title">Client service report</h2></div><ClientTable rows={report.data?.clients ?? []} /></section>

      <section className="ak-card ak-mb-6"><div className="ak-card__header"><h2 className="ak-card__title">Served clients and photo delivery</h2></div><ClientTable rows={report.data?.servedClients ?? []} /></section>

      <section className="ak-card ak-mb-6"><div className="ak-card__header"><h2 className="ak-card__title">Money received details</h2><strong className="ak-small">Total: {formatMoney(report.data?.summary.moneyReceived ?? 0, 'RWF')}</strong></div><div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Customer</th><th>Received at</th><th>Received by</th><th>Method</th><th>Reference</th><th>Amount</th></tr></thead><tbody>{(report.data?.payments ?? []).map((receipt) => <tr key={receipt.id}><td>{receipt.customerName}</td><td>{new Date(receipt.receivedAt).toLocaleString()}</td><td>{receipt.receivedBy}</td><td>{receipt.method.replace('_', ' ')}</td><td>{receipt.reference || '—'}</td><td className="ak-strong">{formatMoney(receipt.amount, receipt.currency)}</td></tr>)}</tbody></table>{!report.data?.payments.length && <p className="ak-card__body ak-subtle">No receipts recorded in this period.</p>}</div></section>

      <section className="ak-card ak-mb-6"><div className="ak-card__header"><h2 className="ak-card__title">Edited photos by photographer</h2></div><div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Photographer</th><th>Photos assigned</th><th>Photos edited</th></tr></thead><tbody>{(report.data?.photographerTotals ?? []).map((photographer) => <tr key={photographer.photographerUserId}><td className="ak-strong">{photographer.photographerName}</td><td>{photographer.photosAssigned}</td><td>{photographer.photosEdited}</td></tr>)}</tbody></table>{!report.data?.photographerTotals.length && <p className="ak-card__body ak-subtle">No editing tasks in this period yet.</p>}</div></section>

      <section className="ak-card"><div className="ak-card__header"><h2 className="ak-card__title">Assigned editing tasks</h2></div><div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Client</th><th>Photographer</th><th>Date</th><th>Assigned</th><th>Edited</th><th>Status</th><th>Notes</th></tr></thead><tbody>{(report.data?.photographerTasks ?? []).map((task) => <tr key={task.id}><td>{task.customerName}</td><td>{task.photographerName}</td><td>{task.taskDate}</td><td>{task.photosToEdit}</td><td>{task.editedPhotos ?? '—'}</td><td>{task.status.replace('_', ' ')}</td><td>{task.notes || '—'}</td></tr>)}</tbody></table>{!report.data?.photographerTasks.length && <p className="ak-card__body ak-subtle">No tasks assigned in this period.</p>}</div></section>
    </>}
  </>;
}

export default StudioReports;
