"use client"

import { useAuth } from "../context/AuthContext"

interface ModeSelectionScreenProps {
  onNavigate: (screen: string) => void
}

export default function ModeSelectionScreen({ onNavigate }: ModeSelectionScreenProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <h1 className="text-xl font-bold text-gray-800 text-center">Adigun Studios</h1>
        <p className="text-center text-gray-600 text-sm mt-1">Welcome back, {user?.username || "User"}!</p>
      </div>

      {/* Mode Selection */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What would you like to do?</h2>
          <p className="text-gray-600">Choose your preferred AI-powered tool</p>
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Background Removal Option */}
          <div
            onClick={() => onNavigate("background-removal")}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✂️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Remove Background</h3>
              <p className="text-gray-600 text-sm mb-4">
                Instantly remove backgrounds from your photos with AI precision
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-blue-600">
                <span>✨ AI-Powered</span>
                <span>•</span>
                <span>🎯 Precise</span>
                <span>•</span>
                <span>⚡ Fast</span>
              </div>
            </div>
          </div>

          {/* Image Enhancement Option */}
          <div
            onClick={() => onNavigate("image-enhancement")}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Enhance Image</h3>
              <p className="text-gray-600 text-sm mb-4">Transform your photos with professional-grade AI enhancement</p>
              <div className="flex items-center justify-center space-x-2 text-xs text-purple-600">
                <span>🎨 Professional</span>
                <span>•</span>
                <span>📸 HD Quality</span>
                <span>•</span>
                <span>🚀 Remini-Style</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div>
              <div className="font-semibold text-gray-700">1M+</div>
              <div>Images Processed</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">99.9%</div>
              <div>Accuracy</div>
            </div>
            <div>
              <div className="font-semibold text-gray-700">&lt; 3s</div>
              <div>Processing Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
