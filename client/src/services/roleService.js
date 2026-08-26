import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const getRoles = () => api.get(ENDPOINTS.ROLES.BASE);
export const createRole = (data) => api.post(ENDPOINTS.ROLES.BASE, data);
export const updateRolePermissions = (id, permissions) => api.put(ENDPOINTS.ROLES.PERMISSIONS(id), { permissions });
export const assignRole = (userId, roleId) => api.post(ENDPOINTS.ROLES.ASSIGN(userId), { roleId });
export const getPermissions = () => api.get(ENDPOINTS.PERMISSIONS);
