"use client"

import { useState, useEffect } from "react"
import SplashScreen from "../components/SplashScreen"
import OnboardingScreen from "../components/OnboardingScreen"
import LoginScreen from "../components/LoginScreen"
import SignupScreen from "../components/SignupScreen"
import ModeSelectionScreen from "../components/ModeSelectionScreen"
import BackgroundRemovalScreen from "../components/BackgroundRemovalScreen"
import ImageEnhancementScreen from "../components/ImageEnhancementScreen"
import { AuthProvider } from "../context/AuthContext"

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("splash")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate splash screen duration
    const timer = setTimeout(() => {
      setIsLoading(false)
      setCurrentScreen("onboarding")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        {currentScreen === "onboarding" && <OnboardingScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "login" && <LoginScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "signup" && <SignupScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "mode-selection" && <ModeSelectionScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "background-removal" && <BackgroundRemovalScreen onNavigate={setCurrentScreen} />}
        {currentScreen === "image-enhancement" && <ImageEnhancementScreen onNavigate={setCurrentScreen} />}
      </div>
    </AuthProvider>
  )
}
