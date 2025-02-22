import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformRequest: [(data, headers) => {
    if (data && typeof data === 'object') {
      const transformedData: { [key: string]: any } = {};
      Object.keys(data).forEach(key => {
        transformedData[key.charAt(0).toUpperCase() + key.slice(1)] = data[key];
      });
      return JSON.stringify(transformedData);
    }
    return data;
  }],
});

// Add response interceptor
api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);

export default api;