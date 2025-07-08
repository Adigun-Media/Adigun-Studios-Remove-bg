"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  username: string
  email: string
  phone: string
}

interface AuthContextType {
  user: User | null
  signup: (userData: any) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)

  const signup = async (userData: any) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
        })
        resolve()
      }, 1000)
    })
  }

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser({
          username: "User",
          email: email,
          phone: "+1234567890",
        })
        resolve()
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
