import api from './api';

const authService = {
  register: async (userData) => {
    try {
      console.log('Registering with data:', userData);
      const response = await api.post('/users/register', userData);
      console.log('Registration API response:', response.data);
      
      if (response.data && response.data.token) {
        // Save auth data to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        localStorage.setItem('isAuthenticated', 'true');
        
        console.log('Auth data saved to localStorage');
      } else {
        console.warn('No token received in registration response');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration API error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  login: async (credentials) => {
    try {
      const response = await api.post('/users/login', credentials);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  },
  
  isAuthenticated: () => {
    const hasToken = !!localStorage.getItem('token');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    console.log('Auth check:', { hasToken, isAuth });
    return hasToken;
  }
};

export default authService;