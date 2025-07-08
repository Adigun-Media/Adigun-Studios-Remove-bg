"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const signup = async (userData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUser(userData)
        resolve(userData)
      }, 1000)
    })
  }

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const userData = { username: "User", email }
        setUser(userData)
        resolve(userData)
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    signup,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
