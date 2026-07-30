import React from "react";
import { Pressable, Text } from "react-native";

export default function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${
        active ? "bg-volt border-volt" : "bg-ink2 border-line"
      }`}
    >
      <Text className={`font-body_semibold text-xs ${active ? "text-void" : "text-mist"}`}>{label}</Text>
    </Pressable>
  );
}
