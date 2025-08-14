import axios from "axios";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const http = axios.create({
  baseURL: API_BASE,
  // long-ish timeout so free-tier cold-starts can resolve
  timeout: 45000,
});

export default http;
