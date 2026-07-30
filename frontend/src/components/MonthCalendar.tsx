import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { colors } from "../theme/colors";
import { monthGrid, type MonthCell } from "../utils/dateUtils";

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// Intensity buckets rather than a flat "trained" boolean — the spec calls
// for color-coding by logged volume, not just presence/absence.
function intensityColor(volume: number, maxVolume: number): string | null {
  if (volume <= 0) return null;
  const ratio = maxVolume > 0 ? volume / maxVolume : 0;
  if (ratio > 0.75) return colors.volt;
  if (ratio > 0.45) return "#B08A1E";
  if (ratio > 0.15) return "#6B5A1E";
  return "#3A3320";
}

export default function MonthCalendar({
  volumeByIsoDate,
  selectedIso,
  onSelectDay,
}: {
  volumeByIsoDate: Record<string, number>;
  selectedIso: string | null;
  onSelectDay: (iso: string) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const cells = monthGrid(cursor.year, cursor.month, volumeByIsoDate);
  const maxVolume = Math.max(1, ...Object.values(volumeByIsoDate));
  const label = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const shift = (delta: number) => {
    let month = cursor.month + delta;
    let year = cursor.year;
    if (month < 0) {
      month = 11;
      year -= 1;
    } else if (month > 11) {
      month = 0;
      year += 1;
    }
    setCursor({ year, month });
  };

  return (
    <View className="bg-ink2 border border-line rounded-3xl p-5">
      <View className="flex-row items-center justify-between mb-5">
        <Pressable onPress={() => shift(-1)} className="w-8 h-8 rounded-full bg-ink items-center justify-center">
          <ChevronLeft size={16} color={colors.mist} />
        </Pressable>
        <Text className="text-bone font-display_medium text-base">{label}</Text>
        <Pressable onPress={() => shift(1)} className="w-8 h-8 rounded-full bg-ink items-center justify-center">
          <ChevronRight size={16} color={colors.mist} />
        </Pressable>
      </View>

      <View className="flex-row mb-2">
        {WEEKDAY_LABELS.map((l, i) => (
          <View key={`${l}-${i}`} style={{ width: `${100 / 7}%` }} className="items-center">
            <Text className="text-smoke font-body text-[11px]">{l}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, i) => (
          <DayCell
            key={i}
            cell={cell}
            maxVolume={maxVolume}
            selected={cell?.iso === selectedIso}
            onPress={() => cell && onSelectDay(cell.iso)}
          />
        ))}
      </View>
    </View>
  );
}

function DayCell({
  cell,
  maxVolume,
  selected,
  onPress,
}: {
  cell: MonthCell | null;
  maxVolume: number;
  selected: boolean;
  onPress: () => void;
}) {
  if (!cell) {
    return (
      <View style={{ width: `${100 / 7}%` }} className="items-center mb-2">
        <View className="w-8 h-8" />
      </View>
    );
  }

  const fill = intensityColor(cell.volume, maxVolume);
  const isLight = fill === colors.volt;

  return (
    <View style={{ width: `${100 / 7}%` }} className="items-center mb-2">
      <Pressable
        onPress={onPress}
        className={`w-8 h-8 rounded-full items-center justify-center ${
          selected ? "border-2 border-bone" : cell.isToday ? "border border-line" : ""
        }`}
        style={fill ? { backgroundColor: fill } : undefined}
      >
        <Text
          className={`font-body_medium text-xs ${
            fill ? (isLight ? "text-void" : "text-bone") : "text-mist"
          }`}
        >
          {cell.dayNum}
        </Text>
      </Pressable>
    </View>
  );
}
