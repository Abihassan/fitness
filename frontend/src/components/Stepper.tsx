import React from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Minus, Plus } from "lucide-react-native";
import { colors } from "../theme/colors";

interface StepperProps {
  label?: string;
  value: number;
  onChange: (next: number) => void;
  step?: number;
  min?: number;
  suffix?: string; // e.g. "lb", "s"
  size?: "sm" | "md";
  accentColor?: string;
}

export default function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  suffix,
  size = "md",
  accentColor = colors.volt,
}: StepperProps) {
  const btnSize = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const valueWidth = size === "sm" ? "w-12" : "w-16";

  const bump = (delta: number) => {
    Haptics.selectionAsync().catch(() => {});
    onChange(Math.max(min, Math.round((value + delta) * 100) / 100));
  };

  return (
    <View className="items-center">
      {label && (
        <Text className="text-smoke font-body text-[10px] uppercase tracking-wider mb-1.5">{label}</Text>
      )}
      <View className="flex-row items-center">
        <Pressable
          onPress={() => bump(-step)}
          className={`${btnSize} rounded-full bg-ink items-center justify-center border border-line`}
        >
          <Minus size={size === "sm" ? 12 : 14} color={colors.mist} />
        </Pressable>
        <View className={`${valueWidth} items-center`}>
          <Text className="text-bone font-body_semibold text-base">
            {value}
            {suffix ? <Text className="text-smoke text-xs">{suffix}</Text> : null}
          </Text>
        </View>
        <Pressable
          onPress={() => bump(step)}
          className={`${btnSize} rounded-full items-center justify-center`}
          style={{ backgroundColor: accentColor }}
        >
          <Plus size={size === "sm" ? 12 : 14} color={colors.void} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}
