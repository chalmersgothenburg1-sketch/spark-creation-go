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
    case "deep": return "#6366f1"; // Indigo for deep sleep
    case "light": return "#8b5cf6"; // Purple for light sleep  
    case "awake": return "#e2e8f0"; // Light gray for awake
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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-lg transition-all duration-300 animate-fade-in">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-purple-700 mb-1">Time asleep</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-light text-purple-700">{totalHours}</span>
              <span className="text-lg text-purple-600">h</span>
              <span className="text-4xl font-light text-purple-700 ml-2">{totalMinutes}</span>
              <span className="text-lg text-purple-600">min</span>
            </div>
            <p className="text-sm text-purple-600/70 mt-2">
              Total duration {Math.floor(sleepData.length * 0.25)}h {Math.round(((sleepData.length * 0.25) % 1) * 60)}min
            </p>
          </div>
          <div className="text-purple-600">
            <Moon className="h-8 w-8" />
          </div>
        </div>

        {/* Sleep Pattern Chart */}
        <div className="bg-white/60 p-4 rounded-lg border border-purple-200/50 mb-6">
          <ResponsiveContainer width="100%" height={120}>
            <BarChart
              data={sleepData}
              margin={{ top: 5, right: 5, left: 5, bottom: 30 }}
            >
              <XAxis 
                dataKey="displayTime"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#7c3aed' }}
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
          <div className="text-center p-3 bg-white/60 rounded-lg border border-purple-200/50">
            <p className="text-lg font-semibold text-purple-700">{Math.floor(deepSleep)}h {Math.round((deepSleep % 1) * 60)}m</p>
            <p className="text-xs text-purple-600">Deep Sleep</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg border border-purple-200/50">
            <p className="text-lg font-semibold text-purple-700">{Math.floor(lightSleep)}h {Math.round((lightSleep % 1) * 60)}m</p>
            <p className="text-xs text-purple-600">Light Sleep</p>
          </div>
          <div className="text-center p-3 bg-white/60 rounded-lg border border-purple-200/50">
            <p className="text-lg font-semibold text-purple-700">{bedTime} - {wakeTime}</p>
            <p className="text-xs text-purple-600">Sleep Window</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-indigo-500"></div>
            <span className="text-purple-600">Deep Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-purple-500"></div>
            <span className="text-purple-600">Light Sleep</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-300"></div>
            <span className="text-purple-600">Awake</span>
          </div>
        </div>

        {/* Sleep Score */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Excellent Sleep Quality (92%)</span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-indigo-400"></div>
    </Card>
  );
};