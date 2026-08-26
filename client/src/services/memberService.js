import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const getMembers = (params) => api.get(ENDPOINTS.MEMBERS, { params });
