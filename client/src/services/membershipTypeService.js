import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const getMembershipTypes = () => api.get(ENDPOINTS.MEMBERSHIP_TYPES);
