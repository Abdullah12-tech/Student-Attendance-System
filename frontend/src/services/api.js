import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

// Classes API
export const classesAPI = {
  getAll: (params) => api.get('/classes', { params }),
  getOne: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  getStudents: (id, params) => api.get(`/classes/${id}/students`, { params }),
};

// Students API
export const studentsAPI = {
  getAll: (params) => api.get('/students', { params }),
  getOne: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  bulkCreate: (data) => api.post('/students/bulk', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  verify: (data) => api.post('/students/verify', data),
};

// Attendance API
export const attendanceAPI = {
  createSession: (data) => api.post('/attendance/sessions', data),
  endSession: (id) => api.put(`/attendance/sessions/${id}/end`),
  getActiveSession: (classId) => api.get(`/attendance/sessions/active/${classId}`),
  getSessionByCode: (code) => api.get(`/attendance/sessions/code/${code}`),
  checkIn: (data) => api.post('/attendance/checkin', data),
  getAttendance: (params) => api.get('/attendance', { params }),
  getStats: (classId, params) => api.get(`/attendance/stats/${classId}`, { params }),
  exportAttendance: (classId, params) => api.get(`/attendance/export/${classId}`, { params }),
  manualMark: (data) => api.post('/attendance/manual', data),
};

// Teacher API
export const teacherAPI = {
  getDashboardStats: () => api.get('/teacher/stats'),
  getRecentAttendance: () => api.get('/teacher/attendance/recent'),
  getClassPerformance: () => api.get('/teacher/classes/performance'),
  getClasses: () => api.get('/teacher/classes'),
  getStudents: (classId) => api.get(`/teacher/classes/${classId}/students`),
  createAttendanceSession: (data) => api.post('/teacher/attendance/sessions', data),
  endAttendanceSession: (sessionId) => api.put(`/teacher/attendance/sessions/${sessionId}/end`),
  getActiveSession: (classId) => api.get(`/teacher/attendance/sessions/active/${classId}`),
  markAttendance: (data) => api.post('/teacher/attendance/mark', data),
  bulkMarkAttendance: (data) => api.post('/teacher/attendance/bulk', data),
  exportAttendance: (classId, params) => api.get(`/teacher/attendance/export/${classId}`, { params }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAttendanceTrends: () => api.get('/admin/attendance/trends'),
  getActiveSchools: () => api.get('/admin/schools/active'),
  getTeachers: (params) => api.get('/admin/teachers', { params }),
  createTeacher: (data) => api.post('/admin/teachers', data),
  updateTeacher: (id, data) => api.put(`/admin/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/admin/teachers/${id}`),
  getSchools: () => api.get('/admin/schools'),
  createSchool: (data) => api.post('/admin/schools', data),
  updateSchool: (id, data) => api.put(`/admin/schools/${id}`, data),
  deleteSchool: (id) => api.delete(`/admin/schools/${id}`),
};
