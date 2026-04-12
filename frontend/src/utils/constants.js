const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000";
// If backend is on 8000
const wsDomain = API_BASE_URL.replace('http://', '').replace('https://', '');
export const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || `${WS_PROTOCOL}//${wsDomain}`;

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  PREDICT: "/predict/sign",
  TRANSLATE: "/translate/text",
  HISTORY: "/history",
};
