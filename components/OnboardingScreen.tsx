"use client"

import { useEffect, useState } from "react"

interface OnboardingScreenProps {
  onNavigate: (screen: string) => void
}

export default function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  const [shapes, setShapes] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    // Generate floating shapes
    const newShapes = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 80 + 40,
    }))
    setShapes(newShapes)
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating Shapes */}
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className="absolute rounded-full bg-[#64b5f6]/20 animate-float"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            animationDelay: `${shape.id * 0.5}s`,
            animationDuration: `${4 + shape.id}s`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-gray-600 mb-4">Welcome to</h1>
          <h2 className="text-4xl md:text-5xl font-bold text-[#64b5f6] mb-6">Background Remover</h2>
          <p className="text-gray-500 text-lg max-w-md">Remove backgrounds from your images with ease and precision</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => onNavigate("signup")}
            className="w-full bg-[#64b5f6] text-white py-4 rounded-full text-lg font-semibold hover:bg-[#5ba3e4] transition-colors"
          >
            Get Started
          </button>

          <button
            onClick={() => onNavigate("login")}
            className="w-full text-[#64b5f6] py-4 text-lg hover:text-[#5ba3e4] transition-colors"
          >
            Already have an account?
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-15px) translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
