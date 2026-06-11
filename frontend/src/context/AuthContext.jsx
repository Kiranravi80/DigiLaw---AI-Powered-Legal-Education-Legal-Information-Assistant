import { createContext, useContext, useState, useEffect } from 'react'
import { api, publicApi } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user')
      if (userData) setUser(JSON.parse(userData))
      checkDisclaimer()
    }
    setLoading(false)
  }, [token])

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken(null)
      setUser(null)
      setDisclaimerAccepted(false)
    }

    window.addEventListener('auth:expired', handleAuthExpired)
    return () => window.removeEventListener('auth:expired', handleAuthExpired)
  }, [])

  const checkDisclaimer = async () => {
    try {
      const res = await api.get('/api/disclaimer/check/')
      setDisclaimerAccepted(res.data.accepted)
    } catch (e) {
      setDisclaimerAccepted(false)
    }
  }

  const login = async (email, password) => {
    const res = await publicApi.post('/api/auth/login/', { email, password })
    const { tokens, user: userData, disclaimer_accepted } = res.data
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokens.access)
    setUser(userData)
    setDisclaimerAccepted(disclaimer_accepted)
    return res.data
  }

  const register = async (data) => {
    const res = await publicApi.post('/api/auth/register/', data)
    const { tokens, user: userData } = res.data
    localStorage.setItem('token', tokens.access)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokens.access)
    setUser(userData)
    setDisclaimerAccepted(false)
    return res.data
  }

  const acceptDisclaimer = async () => {
    await api.post('/api/disclaimer/accept/')
    setDisclaimerAccepted(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
