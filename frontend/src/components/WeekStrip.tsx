import React from "react";
import { Text, View } from "react-native";
import type { WeekDay } from "../utils/dateUtils";

export default function WeekStrip({ days }: { days: WeekDay[] }) {
  return (
    <View className="flex-row justify-between">
      {days.map((d) => (
        <View key={d.iso} className="items-center" style={{ width: 36 }}>
          <Text className="text-smoke font-body text-[11px] mb-2">{d.label}</Text>
          <View
            className={`w-9 h-9 rounded-full items-center justify-center ${
              d.isToday ? "bg-volt" : d.trained ? "bg-ink2 border border-volt" : "bg-ink2"
            }`}
          >
            <Text
              className={`font-body_semibold text-xs ${
                d.isToday ? "text-void" : d.trained ? "text-volt" : "text-mist"
              }`}
            >
              {d.dayNum}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
