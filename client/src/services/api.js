import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3001', // عنوان الباكيند
    withCredentials: true // عشان الكوكيز
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // إضافة التوكن في الهيدر بصيغة Bearer
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;