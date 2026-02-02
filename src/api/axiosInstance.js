import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://dummyjson.com/c/c27c-1f5d-4637-8e5c',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here if needed
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
