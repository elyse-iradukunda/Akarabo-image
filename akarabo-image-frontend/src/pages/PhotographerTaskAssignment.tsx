import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { PageHeader } from '../components/PageHeader';
import { axiosInstance } from '../util/axiosInstance';
import { todayIso } from '../util/formatters';

type Client = { id: string; customerName: string; photosTaken: number; serviceStatus: string };
type Report = { clients: Client[] };
type StaffPicker = { id: string; fullName: string }[];

export function PhotographerTaskAssignment() {
  const queryClient = useQueryClient();
  const [assignment, setAssignment] = useState({ studioServiceId: '', photographerUserId: '', taskDate: todayIso(), photosToEdit: '', notes: '' });
  const bounds = useMemo(() => ({ from: '2000-01-01', to: '2099-12-31' }), []);
  const clients = useQuery({ queryKey: ['studio-reports', 'task-client-picker'], queryFn: async () => (await axiosInstance.get<Report>('/studio-reports', { params: bounds })).data.clients });
  const photographers = useQuery({ queryKey: ['photographers'], queryFn: async () => (await axiosInstance.get<StaffPicker>('/photographers')).data });
  const createTask = useMutation({
    mutationFn: async () => (await axiosInstance.post('/photographer-tasks', { ...assignment, photosToEdit: Number(assignment.photosToEdit) })).data,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio-reports'] });
      void queryClient.invalidateQueries({ queryKey: ['photographer-tasks', 'mine'] });
      setAssignment((current) => ({ ...current, studioServiceId: '', photographerUserId: '', photosToEdit: '', notes: '' }));
    },
  });

  return <>
    <PageHeader title="Assign editing task" subtitle="Create an assignment for a photographer. Their in-app inbox updates automatically." actions={<Link className="ak-button ak-button--secondary" to="/reports/studio">View studio report</Link>} />
    {(clients.error || photographers.error || createTask.error) && <div className="ak-mb-4"><ErrorMessage error={createTask.error ?? clients.error ?? photographers.error} /></div>}
    <section className="ak-card"><div className="ak-card__header"><h2 className="ak-card__title">Photographer assignment</h2></div><div className="ak-card__body">
      <form className="ak-form__grid" onSubmit={(event) => { event.preventDefault(); createTask.mutate(); }}>
        <label className="ak-field"><span className="ak-field__label">Client visit</span><select className="ak-select" required value={assignment.studioServiceId} onChange={(event) => setAssignment({ ...assignment, studioServiceId: event.target.value })}><option value="">Choose an in-progress client</option>{(clients.data ?? []).filter((client) => client.serviceStatus !== 'SERVED').map((client) => <option key={client.id} value={client.id}>{client.customerName} · {client.photosTaken} photos</option>)}</select></label>
        <label className="ak-field"><span className="ak-field__label">Assign photographer</span><select className="ak-select" required value={assignment.photographerUserId} onChange={(event) => setAssignment({ ...assignment, photographerUserId: event.target.value })}><option value="">Choose photographer</option>{(photographers.data ?? []).map((photographer) => <option key={photographer.id} value={photographer.id}>{photographer.fullName}</option>)}</select></label>
        <label className="ak-field"><span className="ak-field__label">Work date</span><input className="ak-input" type="date" required value={assignment.taskDate} onChange={(event) => setAssignment({ ...assignment, taskDate: event.target.value })} /></label>
        <label className="ak-field"><span className="ak-field__label">Photos to edit</span><input className="ak-input" type="number" min="1" required value={assignment.photosToEdit} onChange={(event) => setAssignment({ ...assignment, photosToEdit: event.target.value })} /></label>
        <label className="ak-field"><span className="ak-field__label">Task notes</span><input className="ak-input" maxLength={500} value={assignment.notes} onChange={(event) => setAssignment({ ...assignment, notes: event.target.value })} /></label>
        <Button type="submit" loading={createTask.isPending}>Assign editing task</Button>
      </form>
    </div></section>
  </>;
}

export default PhotographerTaskAssignment;
