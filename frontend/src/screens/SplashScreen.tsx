import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../theme/colors";

export default function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace("Welcome"), 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[colors.void, "#15131F", colors.void]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <View style={{ alignItems: "center" }}>
        <Text className="text-bone font-display text-5xl" style={{ letterSpacing: 1 }}>
          MAKSH
        </Text>
        <Text className="text-mist font-body text-base mt-3">Plan Smart. Train Hard.</Text>
      </View>
    </LinearGradient>
  );
}
