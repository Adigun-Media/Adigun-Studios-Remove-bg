"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import ColorPicker from "./ColorPicker"
import BackgroundRemover from "./BackgroundRemover"
import ProcessingSettings, { type ProcessingSettings as ProcessingSettingsType } from "./ProcessingSettings"
import ImageEnhancer from "./ImageEnhancer"

interface DashboardScreenProps {
  onNavigate: (screen: string) => void
}

export default function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [hdProcessedImage, setHdProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [unlockCode, setUnlockCode] = useState("")
  const [isHDUnlocked, setIsHDUnlocked] = useState(false)
  const [showUnlockInput, setShowUnlockInput] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showEnhancer, setShowEnhancer] = useState(false)
  const [processingSettings, setProcessingSettings] = useState<ProcessingSettingsType>({
    sensitivity: 35,
    edgeSmoothing: true,
    conservativeMode: true,
  })
  const [triggerProcessing, setTriggerProcessing] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const bgFileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Reset previous states
      setProcessedImage(null)
      setEnhancedImage(null)
      setHdProcessedImage(null)
      setIsProcessing(true)

      // Set the file for BackgroundRemover component
      setSelectedFile(file)

      // Also create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProcessed = (processedImageUrl: string, hdImageUrl?: string) => {
    setProcessedImage(processedImageUrl)
    if (hdImageUrl) {
      setHdProcessedImage(hdImageUrl)
    }
    setIsProcessing(false)
  }

  const handleEnhanced = (enhancedImageUrl: string) => {
    setEnhancedImage(enhancedImageUrl)
    setIsEnhancing(false)
  }

  const handleError = (error: string) => {
    alert(`Error: ${error}`)
    setIsProcessing(false)
    setIsEnhancing(false)
  }

  const handleSettingsChange = (newSettings: ProcessingSettingsType) => {
    setProcessingSettings(newSettings)

    // If we have a processed image, reprocess with new settings
    if (processedImage && selectedFile) {
      setIsProcessing(true)
      setProcessedImage(null)
      setHdProcessedImage(null)
      setTriggerProcessing((prev) => prev + 1)
    }
  }

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setBackgroundImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const checkUnlockCode = () => {
    if (unlockCode.toUpperCase() === "ADIGUN") {
      setIsHDUnlocked(true)
      setShowUnlockInput(false)
      alert("HD Download unlocked! 🎉")
    } else {
      alert("Invalid unlock code. Try again!")
    }
  }

  const downloadImage = (isHD = false) => {
    if (isHD && !isHDUnlocked) {
      setShowUnlockInput(true)
      return
    }

    const imageToDownload = isHD ? hdProcessedImage : enhancedImage || processedImage

    if (!imageToDownload) {
      if (isHD && !hdProcessedImage) {
        alert("HD version is being generated...")
        return
      }
      alert("No processed image to download")
      return
    }

    // Create download link
    const link = document.createElement("a")
    link.href = imageToDownload
    link.download = `adigun-${enhancedImage ? "enhanced-" : ""}bg-removed-${isHD ? "hd-3x-" : ""}${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    const message = isHD ? "HD Image (3x resolution) downloaded! 📱" : "Image downloaded! 📱"
    alert(message)
  }

  const shareImage = async () => {
    const imageToShare = enhancedImage || processedImage
    if (navigator.share && imageToShare) {
      try {
        const response = await fetch(imageToShare)
        const blob = await response.blob()
        const file = new File([blob], "background-removed.png", { type: "image/png" })

        await navigator.share({
          title: "My Background Removed Image",
          text: "Check out my background-removed image from Adigun Studios!",
          files: [file],
        })
      } catch (error) {
        navigator.clipboard.writeText("Check out Adigun Studios Background Remover!")
        alert("Sharing info copied to clipboard! 📋")
      }
    } else {
      navigator.clipboard.writeText("Check out Adigun Studios Background Remover!")
      alert("Sharing info copied to clipboard! 📋")
    }
  }

  const resetApp = () => {
    setSelectedFile(null)
    setSelectedImage(null)
    setProcessedImage(null)
    setEnhancedImage(null)
    setHdProcessedImage(null)
    setBackgroundImage(null)
    setUnlockCode("")
    setIsHDUnlocked(false)
    setShowUnlockInput(false)
    setShowColorPicker(false)
    setShowSettings(false)
    setShowEnhancer(false)
    setIsProcessing(false)
    setIsEnhancing(false)
  }

  const getCurrentDisplayImage = () => {
    return enhancedImage || processedImage || selectedImage
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#64b5f6] text-white px-4 py-6 flex-shrink-0">
        <h1 className="text-xl font-bold text-center mb-1">Remove Background</h1>
        <p className="text-center text-blue-100 text-sm">Welcome back, {user?.username || "User"}!</p>
        <div className="text-center mt-3">
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs">✨ AI-Powered Processing & Enhancement</span>
        </div>
      </div>

      {!selectedImage ? (
        /* Upload Section */
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#64b5f6] rounded-2xl p-8 cursor-pointer hover:border-[#5ba3e4] transition-colors bg-white hover:bg-blue-50 text-center max-w-sm w-full"
          >
            <div className="text-5xl mb-4">📷</div>
            <h2 className="text-lg font-semibold text-[#64b5f6] mb-2">Upload Image</h2>
            <p className="text-gray-500 text-sm">Tap to select an image</p>
            <p className="text-xs text-green-600 mt-2">✅ Free AI processing</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        /* Main Canvas Area with Floating Controls */
        <div className="flex-1 relative bg-white">
          {/* Processing Components */}
          {isProcessing && selectedFile && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <BackgroundRemover
                key={triggerProcessing}
                imageFile={selectedFile}
                onProcessed={handleProcessed}
                onError={handleError}
                settings={processingSettings}
              />
            </div>
          )}

          {isEnhancing && processedImage && (
            <div className="absolute top-4 left-4 right-4 z-20">
              <ImageEnhancer imageUrl={processedImage} onEnhanced={handleEnhanced} onError={handleError} />
            </div>
          )}

          {/* Image Preview Canvas */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <div
                className="relative rounded-lg overflow-hidden shadow-lg border border-gray-200"
                style={{
                  backgroundColor: backgroundImage ? "transparent" : backgroundColor,
                  minWidth: "280px",
                  minHeight: "280px",
                  maxWidth: "90vw",
                  maxHeight: "60vh",
                }}
              >
                {backgroundImage && (
                  <img
                    src={backgroundImage || "/placeholder.svg"}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  {getCurrentDisplayImage() ? (
                    <img
                      src={getCurrentDisplayImage() || "/placeholder.svg"}
                      alt="Preview"
                      className="max-w-full max-h-full object-contain"
                      style={{ filter: isProcessing || isEnhancing ? "opacity(0.7)" : "none" }}
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p>Processing...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Action Buttons */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center justify-center space-x-4 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 bg-[#64b5f6] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#5ba3e4] transition-colors"
                title="Upload New Image"
              >
                📷
              </button>

              {/* Background Button */}
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-600 transition-colors"
                title="Background"
              >
                🎨
              </button>

              {/* Download Button */}
              <button
                onClick={() => downloadImage(false)}
                disabled={!processedImage}
                className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
                title="Download"
              >
                ⬇️
              </button>

              {/* AI Enhance Button */}
              <button
                onClick={() => {
                  if (processedImage && !isEnhancing) {
                    setIsEnhancing(true)
                  }
                }}
                disabled={!processedImage || isEnhancing}
                className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-600 transition-colors disabled:bg-gray-400"
                title="AI Enhance"
              >
                ✨
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-700 transition-colors"
                title="Fine Tune"
              >
                ⚙️
              </button>
            </div>
          </div>

          {/* Secondary Action Row */}
          {(processedImage || enhancedImage) && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex items-center justify-center space-x-3 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200">
                {/* HD Download */}
                <button
                  onClick={() => downloadImage(true)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${
                    isHDUnlocked ? "bg-[#64b5f6] text-white hover:bg-[#5ba3e4]" : "bg-gray-400 text-white"
                  }`}
                >
                  HD {!isHDUnlocked && "🔒"}
                </button>

                {/* Share */}
                <button
                  onClick={shareImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  Share
                </button>

                {/* Reset */}
                <button
                  onClick={resetApp}
                  className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-medium hover:bg-red-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Sliding Panels */}
          {/* Color Picker Panel */}
          {showColorPicker && (
            <div className="absolute bottom-32 left-4 right-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-48 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Background</h4>
                <button onClick={() => setShowColorPicker(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <ColorPicker selectedColor={backgroundColor} onColorSelect={setBackgroundColor} />
              <button
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Upload Background Image
              </button>
              <input
                ref={bgFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundImageUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Settings Panel */}
          {showSettings && (
            <div className="absolute bottom-32 left-4 right-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-h-64 overflow-y-auto">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Fine Tune</h4>
                <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <ProcessingSettings onSettingsChange={handleSettingsChange} />
            </div>
          )}

          {/* HD Unlock Panel */}
          {showUnlockInput && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30 p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">Unlock HD Download</h3>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter unlock code"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#64b5f6]"
                  />
                  <button
                    onClick={checkUnlockCode}
                    className="bg-[#64b5f6] text-white px-4 py-2 rounded-lg hover:bg-[#5ba3e4] transition-colors"
                  >
                    Unlock
                  </button>
                </div>
                <button
                  onClick={() => setShowUnlockInput(false)}
                  className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4 border-t border-gray-200 bg-white flex-shrink-0">
        <p className="text-gray-400 text-sm">Made with ❤️ by Adigun Studios</p>
        <p className="text-xs text-gray-300 mt-1">AI-Powered Background Removal & Enhancement</p>
      </div>
    </div>
  )
}
