"use client"

import { useState } from "react"

interface ProcessingSettingsProps {
  onSettingsChange: (settings: ProcessingSettings) => void
}

export interface ProcessingSettings {
  sensitivity: number
  edgeSmoothing: boolean
  conservativeMode: boolean
}

export default function ProcessingSettings({ onSettingsChange }: ProcessingSettingsProps) {
  const [settings, setSettings] = useState<ProcessingSettings>({
    sensitivity: 35, // Lower default for better subject preservation
    edgeSmoothing: true,
    conservativeMode: true,
  })

  const updateSettings = (newSettings: Partial<ProcessingSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    onSettingsChange(updated)
  }

  const getRecommendation = () => {
    if (settings.sensitivity < 25) {
      return "Very conservative - good for complex subjects with similar background colors"
    } else if (settings.sensitivity < 35) {
      return "Conservative - recommended for portraits and detailed subjects"
    } else if (settings.sensitivity < 45) {
      return "Balanced - good for most images"
    } else {
      return "Aggressive - best for high-contrast images with clear backgrounds"
    }
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
      <h4 className="font-semibold text-gray-700 mb-3">🎛️ Processing Settings</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            Background Detection Sensitivity: {settings.sensitivity}
          </label>
          <input
            type="range"
            min="15"
            max="60"
            value={settings.sensitivity}
            onChange={(e) => updateSettings({ sensitivity: Number.parseInt(e.target.value) })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">{getRecommendation()}</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="conservativeMode"
            checked={settings.conservativeMode}
            onChange={(e) => updateSettings({ conservativeMode: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="conservativeMode" className="text-sm text-gray-600">
            Conservative Mode (Preserves more subject details)
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="edgeSmoothing"
            checked={settings.edgeSmoothing}
            onChange={(e) => updateSettings({ edgeSmoothing: e.target.checked })}
            className="rounded"
          />
          <label htmlFor="edgeSmoothing" className="text-sm text-gray-600">
            Edge Smoothing (Reduces jagged edges)
          </label>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h5 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for Better Results:</h5>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• For portraits: Use Conservative Mode + Sensitivity 20-30</li>
          <li>• For low contrast images: Lower sensitivity (15-25)</li>
          <li>• For clear backgrounds: Higher sensitivity (45-60)</li>
          <li>• Always keep Edge Smoothing enabled for cleaner results</li>
        </ul>
      </div>
    </div>
  )
}
