import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const submitApplication = (data) => api.post(ENDPOINTS.APPLICATIONS.BASE, data);
export const getApplications = (params) => api.get(ENDPOINTS.APPLICATIONS.BASE, { params });
export const approveApplication = (id) => api.patch(ENDPOINTS.APPLICATIONS.APPROVE(id));
export const rejectApplication = (id, reason) => api.patch(ENDPOINTS.APPLICATIONS.REJECT(id), { reason });
