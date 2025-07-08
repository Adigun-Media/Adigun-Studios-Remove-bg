"use client"

import { useEffect, useState } from "react"

interface ReminiStyleEnhancerProps {
  imageFile: File
  mode: "auto" | "portrait" | "landscape" | "old-photo"
  onEnhanced: (enhancedImageUrl: string) => void
  onError: (error: string) => void
}

export default function ReminiStyleEnhancer({ imageFile, mode, onEnhanced, onError }: ReminiStyleEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")

  const applyUnsharpMask = (
    imageData: ImageData,
    canvas: HTMLCanvasElement,
    amount = 1.5,
    radius = 1.0,
    threshold = 0,
  ) => {
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    const newData = new Uint8ClampedArray(data)

    // Create Gaussian blur for unsharp mask
    const blurredData = new Uint8ClampedArray(data)
    const sigma = radius
    const kernelSize = Math.ceil(sigma * 3) * 2 + 1
    const kernel = []
    let sum = 0

    // Generate Gaussian kernel
    for (let i = 0; i < kernelSize; i++) {
      const x = i - Math.floor(kernelSize / 2)
      const value = Math.exp(-(x * x) / (2 * sigma * sigma))
      kernel[i] = value
      sum += value
    }

    // Normalize kernel
    for (let i = 0; i < kernelSize; i++) {
      kernel[i] /= sum
    }

    // Apply horizontal blur
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let k = 0; k < kernelSize; k++) {
            const px = Math.max(0, Math.min(width - 1, x + k - Math.floor(kernelSize / 2)))
            sum += data[(y * width + px) * 4 + c] * kernel[k]
          }
          blurredData[(y * width + x) * 4 + c] = sum
        }
      }
    }

    // Apply vertical blur
    const tempData = new Uint8ClampedArray(blurredData)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0
          for (let k = 0; k < kernelSize; k++) {
            const py = Math.max(0, Math.min(height - 1, y + k - Math.floor(kernelSize / 2)))
            sum += tempData[(py * width + x) * 4 + c] * kernel[k]
          }
          blurredData[(y * width + x) * 4 + c] = sum
        }
      }
    }

    // Apply unsharp mask
    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const original = data[i + c]
        const blurred = blurredData[i + c]
        const difference = original - blurred

        if (Math.abs(difference) > threshold) {
          newData[i + c] = Math.max(0, Math.min(255, original + difference * amount))
        } else {
          newData[i + c] = original
        }
      }
      newData[i + 3] = data[i + 3] // Keep alpha
    }

    return new ImageData(newData, width, height)
  }

  const applyAdvancedColorCorrection = (imageData: ImageData) => {
    const data = imageData.data
    const newData = new Uint8ClampedArray(data)

    // Calculate histogram
    const histogram = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) }
    let pixelCount = 0

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        histogram.r[data[i]]++
        histogram.g[data[i + 1]]++
        histogram.b[data[i + 2]]++
        pixelCount++
      }
    }

    // Calculate cumulative distribution
    const cdf = { r: new Array(256), g: new Array(256), b: new Array(256) }
    cdf.r[0] = histogram.r[0]
    cdf.g[0] = histogram.g[0]
    cdf.b[0] = histogram.b[0]

    for (let i = 1; i < 256; i++) {
      cdf.r[i] = cdf.r[i - 1] + histogram.r[i]
      cdf.g[i] = cdf.g[i - 1] + histogram.g[i]
      cdf.b[i] = cdf.b[i - 1] + histogram.b[i]
    }

    // Apply histogram equalization with adaptive limits
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        // Adaptive histogram equalization
        newData[i] = Math.round((cdf.r[data[i]] / pixelCount) * 255 * 0.8 + data[i] * 0.2)
        newData[i + 1] = Math.round((cdf.g[data[i + 1]] / pixelCount) * 255 * 0.8 + data[i + 1] * 0.2)
        newData[i + 2] = Math.round((cdf.b[data[i + 2]] / pixelCount) * 255 * 0.8 + data[i + 2] * 0.2)

        // Enhance saturation slightly
        const r = newData[i] / 255
        const g = newData[i + 1] / 255
        const b = newData[i + 2] / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max === 0 ? 0 : (max - min) / max

        const enhancedSaturation = Math.min(1, saturation * 1.2)
        const factor = enhancedSaturation / (saturation || 1)

        if (saturation > 0) {
          newData[i] = Math.round(Math.max(0, Math.min(255, (r - min) * factor + min)) * 255)
          newData[i + 1] = Math.round(Math.max(0, Math.min(255, (g - min) * factor + min)) * 255)
          newData[i + 2] = Math.round(Math.max(0, Math.min(255, (b - min) * factor + min)) * 255)
        }
      }
      newData[i + 3] = data[i + 3]
    }

    return new ImageData(newData, imageData.width, imageData.height)
  }

  const applyNoiseReduction = (imageData: ImageData, canvas: HTMLCanvasElement) => {
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height
    const newData = new Uint8ClampedArray(data)

    // Advanced bilateral filter
    const radius = 3
    const sigmaColor = 30
    const sigmaSpace = 30

    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const centerIndex = (y * width + x) * 4

        if (data[centerIndex + 3] === 0) continue

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

      img.onload = async () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        // Upscale for better quality (2x)
        canvas.width = img.width * 2
        canvas.height = img.height * 2

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        setCurrentStep("Upscaling image...")
        setProgress(20)

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        setTimeout(() => {
          setCurrentStep("Applying noise reduction...")
          setProgress(40)

          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          imageData = applyNoiseReduction(imageData, canvas)
          ctx.putImageData(imageData, 0, 0)

          setTimeout(() => {
            setCurrentStep("Enhancing details...")
            setProgress(60)

            imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            // Apply different enhancements based on mode
            switch (mode) {
              case "portrait":
                imageData = applyUnsharpMask(imageData, canvas, 2.0, 0.8, 5)
                break
              case "landscape":
                imageData = applyUnsharpMask(imageData, canvas, 1.2, 1.2, 3)
                break
              case "old-photo":
                imageData = applyUnsharpMask(imageData, canvas, 1.8, 1.0, 8)
                break
              default:
                imageData = applyUnsharpMask(imageData, canvas, 1.5, 1.0, 4)
            }

            ctx.putImageData(imageData, 0, 0)

            setTimeout(() => {
              setCurrentStep("Color correction...")
              setProgress(80)

              imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              imageData = applyAdvancedColorCorrection(imageData)
              ctx.putImageData(imageData, 0, 0)

              setTimeout(() => {
                setCurrentStep("Finalizing...")
                setProgress(95)

                setTimeout(() => {
                  setProgress(100)
                  setCurrentStep("Enhancement complete!")
                  resolve(canvas.toDataURL("image/png"))
                }, 300)
              }, 500)
            }, 800)
          }, 800)
        }, 600)
      }

      img.onerror = () => {
        onError("Failed to load image for enhancement")
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(imageFile)
    })
  }

  const startEnhancement = async () => {
    setIsLoading(true)
    setProgress(5)
    setCurrentStep("Initializing Remini-style enhancement...")

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
    if (imageFile) {
      startEnhancement()
    }
  }, [imageFile, mode])

  if (isLoading) {
    return (
      <div className="text-center py-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-700 mb-2 font-medium">✨ AI Enhancement ({mode})</p>
        <p className="text-sm text-gray-600 mb-3">{currentStep}</p>
        <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% complete</p>

        {progress > 40 && (
          <div className="mt-3 text-xs text-gray-400">
            <p>🎯 Professional-grade enhancement</p>
            <p>🔧 Remini-style processing</p>
            <p>✨ 2x upscaling + detail enhancement</p>
          </div>
        )}
      </div>
    )
  }

  return null
}
