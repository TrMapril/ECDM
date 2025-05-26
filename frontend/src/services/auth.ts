import api from './api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { email, password });
    console.log('Register response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};