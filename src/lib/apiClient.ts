import axios from 'axios';

// Centralized API client configuration
export const getBaseURL = () => {
  // Use environment variable if available
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '').replace('/api', '');
  }
  // Fallback to localhost
  return 'http://localhost:5000';
};

export const getAPIURL = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    // If env already has /api/v1, return as-is
    if (process.env.NEXT_PUBLIC_API_URL.includes('/api/v1')) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    // Otherwise append /api/v1
    return `${getBaseURL()}/api/v1`;
  }
  return 'http://localhost:5000/api/v1';
};

const apiClient = axios.create({
  baseURL: getAPIURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token from localStorage to requests
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('luxygalleria_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
          }
        } catch (err) {
          console.error('Failed to parse user data from localStorage');
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('luxygalleria_user');
        window.location.href = '/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
