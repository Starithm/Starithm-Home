// API Configuration
export const API_BASE_URL = 'http://localhost:5004';

// API endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
  alerts: `${API_BASE_URL}/api/alerts`,
  process: `${API_BASE_URL}/api/process`,
} as const;
