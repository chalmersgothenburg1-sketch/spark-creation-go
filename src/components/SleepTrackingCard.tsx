import { Card } from "@/components/ui/card";
import { Moon, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

// Generate detailed sleep data with 15-minute intervals
const generateSleepData = () => {
  const data = [];
  const startTime = new Date();
  startTime.setHours(22, 30, 0, 0); // Start at 10:30 PM
  
  const sleepStages = ['awake', 'light', 'deep', 'light', 'deep', 'deep', 'light', 'deep', 'deep', 'light', 'deep', 'light', 'light', 'awake', 'awake'];
  
  for (let i = 0; i < 35; i++) { // 35 intervals = ~8.75 hours
    const currentTime = new Date(startTime.getTime() + i * 15 * 60 * 1000); // 15-minute intervals
    const timeStr = currentTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    let stage;
    if (i < 2) stage = 'awake'; // First 30 minutes awake
    else if (i > 32) stage = 'awake'; // Last 30 minutes awake
    else {
      // Simulate realistic sleep pattern
      const cyclePosition = (i - 2) % 6;
      if (cyclePosition < 2) stage = 'light';
      else if (cyclePosition < 4) stage = 'deep';
      else stage = 'light';
    }
    
    data.push({
      time: timeStr,
      stage,
      value: stage === 'deep' ? 3 : stage === 'light' ? 2 : 1,
      displayTime: i % 8 === 0 ? timeStr : '' // Show time every 2 hours
    });
  }
  
  return data;
};

const sleepData = generateSleepData();

const getBarColor = (stage: string) => {
  switch (stage) {
    case "deep": return "#1e3a8a"; // Deep blue for deep sleep
    case "light": return "#3b82f6"; // Medium blue for light sleep  
    case "awake": return "#f8fafc"; // Light gray for awake
    default: return "#e5e7eb";
  }
};

export const SleepTrackingCard = () => {
  const totalSleep = sleepData.filter(d => d.stage !== "awake").length * 0.25; // 15-min intervals
  const deepSleep = sleepData.filter(d => d.stage === "deep").length * 0.25;
  const lightSleep = sleepData.filter(d => d.stage === "light").length * 0.25;
  
  const totalHours = Math.floor(totalSleep);
  const totalMinutes = Math.round((totalSleep - totalHours) * 60);
  
  const bedTime = sleepData[0]?.time || "10:30 PM";
  const wakeTime = sleepData[sleepData.length - 1]?.time || "7:15 AM";
  
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Time asleep</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-white">{totalHours}</span>
              <span className="text-lg text-slate-300">h</span>
              <span className="text-4xl font-light text-white ml-2">{totalMinutes}</span>
              <span className="text-lg text-slate-300">min</span>
            </div>
            <p className="text-sm text-slate-400 mt-2">
              Total duration {Math.floor(sleepData.length * 0.25)}h {Math.round(((sleepData.length * 0.25) % 1) * 60)}min
            </p>
          </div>
          <div className="text-slate-400">
            <Moon className="h-8 w-8" />
          </div>
        </div>

        {/* Sleep Pattern Chart */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600/50 mb-6">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={sleepData}
              margin={{ top: 5, right: 5, left: 5, bottom: 30 }}
            >
              <XAxis 
                dataKey="displayTime"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                interval={0}
              />
              <YAxis hide />
              <Bar 
                dataKey="value" 
                radius={[1, 1, 0, 0]}
                stroke="none"
              >
                {sleepData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.stage)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{Math.floor(deepSleep)}h {Math.round((deepSleep % 1) * 60)}m</p>
            <p className="text-xs text-slate-400">Deep Sleep</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{Math.floor(lightSleep)}h {Math.round((lightSleep % 1) * 60)}m</p>
            <p className="text-xs text-slate-400">Light Sleep</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{bedTime} - {wakeTime}</p>
            <p className="text-xs text-slate-400">Sleep Window</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-800"></div>
            <span className="text-slate-300">Deep Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-slate-300">Light Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-slate-200"></div>
            <span className="text-slate-300">Awake</span>
          </div>
        </div>

        {/* Sleep Score */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-500/30">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-300">Excellent Sleep Quality (92%)</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
    </Card>
  );
};