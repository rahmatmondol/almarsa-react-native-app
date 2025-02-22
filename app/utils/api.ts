import axios from 'axios';

// In-memory storage for tokens
let authToken = null;
let refreshToken = null;

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // Use environment variable for API URL
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`; // Add token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response.data, // Return only the data from the response
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (status 401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Refresh the token
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/refresh-token`, {
          refreshToken,
        });

        const { token } = response.data;

        // Save the new token in memory
        authToken = token;

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear tokens
        authToken = null;
        refreshToken = null;
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default api;