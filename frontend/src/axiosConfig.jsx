import axios from 'axios';

const axiosInstance = axios.create({
baseURL: '/', // local
  //baseURL: 'http://3.26.96.188:5001', // live
headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;