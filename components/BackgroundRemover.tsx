"use client"

import { useEffect, useState } from "react"

interface BackgroundRemoverProps {
  imageFile: File
  onProcessed: (processedImageUrl: string, hdImageUrl?: string) => void
  onError: (error: string) => void
  settings?: {
    sensitivity: number
    edgeSmoothing: boolean
    conservativeMode: boolean
  }
}

export default function BackgroundRemover({ imageFile, onProcessed, onError, settings }: BackgroundRemoverProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const smoothEdges = (imageData: ImageData, canvas: HTMLCanvasElement) => {
    if (!settings?.edgeSmoothing) return imageData

    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    const newData = new Uint8ClampedArray(data)

    // Multi-pass edge smoothing for better results
    for (let pass = 0; pass < 2; pass++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const index = (y * width + x) * 4
          const alpha = newData[index + 3]

          if (alpha > 0 && alpha < 255) {
            // This is an edge pixel, smooth it
            let totalAlpha = 0
            let totalR = 0
            let totalG = 0
            let totalB = 0
            let count = 0

            // Check 3x3 neighborhood
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const neighborIndex = ((y + dy) * width + (x + dx)) * 4
                if (neighborIndex >= 0 && neighborIndex < newData.length) {
                  const weight = dx === 0 && dy === 0 ? 4 : 1 // Center pixel gets more weight
                  totalAlpha += newData[neighborIndex + 3] * weight
                  totalR += newData[neighborIndex] * weight
                  totalG += newData[neighborIndex + 1] * weight
                  totalB += newData[neighborIndex + 2] * weight
                  count += weight
                }
              }
            }

            // Apply smoothed values
            newData[index] = Math.round(totalR / count)
            newData[index + 1] = Math.round(totalG / count)
            newData[index + 2] = Math.round(totalB / count)
            newData[index + 3] = Math.round(totalAlpha / count)
          }
        }
      }
    }

    return new ImageData(newData, width, height)
  }

  const analyzeImageContrast = (imageData: ImageData, canvas: HTMLCanvasElement) => {
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    // Sample edge pixels to determine background colors
    const edgePixels: Array<{ r: number; g: number; b: number; x: number; y: number }> = []
    const edgeThickness = Math.max(5, Math.min(width, height) * 0.02)

    // Sample from all four edges
    for (let i = 0; i < edgeThickness; i++) {
      // Top and bottom edges
      for (let x = 0; x < width; x += 3) {
        const topIndex = (i * width + x) * 4
        const bottomIndex = ((height - 1 - i) * width + x) * 4

        edgePixels.push({
          r: data[topIndex],
          g: data[topIndex + 1],
          b: data[topIndex + 2],
          x: x,
          y: i,
        })

        edgePixels.push({
          r: data[bottomIndex],
          g: data[bottomIndex + 1],
          b: data[bottomIndex + 2],
          x: x,
          y: height - 1 - i,
        })
      }

      // Left and right edges
      for (let y = 0; y < height; y += 3) {
        const leftIndex = (y * width + i) * 4
        const rightIndex = (y * width + (width - 1 - i)) * 4

        edgePixels.push({
          r: data[leftIndex],
          g: data[leftIndex + 1],
          b: data[leftIndex + 2],
          x: i,
          y: y,
        })

        edgePixels.push({
          r: data[rightIndex],
          g: data[rightIndex + 1],
          b: data[rightIndex + 2],
          x: width - 1 - i,
          y: y,
        })
      }
    }

    // Cluster similar colors to find dominant background colors
    const backgroundColors: Array<{ r: number; g: number; b: number; count: number }> = []
    const colorThreshold = 30

    for (const pixel of edgePixels) {
      let foundCluster = false

      for (const bgColor of backgroundColors) {
        const distance = Math.sqrt(
          Math.pow(pixel.r - bgColor.r, 2) + Math.pow(pixel.g - bgColor.g, 2) + Math.pow(pixel.b - bgColor.b, 2),
        )

        if (distance < colorThreshold) {
          // Update cluster average
          bgColor.r = (bgColor.r * bgColor.count + pixel.r) / (bgColor.count + 1)
          bgColor.g = (bgColor.g * bgColor.count + pixel.g) / (bgColor.count + 1)
          bgColor.b = (bgColor.b * bgColor.count + pixel.b) / (bgColor.count + 1)
          bgColor.count++
          foundCluster = true
          break
        }
      }

      if (!foundCluster) {
        backgroundColors.push({ r: pixel.r, g: pixel.g, b: pixel.b, count: 1 })
      }
    }

    // Sort by frequency and return top background colors
    return backgroundColors.sort((a, b) => b.count - a.count).slice(0, 3) // Take top 3 most common background colors
  }

  const processImageAtResolution = (img: HTMLImageElement, scaleFactor = 1): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!

      // Scale canvas for HD version
      canvas.width = img.width * scaleFactor
      canvas.height = img.height * scaleFactor

      // Use high-quality scaling
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Draw scaled image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Analyze image for better background detection
      const backgroundColors = analyzeImageContrast(imageData, canvas)

      // Adaptive threshold based on image analysis and settings
      const baseSensitivity = settings?.sensitivity || 45
      const adaptiveThreshold = backgroundColors.length > 1 ? baseSensitivity * 0.8 : baseSensitivity * 1.2

      // Conservative mode adjustment
      const threshold = settings?.conservativeMode ? adaptiveThreshold * 0.7 : adaptiveThreshold

      // Create a mask for better edge preservation
      const mask = new Uint8Array(canvas.width * canvas.height)

      // First pass: identify obvious background pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const pixelIndex = Math.floor(i / 4)

        let isBackground = false
        let minDistance = Number.POSITIVE_INFINITY

        // Check against all background colors
        for (const bgColor of backgroundColors) {
          const colorDistance = Math.sqrt(
            Math.pow(r - bgColor.r, 2) + Math.pow(g - bgColor.g, 2) + Math.pow(b - bgColor.b, 2),
          )

          minDistance = Math.min(minDistance, colorDistance)

          if (colorDistance < threshold) {
            isBackground = true
            break
          }
        }

        // Additional checks for edge pixels
        const x = pixelIndex % canvas.width
        const y = Math.floor(pixelIndex / canvas.width)
        const edgeBuffer = Math.max(8, Math.min(canvas.width, canvas.height) * 0.03) * scaleFactor

        if (x < edgeBuffer || x > canvas.width - edgeBuffer || y < edgeBuffer || y > canvas.height - edgeBuffer) {
          // More aggressive removal near edges
          const edgeThreshold = threshold + 20
          if (minDistance < edgeThreshold) {
            isBackground = true
          }
        }

        mask[pixelIndex] = isBackground ? 0 : 255
      }

      // Second pass: refine mask with morphological operations
      const refinedMask = new Uint8Array(mask)
      const kernelSize = Math.max(2, Math.floor(3 * scaleFactor))

      // Erosion to remove noise
      for (let y = kernelSize; y < canvas.height - kernelSize; y++) {
        for (let x = kernelSize; x < canvas.width - kernelSize; x++) {
          const index = y * canvas.width + x
          if (mask[index] === 255) {
            let shouldKeep = true

            // Check neighborhood
            for (let dy = -kernelSize; dy <= kernelSize && shouldKeep; dy++) {
              for (let dx = -kernelSize; dx <= kernelSize && shouldKeep; dx++) {
                const neighborIndex = (y + dy) * canvas.width + (x + dx)
                if (mask[neighborIndex] === 0) {
                  // If we find background pixels nearby, be more conservative
                  const distance = Math.sqrt(dx * dx + dy * dy)
                  if (distance <= kernelSize * 0.7) {
                    shouldKeep = false
                  }
                }
              }
            }

            if (!shouldKeep && !settings?.conservativeMode) {
              refinedMask[index] = 0
            }
          }
        }
      }

      // Apply the refined mask
      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = Math.floor(i / 4)
        if (refinedMask[pixelIndex] === 0) {
          data[i + 3] = 0 // Make transparent
        } else {
          // Enhance subject pixels slightly
          const enhancement = 1.05
          data[i] = Math.min(255, data[i] * enhancement)
          data[i + 1] = Math.min(255, data[i + 1] * enhancement)
          data[i + 2] = Math.min(255, data[i + 2] * enhancement)
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Apply edge smoothing if enabled
      if (settings?.edgeSmoothing !== false) {
        const smoothedImageData = smoothEdges(imageData, canvas)
        ctx.putImageData(smoothedImageData, 0, 0)
      }

      resolve(canvas.toDataURL("image/png"))
    })
  }

  const removeBackgroundAdvanced = async (img: HTMLImageElement): Promise<{ normal: string; hd: string }> => {
    return new Promise(async (resolve) => {
      setCurrentStep("Analyzing image contrast and edges...")
      setProgress(30)

      await new Promise((resolve) => setTimeout(resolve, 500))

      setCurrentStep("Processing normal resolution...")
      setProgress(50)

      // Process normal resolution first
      const normalImage = await processImageAtResolution(img, 1)

      setCurrentStep("Generating HD version (3x resolution)...")
      setProgress(75)

      // Process HD version (3x resolution)
      const hdImage = await processImageAtResolution(img, 3)

      setCurrentStep("Finalizing and optimizing...")
      setProgress(95)

      setTimeout(() => {
        setProgress(100)
        setCurrentStep("Complete!")
        resolve({ normal: normalImage, hd: hdImage })
      }, 300)
    })
  }

  const removeBackground = async () => {
    setIsLoading(true)
    setProgress(5)
    setCurrentStep("Loading image...")

    try {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = async () => {
        try {
          setProgress(15)
          const { normal, hd } = await removeBackgroundAdvanced(img)
          onProcessed(normal, hd)
        } catch (error) {
          onError("Failed to process image")
        } finally {
          setIsLoading(false)
        }
      }

      img.onerror = () => {
        onError("Failed to load image")
        setIsLoading(false)
      }

      // Load image from file
      const reader = new FileReader()
      reader.onload = (e) => {
        setProgress(10)
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(imageFile)
    } catch (error) {
      onError("Failed to initialize processing")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (imageFile) {
      removeBackground()
    }
  }, [imageFile, settings])

  if (isLoading) {
    return (
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="w-16 h-16 border-4 border-[#64b5f6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-700 mb-2 font-medium">🎨 Advanced Processing</p>
        <p className="text-sm text-gray-600 mb-4">{currentStep}</p>
        <div className="w-full bg-gray-200 rounded-full h-3 max-w-xs mx-auto">
          <div
            className="bg-gradient-to-r from-[#64b5f6] to-[#42a5f5] h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>

        {progress > 30 && (
          <div className="mt-4 text-xs text-gray-400">
            <p>✨ Enhanced contrast detection algorithm</p>
            <p>🔒 Your images stay private in your browser</p>
            <p>⚡ No server uploads required</p>
            <p>🎛️ Sensitivity: {settings?.sensitivity || 45}</p>
            {progress > 50 && <p>🎯 Preserving subject details...</p>}
            {progress > 75 && <p>📱 Creating 3x HD resolution...</p>}
          </div>
        )}
      </div>
    )
  }

  return null
}
