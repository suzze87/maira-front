import axios from 'axios';

const api = axios.create({
  baseURL: "https://test-api-vercel-deploy.vercel.app/api"    
 /*   baseURL: "http://localhost:4000/api"  */  
});

export default api;