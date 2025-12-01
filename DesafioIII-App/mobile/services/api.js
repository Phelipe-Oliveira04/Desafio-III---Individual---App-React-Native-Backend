
import axios from 'axios';

// Substitute YOUR_BACKEND_IP with your backend machine IP or use http://localhost:3000 if using emulator
const api = axios.create({
  baseURL: 'http://SEU_IP_AQUI:3000'
});

export default api;
