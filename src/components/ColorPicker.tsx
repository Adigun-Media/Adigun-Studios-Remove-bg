import { View, TouchableOpacity, StyleSheet } from "react-native"

const colors = [
  "#ffffff",
  "#f0f0f0",
  "#e0e0e0",
  "#d0d0d0",
  "#ff0000",
  "#ff8000",
  "#ffff00",
  "#80ff00",
  "#00ff00",
  "#00ff80",
  "#00ffff",
  "#0080ff",
  "#0000ff",
  "#8000ff",
  "#ff00ff",
  "#ff0080",
  "#800000",
  "#804000",
  "#808000",
  "#408000",
  "#008000",
  "#008040",
  "#008080",
  "#004080",
  "#000080",
  "#400080",
  "#800080",
  "#800040",
]

const ColorPicker = ({ selectedColor, onColorSelect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.colorGrid}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorSwatch, { backgroundColor: color }, selectedColor === color && styles.selectedSwatch]}
            onPress={() => onColorSelect(color)}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedSwatch: {
    borderColor: "#64b5f6",
    borderWidth: 3,
  },
})

export default ColorPicker
