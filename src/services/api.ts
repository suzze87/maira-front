import axios from 'axios';

const api = axios.create({
    baseURL: "https://test-api-vercel-deploy.vercel.app/api" //your api URL,
    
});

export default api;