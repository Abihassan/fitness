import React from "react";
import { View, type ViewStyle } from "react-native";

export default function GlassCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}) {
  return (
    <View className={`bg-ink2 border border-line rounded-3xl ${className}`} style={[{ overflow: "hidden" }, style]}>
      {children}
    </View>
  );
}
