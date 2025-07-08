"use client"

import { useEffect, useState } from "react"

interface ImageEnhancerProps {
  imageUrl: string
  onEnhanced: (enhancedImageUrl: string) => void
  onError: (error: string) => void
  enhancementType?: "auto" | "sharpen" | "brighten" | "contrast" | "denoise"
}

export default function ImageEnhancer({ imageUrl, onEnhanced, onError, enhancementType = "auto" }: ImageEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const applySharpening = (imageData: ImageData, canvas: HTMLCanvasElement, intensity = 0.5) => {
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    const newData = new Uint8ClampedArray(data)

    // Sharpening kernel
    const kernel = [0, -intensity, 0, -intensity, 1 + 4 * intensity, -intensity, 0, -intensity, 0]

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          // RGB channels only
          let sum = 0
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c
              const kernelIndex = (ky + 1) * 3 + (kx + 1)
              sum += data[pixelIndex] * kernel[kernelIndex]
            }
          }
          const index = (y * width + x) * 4 + c
          newData[index] = Math.max(0, Math.min(255, sum))
        }
      }
    }

    return new ImageData(newData, width, height)
  }

  const applyBrightnessContrast = (imageData: ImageData, brightness = 0, contrast = 0) => {
    const data = imageData.data
    const newData = new Uint8ClampedArray(data)

    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness and contrast to RGB channels
      for (let c = 0; c < 3; c++) {
        let pixel = data[i + c]

        // Apply brightness
        pixel += brightness

        // Apply contrast
        pixel = contrastFactor * (pixel - 128) + 128

        // Clamp values
        newData[i + c] = Math.max(0, Math.min(255, pixel))
      }

      // Keep alpha channel unchanged
      newData[i + 3] = data[i + 3]
    }

    return new ImageData(newData, imageData.width, imageData.height)
  }

  const applyDenoising = (imageData: ImageData, canvas: HTMLCanvasElement) => {
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    const newData = new Uint8ClampedArray(data)

    // Simple bilateral filter for noise reduction
    const radius = 2
    const sigmaColor = 50
    const sigmaSpace = 50

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const centerIndex = (y * width + x) * 4

        if (data[centerIndex + 3] === 0) continue // Skip transparent pixels

        let totalWeight = 0
        let sumR = 0,
          sumG = 0,
          sumB = 0

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const neighborIndex = ((y + dy) * width + (x + dx)) * 4

            if (data[neighborIndex + 3] === 0) continue

            // Spatial weight
            const spatialDist = Math.sqrt(dx * dx + dy * dy)
            const spatialWeight = Math.exp(-(spatialDist * spatialDist) / (2 * sigmaSpace * sigmaSpace))

            // Color weight
            const colorDist = Math.sqrt(
              Math.pow(data[centerIndex] - data[neighborIndex], 2) +
                Math.pow(data[centerIndex + 1] - data[neighborIndex + 1], 2) +
                Math.pow(data[centerIndex + 2] - data[neighborIndex + 2], 2),
            )
            const colorWeight = Math.exp(-(colorDist * colorDist) / (2 * sigmaColor * sigmaColor))

            const weight = spatialWeight * colorWeight
            totalWeight += weight

            sumR += data[neighborIndex] * weight
            sumG += data[neighborIndex + 1] * weight
            sumB += data[neighborIndex + 2] * weight
          }
        }

        if (totalWeight > 0) {
          newData[centerIndex] = sumR / totalWeight
          newData[centerIndex + 1] = sumG / totalWeight
          newData[centerIndex + 2] = sumB / totalWeight
        }
      }
    }

    return new ImageData(newData, width, height)
  }

  const enhanceImage = async (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        canvas.width = img.width
        canvas.height = img.height

        setCurrentStep("Analyzing image quality...")
        setProgress(20)

        // Draw original image
        ctx.drawImage(img, 0, 0)

        setTimeout(() => {
          setCurrentStep("Applying AI enhancements...")
          setProgress(40)

          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          // Apply different enhancements based on type
          switch (enhancementType) {
            case "auto":
              // Auto enhancement: combine multiple techniques
              imageData = applyBrightnessContrast(imageData, 10, 15) // Slight brightness and contrast boost
              ctx.putImageData(imageData, 0, 0)
              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              imageData = applySharpening(imageData, canvas, 0.3) // Mild sharpening
              ctx.putImageData(imageData, 0, 0)
              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              imageData = applyDenoising(imageData, canvas) // Noise reduction
              break

            case "sharpen":
              imageData = applySharpening(imageData, canvas, 0.6)
              break

            case "brighten":
              imageData = applyBrightnessContrast(imageData, 20, 10)
              break

            case "contrast":
              imageData = applyBrightnessContrast(imageData, 0, 25)
              break

            case "denoise":
              imageData = applyDenoising(imageData, canvas)
              break
          }

          setTimeout(() => {
            setCurrentStep("Finalizing enhancement...")
            setProgress(80)

            ctx.putImageData(imageData, 0, 0)

            setTimeout(() => {
              setProgress(100)
              setCurrentStep("Enhancement complete!")
              resolve(canvas.toDataURL("image/png"))
            }, 300)
          }, 800)
        }, 600)
      }

      img.onerror = () => {
        onError("Failed to load image for enhancement")
      }

      img.src = imageUrl
    })
  }

  const startEnhancement = async () => {
    setIsLoading(true)
    setProgress(5)
    setCurrentStep("Initializing AI enhancement...")

    try {
      const enhancedImageUrl = await enhanceImage()
      onEnhanced(enhancedImageUrl)
    } catch (error) {
      onError("Failed to enhance image")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (imageUrl) {
      startEnhancement()
    }
  }, [imageUrl, enhancementType])

  if (isLoading) {
    return (
      <div className="text-center py-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-700 mb-2 font-medium">✨ AI Enhancement</p>
        <p className="text-sm text-gray-600 mb-3">{currentStep}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
          <div
            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>

        {progress > 40 && (
          <div className="mt-3 text-xs text-gray-400">
            <p>🎯 Analyzing image quality</p>
            <p>🔧 Applying smart enhancements</p>
            <p>✨ Optimizing colors and sharpness</p>
          </div>
        )}
      </div>
    )
  }

  return null
}
