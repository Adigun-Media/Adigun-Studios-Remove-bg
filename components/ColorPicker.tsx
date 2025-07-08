"use client"

interface ColorPickerProps {
  selectedColor: string
  onColorSelect: (color: string) => void
}

const colors = [
  "#ffffff",
  "#f8f9fa",
  "#e9ecef",
  "#dee2e6",
  "#ced4da",
  "#adb5bd",
  "#6c757d",
  "#495057",
  "#343a40",
  "#212529",
  "#000000",
  "#ff6b6b",
  "#ee5a52",
  "#ff8787",
  "#ffa8a8",
  "#ffc9c9",
  "#51cf66",
  "#40c057",
  "#69db7c",
  "#8ce99a",
  "#b2f2bb",
  "#339af0",
  "#228be6",
  "#74c0fc",
  "#a5d8ff",
  "#d0ebff",
  "#ffd43b",
  "#fab005",
  "#ffec99",
  "#fff3bf",
  "#fff9db",
  "#9775fa",
  "#7950f2",
  "#b197fc",
  "#d0bfff",
  "#e5dbff",
  "#ff8cc8",
  "#e64980",
  "#faa2c1",
  "#ffb3d1",
  "#fcc2d7",
]

export default function ColorPicker({ selectedColor, onColorSelect }: ColorPickerProps) {
  return (
    <div>
      <div className="grid grid-cols-6 gap-2 mb-3">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorSelect(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-[#64b5f6] scale-110 shadow-md"
                : "border-gray-300 hover:border-gray-400 hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onColorSelect(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <span className="text-sm text-gray-600">Custom color</span>
      </div>
    </div>
  )
}
