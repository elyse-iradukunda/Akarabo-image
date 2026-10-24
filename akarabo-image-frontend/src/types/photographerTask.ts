export type PhotographerTaskStatus = 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

export interface PhotographerTask {
  id: string;
  studioServiceId: string;
  photographerUserId: string;
  photographerName?: string;
  customerName: string;
  taskDate: string;
  photosToEdit: number;
  editedPhotos?: number;
  status: PhotographerTaskStatus;
  notes?: string;
  readAt?: string;
  completedAt?: string;
}

export interface CompletedPhotographerTask extends PhotographerTask {
  photographerName: string;
}
