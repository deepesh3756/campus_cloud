export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin',
};

export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  EVALUATED: 'evaluated',
  OVERDUE: 'overdue',
};

export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  EVALUATED: 'evaluated',
  LATE: 'late',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    SUBMISSIONS: '/assignments/:id/submissions',
  },
  USERS: {
    PROFILE: '/users/profile',
  },
};

export default {
  USER_ROLES,
  ASSIGNMENT_STATUS,
  SUBMISSION_STATUS,
  API_ENDPOINTS,
};
