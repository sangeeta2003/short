import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add request interceptor to include auth token
axios.interceptors.request.use(
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

export const urlService = {
  shortenUrl: async (originalUrl, customAlias = '', expirationDate = '') => {
    try {
      const response = await axios.post(`${API_URL}/urls/shorten`, {
        originalUrl,
        customAlias,
        expirationDate
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error shortening URL' };
    }
  },

  getMyUrls: async () => {
    try {
      const response = await axios.get(`${API_URL}/urls/my-urls`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching URLs' };
    }
  },

  getUrlAnalytics: async (urlId) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/url/${urlId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching analytics' };
    }
  },

  getUserAnalytics: async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/user`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user analytics' };
    }
  },

  deleteUrl: async (urlId) => {
    try {
      const response = await axios.delete(`${API_URL}/urls/${urlId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting URL' };
    }
  },

  updateUrl: async (urlId, updates) => {
    try {
      const response = await axios.patch(`${API_URL}/urls/${urlId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating URL' };
    }
  },

  redirectToUrl: async (shortCode) => {
    try {
      const response = await axios.get(`${API_URL}/urls/${shortCode}`);
      if (response.data.redirect) {
        window.location.href = response.data.url;
      }
      return response.data;
    } catch (error) {
      console.error('Error redirecting to URL:', error);
      throw error;
    }
  }
}; 