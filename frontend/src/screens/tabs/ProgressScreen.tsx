import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CalendarDays, TrendingUp, Trophy, Weight } from "lucide-react-native";
import { BarChart, LineChart } from "../../components/Charts";
import MuscleMap, { fullIntensity } from "../../components/MuscleMap";
import MonthCalendar from "../../components/MonthCalendar";
import { colors } from "../../theme/colors";
import { useHistory } from "../../context/AppDataProvider";
import { computePersonalRecords } from "../../utils/prCalc";
import { muscleLoadMap, volumeInLastNDays, volumeByIsoDate } from "../../utils/volumeCalc";
import { isoDay } from "../../utils/dateUtils";
import { muscleLabel } from "../../data/muscles";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ProgressScreen() {
  const [segment, setSegment] = useState<"insights" | "calendar">("insights");

  return (
    <View className="flex-1 bg-void" style={{ paddingTop: 56 }}>
      <View className="px-6 pb-4">
        <Text className="text-bone font-display text-3xl mb-4">Progress</Text>
        <View className="flex-row bg-ink2 border border-line rounded-2xl p-1">
          <Segment label="Insights" active={segment === "insights"} onPress={() => setSegment("insights")} />
          <Segment label="Calendar" active={segment === "calendar"} onPress={() => setSegment("calendar")} />
        </View>
      </View>
      {segment === "insights" ? <InsightsBody /> : <CalendarBody />}
    </View>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className={`flex-1 py-2.5 rounded-xl items-center ${active ? "bg-volt" : ""}`}>
      <Text className={`font-body_semibold text-sm ${active ? "text-void" : "text-mist"}`}>{label}</Text>
    </Pressable>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="px-6 mb-8">
      <Text className="text-bone font-display_medium text-lg mb-4">{title}</Text>
      <View className="bg-ink2 border border-line rounded-3xl p-5">{children}</View>
    </View>
  );
}

function InsightsBody() {
  const { history } = useHistory();

  const dailyVolume = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return DAY_LABELS.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const volume = history
        .filter((h) => {
          const t = new Date(h.date).getTime();
          return t >= d.getTime() && t < next.getTime();
        })
        .reduce((sum, h) => sum + h.totalVolume, 0);
      return { label, value: volume };
    });
  }, [history]);

  const weeklyTrend = useMemo(() => {
    const weeks = 8;
    const now = Date.now();
    return Array.from({ length: weeks }).map((_, i) => {
      const weeksAgo = weeks - 1 - i;
      const end = now - weeksAgo * 7 * 24 * 60 * 60 * 1000;
      const start = end - 7 * 24 * 60 * 60 * 1000;
      const value = history
        .filter((h) => {
          const t = new Date(h.date).getTime();
          return t >= start && t < end;
        })
        .reduce((sum, h) => sum + h.totalVolume, 0);
      return { label: weeksAgo === 0 ? "Now" : `-${weeksAgo}w`, value };
    });
  }, [history]);

  const records = useMemo(() => computePersonalRecords(history), [history]);
  const topRecords = useMemo(
    () => Object.values(records).sort((a, b) => b.estimated1RM.value - a.estimated1RM.value).slice(0, 6),
    [records]
  );

  const loadMap = useMemo(() => muscleLoadMap(history, 14), [history]);
  const repsThisWeek = useMemo(
    () => history.filter((h) => Date.now() - new Date(h.date).getTime() < 7 * 24 * 60 * 60 * 1000).reduce((s, h) => s + h.totalReps, 0),
    [history]
  );
  const volumeThisWeek = volumeInLastNDays(history, 7);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
      <View className="flex-row px-6 mb-6">
        <View className="flex-1 bg-ink2 border border-line rounded-2xl py-4 items-center mx-1">
          <Text className="text-bone font-display text-2xl">{repsThisWeek.toLocaleString()}</Text>
          <Text className="text-smoke font-body text-[10px] uppercase tracking-wider mt-1">Reps this week</Text>
        </View>
        <View className="flex-1 bg-ink2 border border-line rounded-2xl py-4 items-center mx-1">
          <Text className="text-bone font-display text-2xl">{volumeThisWeek.toLocaleString()}</Text>
          <Text className="text-smoke font-body text-[10px] uppercase tracking-wider mt-1">Lb this week</Text>
        </View>
      </View>

      <Section title="Daily Volume">
        <View className="items-center">
          <BarChart data={dailyVolume} />
        </View>
      </Section>

      <Section title="Weekly Trend">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart data={weeklyTrend} />
        </ScrollView>
      </Section>

      <Section title="Muscles Trained (14 days)">
        <View className="items-center">
          <MuscleMap intensities={loadMap} highlightColor={colors.plasma} width={120} showLabels />
        </View>
      </Section>

      <Section title="Personal Records">
        {topRecords.length === 0 ? (
          <Text className="text-smoke font-body text-sm">Log a few workouts and your heaviest lifts will show up here.</Text>
        ) : (
          topRecords.map((r) => (
            <View key={r.exerciseId} className="flex-row items-center justify-between py-3 border-b border-line">
              <View className="flex-row items-center flex-1">
                <Trophy size={14} color={colors.volt} />
                <Text numberOfLines={1} className="text-bone font-body_semibold text-sm ml-2 flex-1">
                  {r.exerciseName}
                </Text>
              </View>
              <Text className="text-mist font-mono text-xs">
                {r.maxWeight.value}lb×{r.maxWeight.reps} · ~{Math.round(r.estimated1RM.value)} 1RM
              </Text>
            </View>
          ))
        )}
      </Section>
    </ScrollView>
  );
}

function CalendarBody() {
  const { history } = useHistory();
  const [selectedIso, setSelectedIso] = useState<string | null>(() =>
    history.length ? isoDay(new Date(history[0].date)) : isoDay()
  );

  const volumeMap = useMemo(() => volumeByIsoDate(history), [history]);
  const totalVolume = history.reduce((sum, w) => sum + w.totalVolume, 0);
  const totalWorkouts = history.length;
  const uniqueDays = new Set(history.map((w) => isoDay(new Date(w.date)))).size;

  const selectedEntries = useMemo(
    () => (selectedIso ? history.filter((h) => isoDay(new Date(h.date)) === selectedIso) : []),
    [history, selectedIso]
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
      <View className="flex-row px-6 mb-6">
        <SummaryStat icon={<CalendarDays size={16} color={colors.volt} />} value={`${uniqueDays}`} label="days trained" />
        <SummaryStat icon={<TrendingUp size={16} color={colors.plasma} />} value={`${totalWorkouts}`} label="workouts" />
        <SummaryStat icon={<Weight size={16} color={colors.ember} />} value={`${Math.round(totalVolume / 1000)}k`} label="lb lifted" />
      </View>

      <View className="px-6 mb-6">
        <MonthCalendar volumeByIsoDate={volumeMap} selectedIso={selectedIso} onSelectDay={setSelectedIso} />
      </View>

      {selectedIso && (
        <View className="px-6">
          <Text className="text-bone font-display_medium text-xl mb-4">
            {new Date(selectedIso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </Text>

          {selectedEntries.length === 0 ? (
            <View className="bg-ink2 border border-dashed border-line rounded-3xl py-10 items-center">
              <Text className="text-smoke font-body text-sm">No workout logged this day.</Text>
            </View>
          ) : (
            selectedEntries.map((entry) => (
              <View key={entry.id} className="bg-ink2 border border-line rounded-3xl p-5 mb-4">
                <Text className="text-bone font-display text-2xl mb-1">{entry.routineName}</Text>
                <Text className="text-mist font-body text-xs mb-4">
                  {entry.totalSets} sets · {entry.totalVolume.toLocaleString()} lb volume
                </Text>
                <MuscleMap intensities={fullIntensity(entry.musclesTrained)} width={110} showLabels />
                <View className="flex-row flex-wrap mt-4">
                  {entry.musclesTrained.map((m) => (
                    <View key={m} className="bg-ink border border-line rounded-full px-3 py-1 mr-2 mb-2">
                      <Text className="text-mist font-body_medium text-[11px]">{muscleLabel(m)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

function SummaryStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <View className="flex-1 bg-ink2 border border-line rounded-2xl py-4 items-center mx-1">
      {icon}
      <Text className="text-bone font-display text-xl mt-2">{value}</Text>
      <Text className="text-smoke font-body text-[10px] uppercase tracking-wider mt-0.5">{label}</Text>
    </View>
  );
}
