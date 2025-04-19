import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const createListing = async (listingData, token) => {
  try {
    const response = await api.post('listings', listingData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create listing' };
  }
}

export const getListings = async () => {
  try {
    const response = await api.get('/listings');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch listings' };
  }
};

// Get listing by ID
export const getListingById = async (id) => {
  try {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Failed to fetch listing #${id}` };
  }
};

// Update listing
export const updateListing = async (id, listingData, token) => {
  try {
    const response = await api.put(`/listings/${id}`, listingData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update listing' };
  }
};

// Delete listing
export const deleteListing = async (id, token) => {
  try {
    const response = await api.delete(`/listings/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete listing' };
  }
};
export default api;