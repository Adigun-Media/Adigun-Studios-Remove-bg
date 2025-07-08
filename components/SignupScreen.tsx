"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

interface SignupScreenProps {
  onNavigate: (screen: string) => void
}

export default function SignupScreen({ onNavigate }: SignupScreenProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (!formData.username) newErrors.push("Username is required")
    if (!formData.email) newErrors.push("Email is required")
    if (!formData.phone) newErrors.push("Phone number is required")
    if (!formData.password) newErrors.push("Password is required")
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Passwords do not match")
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await signup(formData)
      onNavigate("dashboard")
    } catch (error) {
      setErrors(["Failed to create account"])
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#64b5f6] mb-2">Create Account</h1>
          <p className="text-gray-500">Join Adigun Studios today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:border-[#64b5f6] bg-gray-50"
            />
          </div>

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">
                  {error}
                </p>
              ))}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#64b5f6] text-white py-3 rounded-lg font-semibold hover:bg-[#5ba3e4] transition-colors"
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => onNavigate("login")}
            className="w-full text-[#64b5f6] py-3 hover:text-[#5ba3e4] transition-colors"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  )
}
