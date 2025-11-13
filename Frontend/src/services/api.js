import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


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


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify'),
};


export const dashboardAPI = {
  getData: (filters = {}) => api.get('/dashboard', { params: filters }),
};


export const purchasesAPI = {
  getAll: (filters = {}) => api.get('/purchases', { params: filters }),
  create: (purchaseData) => api.post('/purchases', purchaseData),
  getOptions: () => api.get('/purchases/options'),
};


export const transfersAPI = {
  getAll: (filters = {}) => api.get('/transfers', { params: filters }),
  create: (transferData) => api.post('/transfers', transferData),
  update: (id, updateData) => api.put(`/transfers/${id}`, updateData),
  getOptions: () => api.get('/transfers/options'),
};


export const assignmentsAPI = {
  getAll: (filters = {}) => api.get('/assignments', { params: filters }),
  create: (assignmentData) => api.post('/assignments', assignmentData),
  update: (id, updateData) => api.put(`/assignments/${id}`, updateData),
  getOptions: () => api.get('/assignments/options'),
};

export default api;