import axios from 'axios';

const publicApi = axios.create({
  baseURL: 'https://pintek-rest-production.up.railway.app',
});

export default publicApi;
