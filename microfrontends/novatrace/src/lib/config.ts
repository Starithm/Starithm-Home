// API Configuration
export const API_BASE_URL = 'http://localhost:3000';
// import.meta.env.VITE_API_BASE_URL || 
//   (import.meta.env.PROD 
//     ? 'https://novatrace-microservice.onrender.com'
//     : 'http://localhost:3000');

// API endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
  alerts: `${API_BASE_URL}/api/alerts`,
  alertDetails: (id: string) => `${API_BASE_URL}/api/alerts/${id}`,
  process: `${API_BASE_URL}/api/process`,
} as const;
