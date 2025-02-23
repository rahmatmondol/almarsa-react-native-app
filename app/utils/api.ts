// api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// Define the base URL using an environment variable
const baseURL = process.env.EXPO_PUBLIC_API_URL;

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json', // Default headers
  },
});

// Function to get tokens from SecureStore
const getTokens = async () => {
  const authToken = await SecureStore.getItemAsync('authToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  return { authToken, refreshToken };
};

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const { authToken } = await getTokens();
    if (authToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authToken}`, // Add token to headers
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response.data, // Return only the data from the response
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle token expiration (status 401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the refresh token from SecureStore
        const { refreshToken } = await getTokens();

        // Refresh the token
        const response = await axios.post(`${baseURL}/refresh-token`, {
          refreshToken,
        });

        const { token, newRefreshToken } = response.data;

        // Save the new tokens to SecureStore
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        // Update the headers with the new token
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear tokens and log the user out
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');

        // Return a standardized error
        return Promise.reject({
          message: 'User name or password is incorrect',
          code: 'SESSION_EXPIRED',
        });
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with an error (4xx or 5xx)
      const { status, data } = error.response;
      return Promise.reject({
        message: data.message || 'An error occurred',
        code: data.code || `HTTP_${status}`,
        status,
      });
    } else if (error.request) {
      // No response received (network error)
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    } else {
      // Something went wrong in the request setup
      return Promise.reject({
        message: 'An unexpected error occurred.',
        code: 'UNEXPECTED_ERROR',
      });
    }
  }
);

export default api;