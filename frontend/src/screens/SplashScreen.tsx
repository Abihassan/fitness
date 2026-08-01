import { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, gradients } from "../theme/colors";

const logo = require("../../assets/images/splash.png");

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={gradients.dusk}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>MAKSH</Text>

        <Text style={styles.tagline}>
          Plan Smart. Train Hard.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.void,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 24,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 18,
  },

  title: {
    fontFamily: "Poppins-Bold", // Change to your loaded font name if different
    fontSize: 44,
    color: colors.bone,
    letterSpacing: 1.5,
  },

  tagline: {
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: colors.mist,
    letterSpacing: 0.5,
  },
});
