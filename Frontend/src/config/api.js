// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://youmatter-backend-9tfj.onrender.com';
const API_URL = import.meta.env.VITE_API_URL || 'https://youmatter-backend-9tfj.onrender.com/api';

console.log('Environment variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  API_URL
});

// Force production URLs for now
const PRODUCTION_API_BASE_URL = 'https://youmatter-backend-9tfj.onrender.com';
const PRODUCTION_API_URL = 'https://youmatter-backend-9tfj.onrender.com/api';

export const API_BASE_URL_EXPORT = PRODUCTION_API_BASE_URL;
export const API_URL_EXPORT = PRODUCTION_API_URL;

export { 
  API_BASE_URL_EXPORT as API_BASE_URL, 
  API_URL_EXPORT as API_URL 
};