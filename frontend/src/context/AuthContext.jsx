import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const userData = localStorage.getItem('user')
      if (userData) setUser(JSON.parse(userData))
      checkDisclaimer()
    }
    setLoading(false)
  }, [token])

  const checkDisclaimer = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/disclaimer/check/`)
      setDisclaimerAccepted(res.data.accepted)
    } catch (e) {
      setDisclaimerAccepted(false)
    }
  }

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login/`, { email, password })
    const { tokens, user: userData, disclaimer_accepted } = res.data
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokens.access)
    setUser(userData)
    setDisclaimerAccepted(disclaimer_accepted)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    return res.data
  }

  const register = async (data) => {
    const res = await axios.post(`${API_URL}/api/auth/register/`, data)
    const { tokens, user: userData } = res.data
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokens.access)
    setUser(userData)
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`
    return res.data
  }

  const acceptDisclaimer = async () => {
    await axios.post(`${API_URL}/api/disclaimer/accept/`)
    setDisclaimerAccepted(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    setDisclaimerAccepted(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, token, login, register, logout, 
      loading, disclaimerAccepted, acceptDisclaimer, checkDisclaimer 
    }}>
      {children}
    </AuthContext.Provider>
  )
}