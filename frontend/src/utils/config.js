// API Configuration
// This file handles environment-specific API base URLs

const getApiBaseUrl = () => {
  // Check for explicit VITE_API_URL first (for production)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  // Development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:5000'
  }

  // Production mode - if no VITE_API_URL is set, use relative URLs
  // This works when frontend and backend are on same domain
  // For separate deployments (Render + Vercel), VITE_API_URL must be set
  return ''
}

export const config = {
  API_BASE_URL: getApiBaseUrl(),
  API_TIMEOUT: 10000, // 10 seconds
}

export default config

