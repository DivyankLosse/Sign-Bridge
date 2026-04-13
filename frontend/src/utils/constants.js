const WS_PROTOCOL = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

// Production safety: If no URL is provided, we should alert the user rather than silently failing to localhost
const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;

if (!VITE_API_URL && import.meta.env.PROD) {
    console.warn("⚠️ [Config] VITE_API_BASE_URL is undefined in production. Falling back to localhost, but this likely won't work on Render/Vercel.");
}

export const API_BASE_URL = VITE_API_URL || "http://localhost:8000";

// Ensure we don't have trailing slashes that break path joining
const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
const wsDomain = cleanBaseUrl.replace('http://', '').replace('https://', '');

export const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || `${WS_PROTOCOL}//${wsDomain}`;

export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
  PREDICT: "/predict/sign",
  TRANSLATE: "/translate/text",
  HISTORY: "/history",
};
