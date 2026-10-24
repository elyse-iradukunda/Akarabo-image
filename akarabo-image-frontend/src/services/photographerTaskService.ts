import { axiosInstance } from '../util/axiosInstance';
import type { CompletedPhotographerTask, PhotographerTask, PhotographerTaskStatus } from '../types/photographerTask';

export const photographerTaskService = {
  async mine(): Promise<PhotographerTask[]> {
    const { data } = await axiosInstance.get<PhotographerTask[]>('/photographer-tasks/mine');
    return data;
  },
  async completed(): Promise<CompletedPhotographerTask[]> {
    const { data } = await axiosInstance.get<CompletedPhotographerTask[]>('/photographer-tasks/completed');
    return data;
  },
  async markRead(id: string): Promise<PhotographerTask> {
    const { data } = await axiosInstance.patch<PhotographerTask>(`/photographer-tasks/${id}/read`);
    return data;
  },
  async update(id: string, status: PhotographerTaskStatus, editedPhotos?: number): Promise<PhotographerTask> {
    const { data } = await axiosInstance.patch<PhotographerTask>(`/photographer-tasks/${id}/status`, { status, ...(editedPhotos === undefined ? {} : { editedPhotos }) });
    return data;
  },
};
