export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    USERS: '/auth/users'
  },
  APPLICATIONS: {
    BASE: '/applications',
    APPROVE: (id) => `/applications/${id}/approve`,
    REJECT: (id) => `/applications/${id}/reject`
  },
  ROLES: {
    BASE: '/officer-roles',
    ASSIGN: (id) => `/officer-roles/${id}/assign`,
    PERMISSIONS: (id) => `/officer-roles/${id}/permissions`
  },
  PERMISSIONS: '/permissions',
  MEMBERS: '/members',
  MEMBERSHIP_TYPES: '/membership-types',
  AUDIT_LOGS: '/audit-logs'
};
