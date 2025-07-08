"use client"

import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

const OnboardingScreen = ({ navigation }) => {
  const floatingShapes = useRef([
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
    new Animated.ValueXY({ x: 0, y: 0 }),
  ]).current

  useEffect(() => {
    floatingShapes.forEach((shape, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shape, {
            toValue: {
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50,
            },
            duration: 3000 + index * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shape, {
            toValue: { x: 0, y: 0 },
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    })
  }, [])

  const renderFloatingShapes = () => {
    return floatingShapes.map((shape, index) => (
      <Animated.View
        key={index}
        style={[
          styles.floatingShape,
          {
            left: 50 + index * 80,
            top: 100 + index * 150,
            transform: [{ translateX: shape.x }, { translateY: shape.y }],
          },
        ]}
      />
    ))
  }

  return (
    <View style={styles.container}>
      {renderFloatingShapes()}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.appName}>Background Remover</Text>
        <Text style={styles.subtitle}>Remove backgrounds from your images with ease</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.secondaryButtonText}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 24,
    color: "#666",
    marginBottom: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#64b5f6",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: "#64b5f6",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: 15,
  },
  secondaryButtonText: {
    color: "#64b5f6",
    fontSize: 16,
    textAlign: "center",
  },
  floatingShape: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(100, 181, 246, 0.3)",
  },
})

export default OnboardingScreen
