import React from "react";
import { Pressable, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { gradients } from "../theme/colors";
import type { Mood } from "../types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  variant?: Mood | "ghost";
  size?: "lg" | "md";
  disabled?: boolean;
  className?: string;
}

export default function PrimaryButton({
  label,
  onPress,
  icon,
  variant = "volt",
  size = "lg",
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const isGhost = variant === "ghost";
  const colorPair = gradients[variant as Mood] ?? gradients.volt;
  const padY = size === "lg" ? "py-4" : "py-3";

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 250 });
  };
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress?.();
  };

  if (isGhost) {
    return (
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={animatedStyle}
        className={`${padY} rounded-2xl border border-line items-center justify-center flex-row ${className} ${
          disabled ? "opacity-40" : ""
        }`}
      >
        {icon}
        <Text className="text-bone font-body_semibold text-base ml-2">{label}</Text>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={animatedStyle}
      className={`rounded-2xl overflow-hidden ${className} ${disabled ? "opacity-40" : ""}`}
    >
      <LinearGradient
        colors={colorPair}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className={`${padY} items-center justify-center flex-row`}
      >
        {icon}
        <Text className="text-void font-body_semibold text-base ml-2">{label}</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}
