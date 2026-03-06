import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
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
    (response) => {
        return response;
    },
    (error) => {
        if (!error.response) {
            // Network error or request was cancelled
            console.error('Network Error or Request Cancelled:', error.message);
            return Promise.reject(new Error('Network Error or Request Cancelled. Please check your internet connection.'));
        }

        const { status, data } = error.response;

        if (status === 401) {
            // Unauthorized - token might be expired or invalid
            localStorage.removeItem('authToken');
            // The router guard in src/routes/index.ts will handle redirection to /login
            console.error('Unauthorized:', data.message || 'Session expired. Please log in again.');
            return Promise.reject(new Error(data.message || 'Session expired. Please log in again.'));
        }

        if (status === 422) {
            // Validation errors
            // The component making the API call is expected to handle specific field errors from `data.errors`.
            console.warn('Validation Error:', data.errors);
            return Promise.reject(error); // Re-reject original error for component to parse `data.errors`
        }

        if (status >= 500) {
            // Server error
            const errorMessage = data.message || 'An unexpected server error occurred. Please try again later.';
            console.error('Server Error:', errorMessage);
            return Promise.reject(new Error(errorMessage));
        }

        // For other client errors (4xx not handled above) or unexpected errors
        const clientErrorMessage = data.message || `An error occurred (Status: ${status}). Please try again.`;
        console.error('API Error:', clientErrorMessage);
        return Promise.reject(new Error(clientErrorMessage));
    }
);

// Example API functions
export const authApi = {
    login: (credentials: any) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    me: () => api.get('/me'),
};

export const projectApi = {
    getProjects: (params?: any) => api.get('/projects', { params }),
    createProject: (data: any) => api.post('/projects', data),
    getProject: (slug: string) => api.get(`/projects/${slug}`),
    updateProject: (slug: string, data: any) => api.put(`/projects/${slug}`, data),
};

export const taskApi = {
    getTasks: (params?: any) => api.get('/tasks', { params }),
    createTask: (data: any) => api.post('/tasks', data),
    getTask: (id: number) => api.get(`/tasks/${id}`),
    updateTask: (id: number, data: any) => api.put(`/tasks/${id}`, data),
    deleteTask: (id: number) => api.delete(`/tasks/${id}`),
    getProjectTasks: (projectId: number, params?: any) => api.get(`/projects/${projectId}/tasks`, { params }),
};

export const dashboardApi = {
    getDashboardStats: () => api.get('/dashboard'),
};

export const categoryApi = {
    getCategories: () => api.get('/categories'),
};

export default api;
