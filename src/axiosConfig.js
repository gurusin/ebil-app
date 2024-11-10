// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: '',
});

instance.interceptors.request.use((config) => {
    var token = localStorage.getItem('token');
    if (token) {
        token = token.replace(/^"(.*)"$/, '$1');
        config.headers.Authorization = `${token}`;
    }
    return config;

});

export default instance;
