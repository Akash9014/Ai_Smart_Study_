import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL || "https://ai-smart-study-server.onrender.com";

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

// Interceptor: runs before every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers["x-auth-token"] = token;
  }
  return req;
});

export default API;
