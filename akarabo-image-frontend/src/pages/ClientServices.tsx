import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { axiosInstance } from '../util/axiosInstance';
import { formatMoney } from '../util/formatters';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import type { PaymentMethod } from '../types/payment';

type Client = { id: string; customerName: string; serviceDate: string; totalAmount: number; paidAmount: number; remainingAmount: number; paymentStatus: string; serviceStatus: 'IN_PROGRESS' | 'SERVED' };
type Task = { id: string; studioServiceId: string; status: string };
type ServiceReport = { clients: Client[]; photographerTasks: Task[] };

export function ClientServices() {
  const queryClient = useQueryClient();
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [methods, setMethods] = useState<Record<string, PaymentMethod>>({});
  const report = useQuery({
    queryKey: ['studio-reports', 'client-services'],
    queryFn: async () => (await axiosInstance.get<ServiceReport>('/studio-reports', { params: { from: '2000-01-01', to: '2099-12-31' } })).data,
    refetchInterval: 15_000,
  });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
    void queryClient.invalidateQueries({ queryKey: ['payments'] });
  };
  const addPayment = useMutation({
    mutationFn: async ({ id, amount, method }: { id: string; amount: number; method: PaymentMethod }) => (await axiosInstance.post('/payments', { studioServiceId: id, amount, currency: 'RWF', method, notes: 'Recorded from client service page' })).data,
    onSuccess: (_data, variables) => { setAmounts((current) => ({ ...current, [variables.id]: '' })); refresh(); },
  });
  const markServed = useMutation({
    mutationFn: async (id: string) => (await axiosInstance.patch(`/studio-services/${id}/status`, { status: 'SERVED' })).data,
    onSuccess: refresh,
  });

  return <>
    <PageHeader title="Client services" subtitle="Record payments and mark photo delivery complete once editing and full payment are complete." />
    {(report.error || addPayment.error || markServed.error) && <div className="ak-mb-4"><ErrorMessage error={addPayment.error ?? markServed.error ?? report.error} onRetry={() => void report.refetch()} /></div>}
    <section className="ak-card"><div className="ak-table-wrap"><table className="ak-table"><thead><tr><th>Client</th><th>Date</th><th>Agreed</th><th>Paid</th><th>Balance</th><th>Editing</th><th>Delivery</th><th>Payment / action</th></tr></thead><tbody>{(report.data?.clients ?? []).map((client) => {
      const tasks = (report.data?.photographerTasks ?? []).filter((task) => task.studioServiceId === client.id);
      const editingComplete = tasks.every((task) => task.status === 'COMPLETED');
      return <tr key={client.id}>
        <td className="ak-strong">{client.customerName}</td><td>{client.serviceDate}</td><td>{formatMoney(client.totalAmount, 'RWF')}</td><td>{formatMoney(client.paidAmount, 'RWF')}</td><td>{formatMoney(client.remainingAmount, 'RWF')}</td>
        <td><Badge tone={editingComplete ? 'success' : 'warning'}>{editingComplete ? 'Complete' : 'In progress'}</Badge></td>
        <td><Badge tone={client.serviceStatus === 'SERVED' ? 'success' : 'warning'}>{client.serviceStatus === 'SERVED' ? 'Served' : 'Not served'}</Badge></td>
        <td>{client.serviceStatus === 'SERVED' ? <span className="ak-small ak-subtle">Complete</span> : <div className="ak-stack ak-gap-2">
          {client.remainingAmount > 0 && <form className="ak-row ak-gap-2 ak-wrap" onSubmit={(event) => { event.preventDefault(); addPayment.mutate({ id: client.id, amount: Number(amounts[client.id] ?? client.remainingAmount), method: methods[client.id] ?? 'CASH' }); }}>
            <input className="ak-input" aria-label={`Payment amount for ${client.customerName}`} type="number" min="0.01" max={client.remainingAmount} step="0.01" value={amounts[client.id] ?? String(client.remainingAmount)} onChange={(event) => setAmounts({ ...amounts, [client.id]: event.target.value })} />
            <select className="ak-select" aria-label={`Payment method for ${client.customerName}`} value={methods[client.id] ?? 'CASH'} onChange={(event) => setMethods({ ...methods, [client.id]: event.target.value as PaymentMethod })}><option value="CASH">Cash</option><option value="MOBILE_MONEY">Mobile money</option><option value="CARD">Card</option><option value="BANK_TRANSFER">Bank transfer</option></select>
            <Button size="sm" type="submit" loading={addPayment.isPending}>Record payment</Button>
          </form>}
          <Button size="sm" disabled={!editingComplete || client.remainingAmount > 0} loading={markServed.isPending} onClick={() => markServed.mutate(client.id)}>{!editingComplete ? 'Waiting for editing' : client.remainingAmount > 0 ? 'Awaiting full payment' : 'Mark served'}</Button>
        </div>}</td>
      </tr>;
    })}</tbody></table>{!report.isLoading && !report.data?.clients.length && <p className="ak-card__body ak-subtle">No client services found.</p>}</div></section>
  </>;
}

export default ClientServices;
