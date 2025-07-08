"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

interface LoginScreenProps {
  onNavigate: (screen: string) => void
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      await login(email, password)
      onNavigate("dashboard")
    } catch (error) {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#64b5f6] mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#64b5f6] text-white py-3 rounded-lg font-semibold hover:bg-[#5ba3e4] transition-colors"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => onNavigate("signup")}
            className="w-full text-[#64b5f6] py-3 hover:text-[#5ba3e4] transition-colors"
          >
            Don't have an account? Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
