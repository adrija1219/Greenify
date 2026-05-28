import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('greenify_token') || null)
  const [loading, setLoading] = useState(true)

  // Attach token to every axios request
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      if (!token) { setLoading(false); return }
      try {
        const { data } = await axios.get('/api/auth/profile')
        setUser(data)
      } catch {
        localStorage.removeItem('greenify_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    restore()
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    localStorage.setItem('greenify_token', data.token)
    setToken(data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser({ _id: data._id, name: data.name, email: data.email })
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/register', { name, email, password })
    localStorage.setItem('greenify_token', data.token)
    setToken(data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser({ _id: data._id, name: data.name, email: data.email })
    return data
  }

  const logout = () => {
    localStorage.removeItem('greenify_token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
