// sercives
import axios from "axios";

export const api = axios.create({
  // baseURL: 'http://localhost:3000/api/v1'
  baseURL: import.meta.env.VITE_BASE_URL
});