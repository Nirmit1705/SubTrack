import api from './api';

const userService = {
  updateBudget: async (budget) => {
    try {
      const response = await api.put('/users/budget', { budget });
      return response.data;
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  },
  
  getUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
};

export default userService;