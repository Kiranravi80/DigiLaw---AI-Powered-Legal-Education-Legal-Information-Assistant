import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const ThemeContext = createContext()
export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('system')
  const [fontSize, setFontSize] = useState('medium')

  useEffect(() => {
    loadSettings()
  }, [])

  useEffect(() => {
    applyTheme()
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg')
    if (fontSize === 'small') document.documentElement.classList.add('text-sm')
    else if (fontSize === 'large') document.documentElement.classList.add('text-lg')
    else document.documentElement.classList.add('text-base')
  }, [fontSize])

  const loadSettings = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      const saved = localStorage.getItem('theme') || 'system'
      setTheme(saved)
      return
    }
    try {
      const res = await api.get('/api/settings/')
      setTheme(res.data.theme)
      setFontSize(res.data.font_size)
    } catch {}
  }

  const applyTheme = () => {
    const root = document.documentElement
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }

  const updateTheme = async (newTheme) => {
    setTheme(newTheme)
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.put('/api/settings/', { theme: newTheme, font_size: fontSize })
      } catch {}
    }
  }

  const updateFontSize = async (size) => {
    setFontSize(size)
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await api.put('/api/settings/', { theme, font_size: size })
      } catch {}
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, fontSize, updateTheme, updateFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
}
