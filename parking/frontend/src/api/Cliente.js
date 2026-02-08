import axios from "axios";

const BACKEND = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
    baseURL : BACKEND,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); // esto es la "cookie" estamos inicializando el token que se va a crear cuando se registre el usuario