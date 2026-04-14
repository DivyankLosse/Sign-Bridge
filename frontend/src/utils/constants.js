const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

export const API_BASE_URL = VITE_API_URL || "http://localhost:8000";

// Ensure we don't have trailing slashes that break path joining
const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
const wsDomain = cleanBaseUrl.replace('http://', '').replace('https://', '');

export const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || `${WS_PROTOCOL}//${wsDomain}`;

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",
  ME: "/auth/me",
  PREDICT: "/asl/predict",
  TRANSLATE: "/translate/text",
  HISTORY: "/history",
  SUPPORT: "/support",
  USER_STATS: "/user/stats",
};
