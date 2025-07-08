"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import ReminiStyleEnhancer from "./ReminiStyleEnhancer"

interface ImageEnhancementScreenProps {
  onNavigate: (screen: string) => void
}

export default function ImageEnhancementScreen({ onNavigate }: ImageEnhancementScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancementMode, setEnhancementMode] = useState<"auto" | "portrait" | "landscape" | "old-photo">("auto")
  const [showModePanel, setShowModePanel] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setEnhancedImage(null)
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        // Auto-start enhancement
        setIsEnhancing(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEnhanced = (enhancedImageUrl: string) => {
    setEnhancedImage(enhancedImageUrl)
    setIsEnhancing(false)
  }

  const handleError = (error: string) => {
    alert(`Error: ${error}`)
    setIsEnhancing(false)
  }

  const downloadImage = () => {
    if (!enhancedImage) {
      alert("No enhanced image to download")
      return
    }

    const link = document.createElement("a")
    link.href = enhancedImage
    link.download = `adigun-enhanced-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reprocessWithMode = (mode: "auto" | "portrait" | "landscape" | "old-photo") => {
    setEnhancementMode(mode)
    setEnhancedImage(null)
    setIsEnhancing(true)
    setShowModePanel(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate("mode-selection")} className="text-blue-600 hover:text-blue-700">
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-800">AI Image Enhancer</h1>
        <div className="w-12"></div>
      </div>

      {!selectedImage ? (
        /* Upload Section */
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-purple-300 rounded-2xl p-12 cursor-pointer hover:border-purple-400 transition-colors bg-white hover:bg-purple-50 text-center max-w-sm w-full"
          >
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-xl font-semibold text-purple-600 mb-2">Upload Image</h2>
            <p className="text-gray-500">Transform your photos with AI enhancement</p>
            <div className="mt-4 text-xs text-purple-600 space-y-1">
              <div>• Professional quality enhancement</div>
              <div>• Face restoration & sharpening</div>
              <div>• Color correction & upscaling</div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        /* Main Interface */
        <div className="flex-1 flex flex-col">
          {/* Processing Status */}
          {isEnhancing && selectedFile && (
            <div className="px-4 py-2">
              <ReminiStyleEnhancer
                imageFile={selectedFile}
                mode={enhancementMode}
                onEnhanced={handleEnhanced}
                onError={handleError}
              />
            </div>
          )}

          {/* Image Preview Area */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              {showComparison && selectedImage && enhancedImage ? (
                /* Before/After Comparison */
                <div className="grid grid-cols-2 gap-4 max-w-4xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Before</p>
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-auto rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">After</p>
                    <img
                      src={enhancedImage || "/placeholder.svg"}
                      alt="Enhanced"
                      className="w-full h-auto rounded-lg shadow-md border border-gray-200"
                    />
                  </div>
                </div>
              ) : (
                /* Single Image View */
                <div className="relative">
                  <img
                    src={enhancedImage || selectedImage || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-gray-200"
                    style={{ filter: isEnhancing ? "opacity(0.7)" : "none" }}
                  />
                  {enhancedImage && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Enhanced ✨
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center space-y-1 text-blue-600 hover:text-blue-700"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">📷</span>
                </div>
                <span className="text-xs">Upload</span>
              </button>

              <button
                onClick={() => setShowModePanel(!showModePanel)}
                className="flex flex-col items-center space-y-1 text-purple-600 hover:text-purple-700"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎨</span>
                </div>
                <span className="text-xs">Mode</span>
              </button>

              <button
                onClick={() => setShowComparison(!showComparison)}
                disabled={!enhancedImage}
                className="flex flex-col items-center space-y-1 text-orange-600 hover:text-orange-700 disabled:text-gray-400"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🔄</span>
                </div>
                <span className="text-xs">Compare</span>
              </button>

              <button
                onClick={downloadImage}
                disabled={!enhancedImage}
                className="flex flex-col items-center space-y-1 text-green-600 hover:text-green-700 disabled:text-gray-400"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⬇️</span>
                </div>
                <span className="text-xs">Download</span>
              </button>

              <button
                onClick={() => {
                  if (selectedFile) {
                    setEnhancedImage(null)
                    setIsEnhancing(true)
                  }
                }}
                disabled={!selectedFile || isEnhancing}
                className="flex flex-col items-center space-y-1 text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🔄</span>
                </div>
                <span className="text-xs">Retry</span>
              </button>
            </div>
          </div>

          {/* Enhancement Mode Panel */}
          {showModePanel && (
            <div className="bg-white border-t border-gray-200 p-4 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Enhancement Mode</h3>
                <button onClick={() => setShowModePanel(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => reprocessWithMode("auto")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    enhancementMode === "auto"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">🤖</div>
                  <div className="font-medium">Auto</div>
                  <div className="text-xs text-gray-600">Smart enhancement</div>
                </button>

                <button
                  onClick={() => reprocessWithMode("portrait")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    enhancementMode === "portrait"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-medium">Portrait</div>
                  <div className="text-xs text-gray-600">Face enhancement</div>
                </button>

                <button
                  onClick={() => reprocessWithMode("landscape")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    enhancementMode === "landscape"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">🏞️</div>
                  <div className="font-medium">Landscape</div>
                  <div className="text-xs text-gray-600">Scene enhancement</div>
                </button>

                <button
                  onClick={() => reprocessWithMode("old-photo")}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    enhancementMode === "old-photo"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-medium">Old Photo</div>
                  <div className="text-xs text-gray-600">Restoration</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
