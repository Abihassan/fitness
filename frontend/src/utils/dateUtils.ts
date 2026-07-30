export function isoDay(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function sameDay(a: string | number | Date, b: string | number | Date): boolean {
  return isoDay(new Date(a)) === isoDay(new Date(b));
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = Math.floor(clamped % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function greetingForHour(hour: number = new Date().getHours()): string {
  if (hour < 5) return "Still up, Champ?";
  if (hour < 12) return "Good morning, Champ";
  if (hour < 17) return "Good afternoon, Champ";
  if (hour < 21) return "Good evening, Champ";
  return "Late one, Champ";
}

export interface WeekDay {
  date: Date;
  iso: string;
  label: string;
  dayNum: number;
  trained: boolean;
  isToday: boolean;
  isFuture: boolean;
}

export function currentWeekDays(historyIsoDates: string[]): WeekDay[] {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = isoDay(d);
    return {
      date: d,
      iso,
      label: d.toLocaleDateString("en-US", { weekday: "narrow" }),
      dayNum: d.getDate(),
      trained: historyIsoDates.includes(iso),
      isToday: sameDay(d, now),
      isFuture: d > now,
    };
  });
}

export function computeStreak(isoDates: string[]): number {
  const set = new Set(isoDates);
  let streak = 0;
  const cursor = new Date();
  while (set.has(isoDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface MonthCell {
  date: Date;
  iso: string;
  dayNum: number;
  volume: number; // 0 if untrained that day
  isToday: boolean;
}

/** Full month grid (Monday-first weeks), with per-day volume for intensity
 * color-coding rather than a plain trained/untrained boolean. */
export function monthGrid(
  year: number,
  month: number,
  volumeByIsoDate: Record<string, number>
): (MonthCell | null)[] {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (MonthCell | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const iso = isoDay(date);
    cells.push({
      date,
      iso,
      dayNum: d,
      volume: volumeByIsoDate[iso] ?? 0,
      isToday: sameDay(date, new Date()),
    });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
