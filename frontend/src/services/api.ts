import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'; // Giá trị mặc định
console.log('VITE_API_BASE_URL:', baseURL); // Log để debug

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json', // Thêm header
  },
});

export default api;