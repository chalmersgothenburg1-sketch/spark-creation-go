import { Card } from "@/components/ui/card";
import { Moon, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface SleepPatternEntry {
  time: string;
  status: "awake" | "light" | "deep";
  duration: number;
}
interface SleepMetrics {
  duration: number;                  // total sleep hours
  deep_sleep: number;
  light_sleep: number;
  sleep_quality_score: number;      // e.g., 85
  sleep_pattern_timeline: SleepPatternEntry[];
  sleep_quality_text: string;       // e.g., "Good Sleep Quality (85%)"
}

interface SleepTrackingCardProps {
  data: SleepMetrics | null;
}

const sleepData = [
  { time: "9 PM", status: "awake", duration: 1 },
  { time: "10 PM", status: "light", duration: 1 },
  { time: "11 PM", status: "deep", duration: 1 },
  { time: "12 AM", status: "deep", duration: 1 },
  { time: "1 AM", status: "deep", duration: 1 },
  { time: "2 AM", status: "light", duration: 1 },
  { time: "3 AM", status: "deep", duration: 1 },
  { time: "4 AM", status: "deep", duration: 1 },
  { time: "5 AM", status: "light", duration: 1 },
  { time: "6 AM", status: "awake", duration: 1 },
  { time: "7 AM", status: "awake", duration: 1 },
];

const getBarColor = (status: string) => {
  switch (status) {
    case "deep": return "#1e40af"; // Deep blue for deep sleep
    case "light": return "#60a5fa"; // Light blue for light sleep
    case "awake": return "#fbbf24"; // Yellow for awake
    default: return "#e5e7eb";
  }
};

export const SleepTrackingCard = ({data} : SleepTrackingCardProps) => {
  const totalSleep = data?.duration && !isNaN(data.duration) ? Math.floor(data.duration) : 0;
  const deepSleep = data?.deep_sleep && !isNaN(data.deep_sleep) ? Math.floor(data.deep_sleep) : 0;
  const lightSleep = data?.light_sleep && !isNaN(data.light_sleep) ? Math.floor(data.light_sleep) : 0;
  
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Moon className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-700">Sleep Quality</h3>
              <p className="text-sm text-indigo-600/70">Last night's sleep pattern</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">
              {totalSleep && !isNaN(totalSleep) ? 
              (`${Math.floor(totalSleep)}h ${Math.round((totalSleep % 1) * 60)}m`) : 
              ("0h 0m")}
            </span>
          </div>
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-white/60 rounded-lg border border-indigo-200/50">
            <p className="text-2xl font-bold text-indigo-700">{totalSleep}h</p>
            <p className="text-xs text-indigo-600">Total Sleep</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg border border-indigo-200/50">
            <p className="text-2xl font-bold text-blue-700">{deepSleep}h</p>
            <p className="text-xs text-blue-600">Deep Sleep</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg border border-indigo-200/50">
            <p className="text-2xl font-bold text-sky-700">{lightSleep}h</p>
            <p className="text-xs text-sky-600">Light Sleep</p>
          </div>
        </div>

        {/* Horizontal Sleep Chart */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-indigo-700 mb-3">Sleep Pattern Timeline</h4>
          <div className="bg-white/60 p-4 rounded-lg border border-indigo-200/50">
            <ResponsiveContainer width="100%" height={80}>
              <BarChart
                data={data?.sleep_pattern_timeline ?? []}
                layout="horizontal"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="time" 
                  tick={{ fontSize: 10 }}
                  width={50}
                />
                <Bar dataKey="duration" radius={[0, 2, 2, 0]}>
                  {(data?.sleep_pattern_timeline ?? []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-700"></div>
            <span className="text-indigo-600">Deep Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-400"></div>
            <span className="text-indigo-600">Light Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400"></div>
            <span className="text-indigo-600">Awake</span>
          </div>
        </div>

        {/* Sleep Score */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">{data?.sleep_quality_text ?? "Sleep Quality Unavailable"}</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
    </Card>
  );
};