import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'https://digilaw.onrender.com'

export const api = axios.create({
  baseURL: API_URL,
})

export const publicApi = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    delete config.headers.Authorization
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const detail = error.response?.data?.detail
    const authFailed = status === 401 || (
      status === 403 &&
      ['Invalid token', 'Token expired', 'Authentication credentials were not provided.'].includes(detail)
    )

    if (authFailed) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth:expired'))
    }

    return Promise.reject(error)
  }
)
