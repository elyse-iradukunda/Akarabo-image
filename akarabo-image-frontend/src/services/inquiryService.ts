import { axiosInstance } from '../util/axiosInstance';
import type { ClientInquiry, CreateInquiryPayload } from '../types/inquiry';

export const inquiryService = {
  async create(payload: CreateInquiryPayload): Promise<ClientInquiry> {
    const { data } = await axiosInstance.post<ClientInquiry>('/inquiries', payload);
    return data;
  },
  async list(): Promise<ClientInquiry[]> {
    const { data } = await axiosInstance.get<ClientInquiry[]>('/inquiries');
    return data;
  },
  async markRead(id: string): Promise<ClientInquiry> {
    const { data } = await axiosInstance.patch<ClientInquiry>(`/inquiries/${id}/read`);
    return data;
  },
};
