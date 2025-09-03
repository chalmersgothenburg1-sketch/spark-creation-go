// customer dashboard
export interface SleepPatternEntry {
  time: string;           // e.g. "9 PM"
  status: "awake" | "light" | "deep";
  duration: number;       // in hours, usually 1
}

export interface SleepMetrics {
  duration: number;                   // total sleep hours
  deep_sleep: number;                 // deep sleep hours
  light_sleep: number;                // light sleep hours
  sleep_quality_score: number;        // quality percent 0-100
  sleep_pattern_timeline: SleepPatternEntry[];  // hourly timeline array
  sleep_quality_text: string;          // friendly summary text
  sleep_period: Array<{ start: string; end: string }>;  // detailed periods, timestamps as string
}
export interface CalorieTrendEntry {
  day: string;      // day label, e.g., "Mon"
  calories: number;  // calories burned on that day
}
export interface DashboardData {
  latest_bp_systolic: number;
  latest_bp_diastolic: number;
  latest_o2: number;
  latest_battery: number;
  latest_latitude: number;
  latest_longitude: number;
  total_steps: number;
  calories_burned: number;
  calories_burned_active: number,
  calories_burned_resting: number,
  calories_burned_trend7d: CalorieTrendEntry[],
  heartrate: number;
  stress: string;
  sleep_quality: SleepMetrics;
}

