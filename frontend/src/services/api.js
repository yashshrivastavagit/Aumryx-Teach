import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  signup: async (userData) => {
    const response = await apiClient.post('/auth/signup', userData);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('aumryx_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token);
      localStorage.setItem('aumryx_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('aumryx_user');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Teacher Service
export const teacherService = {
  getTeachers: async (params = {}) => {
    const response = await apiClient.get('/teachers', { params });
    return response.data;
  },

  getTeacherById: async (teacherId) => {
    const response = await apiClient.get(`/teachers/${teacherId}`);
    return response.data;
  },

  updateTeacher: async (teacherId, updateData) => {
    const response = await apiClient.put(`/teachers/${teacherId}`, updateData);
    return response.data;
  },
};

// Class Service
export const classService = {
  getClasses: async (params = {}) => {
    const response = await apiClient.get('/classes', { params });
    return response.data;
  },

  getClassById: async (classId) => {
    const response = await apiClient.get(`/classes/${classId}`);
    return response.data;
  },

  createClass: async (classData) => {
    const response = await apiClient.post('/classes', classData);
    return response.data;
  },

  updateClass: async (classId, updateData) => {
    const response = await apiClient.put(`/classes/${classId}`, updateData);
    return response.data;
  },

  deleteClass: async (classId) => {
    const response = await apiClient.delete(`/classes/${classId}`);
    return response.data;
  },
};

// Enrollment Service
export const enrollmentService = {
  enrollInClass: async (classId) => {
    const response = await apiClient.post('/enrollments', { class_id: classId });
    return response.data;
  },

  getStudentEnrollments: async (studentId) => {
    const response = await apiClient.get(`/enrollments/student/${studentId}`);
    return response.data;
  },

  getTeacherEnrollments: async (teacherId) => {
    const response = await apiClient.get(`/enrollments/teacher/${teacherId}`);
    return response.data;
  },

  getEnrollmentById: async (enrollmentId) => {
    const response = await apiClient.get(`/enrollments/${enrollmentId}`);
    return response.data;
  },
};

export default {
  auth: authService,
  teachers: teacherService,
  classes: classService,
  enrollments: enrollmentService,
};
