import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const getAuditLogs = (params) => api.get(ENDPOINTS.AUDIT_LOGS, { params });
