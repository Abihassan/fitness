import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { colors } from "../theme/colors";

export interface ChartPoint {
  label: string;
  value: number;
}

const CHART_HEIGHT = 140;

/** Simple vertical bar chart — e.g. daily volume, Mon..Sun. */
export function BarChart({ data, unit = "" }: { data: ChartPoint[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 28;
  const gap = 14;
  const width = data.length * (barWidth + gap);

  return (
    <View>
      <Svg width={width} height={CHART_HEIGHT + 24}>
        <Defs>
          <LinearGradient id="barFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.volt} />
            <Stop offset="100%" stopColor="#7CCB1F" />
          </LinearGradient>
        </Defs>
        {data.map((d, i) => {
          const h = Math.max(3, (d.value / max) * CHART_HEIGHT);
          const x = i * (barWidth + gap) + gap / 2;
          const y = CHART_HEIGHT - h;
          const isPeak = d.value === max && max > 0;
          return (
            <Rect
              key={d.label}
              x={x}
              y={y}
              width={barWidth}
              height={h}
              rx={8}
              fill={isPeak ? "url(#barFill)" : colors.ink}
            />
          );
        })}
      </Svg>
      <View className="flex-row" style={{ width }}>
        {data.map((d) => (
          <Text
            key={d.label}
            style={{ width: barWidth + gap }}
            className="text-smoke font-body text-[10px] text-center"
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

/** Simple line + area chart — e.g. rolling weekly volume trend. */
export function LineChart({ data, unit = "" }: { data: ChartPoint[]; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const min = Math.min(0, ...data.map((d) => d.value));
  const width = Math.max(240, data.length * 44);
  const stepX = data.length > 1 ? width / (data.length - 1) : width;

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = CHART_HEIGHT - ((d.value - min) / (max - min || 1)) * CHART_HEIGHT;
    return { x, y, d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1]?.x ?? 0},${CHART_HEIGHT} L0,${CHART_HEIGHT} Z`;

  return (
    <View>
      <Svg width={width} height={CHART_HEIGHT + 24}>
        <Defs>
          <LinearGradient id="areaFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={colors.plasma} stopOpacity={0.35} />
            <Stop offset="100%" stopColor={colors.plasma} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <Line
            key={f}
            x1={0}
            x2={width}
            y1={CHART_HEIGHT * f}
            y2={CHART_HEIGHT * f}
            stroke={colors.line}
            strokeWidth={1}
          />
        ))}
        <Path d={areaPath} fill="url(#areaFill)" />
        <Path d={linePath} stroke={colors.plasma} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p) => (
          <Circle key={p.d.label} cx={p.x} cy={p.y} r={3.5} fill={colors.bone} />
        ))}
      </Svg>
      <View className="flex-row" style={{ width }}>
        {data.map((d, i) => (
          <Text
            key={d.label}
            style={{ width: stepX, marginLeft: i === 0 ? -stepX / 2 : 0 }}
            className="text-smoke font-body text-[10px] text-center"
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}
