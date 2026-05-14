import axios from "axios";



const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:8080/api',
    headers:{'Content-Type' :'application/json'},

})

// tự động thêm token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


export default axiosClient;