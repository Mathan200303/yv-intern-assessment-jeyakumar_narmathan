import api from './api';
import { ENDPOINTS } from '../utils/endpoints';

export const login = (data) => api.post(ENDPOINTS.AUTH.LOGIN, data);
export const register = (data) => api.post(ENDPOINTS.AUTH.REGISTER, data);
export const getMe = () => api.get(ENDPOINTS.AUTH.ME);
export const getUsers = () => api.get(ENDPOINTS.AUTH.USERS);
