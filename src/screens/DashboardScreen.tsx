"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ScrollView, TextInput, Share } from "react-native"
import { launchImageLibrary } from "react-native-image-picker"
import { useAuth } from "../context/AuthContext"
import ColorPicker from "../components/ColorPicker"

const DashboardScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [unlockCode, setUnlockCode] = useState("")
  const [isHDUnlocked, setIsHDUnlocked] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const { user } = useAuth()

  const selectImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setSelectedImage(response.assets[0])
          // Simulate background removal processing
          setTimeout(() => {
            setProcessedImage(response.assets[0])
          }, 2000)
        }
      },
    )
  }

  const selectBackgroundImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 1,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setBackgroundImage(response.assets[0])
        }
      },
    )
  }

  const checkUnlockCode = () => {
    if (unlockCode.toUpperCase() === "ADIGUN") {
      setIsHDUnlocked(true)
      Alert.alert("Success", "HD Download unlocked!")
    } else {
      Alert.alert("Error", "Invalid unlock code")
    }
  }

  const downloadNormal = () => {
    Alert.alert("Success", "Image downloaded in normal quality")
  }

  const downloadHD = () => {
    if (isHDUnlocked) {
      Alert.alert("Success", "Image downloaded in HD quality (3x)")
    } else {
      Alert.alert("Locked", "Enter unlock code to access HD download")
    }
  }

  const shareImage = async () => {
    try {
      await Share.share({
        message: "Check out my background-removed image from Adigun Studios!",
        url: processedImage?.uri || "",
      })
    } catch (error) {
      Alert.alert("Error", "Failed to share image")
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Remove Background</Text>
        <Text style={styles.welcomeText}>Welcome back, {user?.username}!</Text>
      </View>

      <View style={styles.content}>
        {!selectedImage ? (
          <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
            <Text style={styles.uploadIcon}>📷</Text>
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imageContainer}>
            <View style={styles.previewContainer}>
              <Text style={styles.sectionTitle}>Preview</Text>
              {processedImage ? (
                <View style={[styles.imagePreview, { backgroundColor }]}>
                  {backgroundImage && <Image source={{ uri: backgroundImage.uri }} style={styles.backgroundImage} />}
                  <Image source={{ uri: processedImage.uri }} style={styles.processedImage} />
                </View>
              ) : (
                <View style={styles.processingContainer}>
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>

            <View style={styles.controlsContainer}>
              <TouchableOpacity style={styles.controlButton} onPress={() => setShowColorPicker(!showColorPicker)}>
                <Text style={styles.controlButtonText}>Background Color</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={selectBackgroundImage}>
                <Text style={styles.controlButtonText}>Background Image</Text>
              </TouchableOpacity>

              {showColorPicker && <ColorPicker selectedColor={backgroundColor} onColorSelect={setBackgroundColor} />}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={downloadNormal}>
                <Text style={styles.actionButtonText}>🔘 Download Normal</Text>
              </TouchableOpacity>

              <View style={styles.hdContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, !isHDUnlocked && styles.lockedButton]}
                  onPress={downloadHD}
                >
                  <Text style={styles.actionButtonText}>🔘 Download HD (x3) {!isHDUnlocked && "🔒"}</Text>
                </TouchableOpacity>

                {!isHDUnlocked && (
                  <View style={styles.unlockContainer}>
                    <TextInput
                      style={styles.unlockInput}
                      placeholder="Enter unlock code"
                      value={unlockCode}
                      onChangeText={setUnlockCode}
                    />
                    <TouchableOpacity style={styles.unlockButton} onPress={checkUnlockCode}>
                      <Text style={styles.unlockButtonText}>Unlock</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TouchableOpacity style={styles.actionButton} onPress={shareImage}>
                <Text style={styles.actionButtonText}>🔘 Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.newImageButton}
              onPress={() => {
                setSelectedImage(null)
                setProcessedImage(null)
                setBackgroundImage(null)
                setUnlockCode("")
                setIsHDUnlocked(false)
              }}
            >
              <Text style={styles.newImageButtonText}>Upload New Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Adigun Studios</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#64b5f6",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginTop: 5,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    marginTop: 50,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  uploadText: {
    fontSize: 18,
    color: "#64b5f6",
    fontWeight: "bold",
  },
  imageContainer: {
    flex: 1,
  },
  previewContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  processedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  processingContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    fontSize: 16,
    color: "#666",
  },
  controlsContainer: {
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  controlButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  actionButtons: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#64b5f6",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  lockedButton: {
    backgroundColor: "#ccc",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  hdContainer: {
    marginBottom: 10,
  },
  unlockContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  unlockInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  unlockButton: {
    backgroundColor: "#64b5f6",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unlockButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  newImageButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  newImageButtonText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#999",
  },
})

export default DashboardScreen
