export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  PREDICT: "/predict/sign",
  TRANSLATE: "/translate/text",
  HISTORY: "/history",
};
