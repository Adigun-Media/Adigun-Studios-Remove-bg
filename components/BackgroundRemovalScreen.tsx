"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import BackgroundRemover from "./BackgroundRemover"
import ProcessingSettings, { type ProcessingSettings as ProcessingSettingsType } from "./ProcessingSettings"
import ColorPicker from "./ColorPicker"

interface BackgroundRemovalScreenProps {
  onNavigate: (screen: string) => void
}

export default function BackgroundRemovalScreen({ onNavigate }: BackgroundRemovalScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [hdProcessedImage, setHdProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [showBottomPanel, setShowBottomPanel] = useState<"none" | "settings" | "background">("none")
  const [unlockCode, setUnlockCode] = useState("")
  const [isHDUnlocked, setIsHDUnlocked] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
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
      setProcessedImage(null)
      setHdProcessedImage(null)
      setIsProcessing(true)
      setSelectedFile(file)

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

  const handleError = (error: string) => {
    alert(`Error: ${error}`)
    setIsProcessing(false)
  }

  const handleSettingsChange = (newSettings: ProcessingSettingsType) => {
    setProcessingSettings(newSettings)
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

  const downloadImage = (isHD = false) => {
    if (isHD && !isHDUnlocked) {
      setShowUnlockModal(true)
      return
    }

    const imageToDownload = isHD ? hdProcessedImage : processedImage
    if (!imageToDownload) {
      alert("No processed image to download")
      return
    }

    const link = document.createElement("a")
    link.href = imageToDownload
    link.download = `adigun-bg-removed-${isHD ? "hd-3x-" : ""}${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const checkUnlockCode = () => {
    if (unlockCode.toUpperCase() === "ADIGUN") {
      setIsHDUnlocked(true)
      setShowUnlockModal(false)
      alert("HD Download unlocked! 🎉")
    } else {
      alert("Invalid unlock code. Try again!")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => onNavigate("mode-selection")} className="text-blue-600 hover:text-blue-700">
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Remove Background</h1>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      {!selectedImage ? (
        /* Upload Section */
        <div className="flex-1 flex items-center justify-center p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-300 rounded-2xl p-12 cursor-pointer hover:border-blue-400 transition-colors bg-white hover:bg-blue-50 text-center max-w-sm w-full"
          >
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Upload Image</h2>
            <p className="text-gray-500">Tap to select an image from your device</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      ) : (
        /* Main Interface */
        <div className="flex-1 flex flex-col">
          {/* Processing Status */}
          {isProcessing && selectedFile && (
            <div className="px-4 py-2">
              <BackgroundRemover
                key={triggerProcessing}
                imageFile={selectedFile}
                onProcessed={handleProcessed}
                onError={handleError}
                settings={processingSettings}
              />
            </div>
          )}

          {/* Image Preview Area */}
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative max-w-full max-h-full">
              <div
                className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white"
                style={{
                  backgroundColor: backgroundImage ? "transparent" : backgroundColor,
                  minWidth: "300px",
                  minHeight: "300px",
                  maxWidth: "90vw",
                  maxHeight: "70vh",
                }}
              >
                {backgroundImage && (
                  <img
                    src={backgroundImage || "/placeholder.svg"}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {processedImage ? (
                    <img
                      src={processedImage || "/placeholder.svg"}
                      alt="Processed"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : selectedImage ? (
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Original"
                      className="max-w-full max-h-full object-contain opacity-70"
                    />
                  ) : null}
                </div>
              </div>
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
                onClick={() => setShowBottomPanel(showBottomPanel === "background" ? "none" : "background")}
                className="flex flex-col items-center space-y-1 text-purple-600 hover:text-purple-700"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎨</span>
                </div>
                <span className="text-xs">Background</span>
              </button>

              <button
                onClick={() => downloadImage(false)}
                disabled={!processedImage}
                className="flex flex-col items-center space-y-1 text-green-600 hover:text-green-700 disabled:text-gray-400"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⬇️</span>
                </div>
                <span className="text-xs">Download</span>
              </button>

              <button
                onClick={() => downloadImage(true)}
                disabled={!processedImage}
                className="flex flex-col items-center space-y-1 text-orange-600 hover:text-orange-700 disabled:text-gray-400"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{isHDUnlocked ? "📱" : "🔒"}</span>
                </div>
                <span className="text-xs">HD</span>
              </button>

              <button
                onClick={() => setShowBottomPanel(showBottomPanel === "settings" ? "none" : "settings")}
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-gray-700"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">⚙️</span>
                </div>
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>

          {/* Bottom Sliding Panels */}
          {showBottomPanel === "background" && (
            <div className="bg-white border-t border-gray-200 p-4 animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Background Options</h3>
                <button onClick={() => setShowBottomPanel("none")} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <ColorPicker selectedColor={backgroundColor} onColorSelect={setBackgroundColor} />
              <button
                onClick={() => bgFileInputRef.current?.click()}
                className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
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

          {showBottomPanel === "settings" && (
            <div className="bg-white border-t border-gray-200 p-4 animate-slide-up max-h-80 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Processing Settings</h3>
                <button onClick={() => setShowBottomPanel("none")} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <ProcessingSettings onSettingsChange={handleSettingsChange} />
            </div>
          )}
        </div>
      )}

      {/* HD Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-center">Unlock HD Download</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter unlock code"
                value={unlockCode}
                onChange={(e) => setUnlockCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex space-x-3">
                <button
                  onClick={checkUnlockCode}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Unlock
                </button>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
