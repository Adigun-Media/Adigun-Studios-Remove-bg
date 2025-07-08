"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [circles, setCircles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([])

  useEffect(() => {
    // Generate random circles
    const newCircles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 40,
      delay: Math.random() * 2,
    }))
    setCircles(newCircles)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#64b5f6] flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Circles */}
      {circles.map((circle) => (
        <div
          key={circle.id}
          className="absolute rounded-full bg-white/20 animate-pulse"
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            animationDelay: `${circle.delay}s`,
            animationDuration: "3s",
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">Remove Background</h1>
        <div className="w-16 h-1 bg-white/50 mx-auto animate-pulse"></div>
      </div>

      {/* Brand */}
      <div className="absolute bottom-12 text-center">
        <p className="text-white text-lg font-light tracking-wide">Adigun Studios</p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}
