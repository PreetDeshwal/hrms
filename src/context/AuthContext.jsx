import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.find(u => u.email === userData.email)) {
        throw new Error('User already exists')
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        isAdmin: false
      }

      // Save user to localStorage
      users.push({ ...newUser, password: userData.password })
      localStorage.setItem('users', JSON.stringify(users))

      // Set current user
      setUser(newUser)
      localStorage.setItem('user', JSON.stringify(newUser))

      toast.success('Registration successful!')
      return { user: newUser }
    } catch (error) {
      const message = error.message || 'Registration failed'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Check credentials
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      )

      if (!user) {
        throw new Error('Invalid email or password')
      }

      // Remove password from user object
      const { password, ...userWithoutPassword } = user

      // Set current user
      setUser(userWithoutPassword)
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))

      toast.success('Login successful!')
      return { user: userWithoutPassword }
    } catch (error) {
      const message = error.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
    toast.info('Logged out successfully')
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}