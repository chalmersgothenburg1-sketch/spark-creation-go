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
    <Card className="group relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 border border-violet-200/60 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-500 animate-fade-in hover-scale">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-transparent to-indigo-100/30"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-purple-200/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-radial from-violet-200/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Moon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-violet-800 tracking-tight">Sleep Quality</h3>
                <p className="text-sm text-violet-600/70">Last night's analysis</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-5xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">{totalHours}</span>
              <span className="text-lg font-medium text-violet-600 mb-1">h</span>
              <span className="text-5xl font-bold bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent ml-1">{totalMinutes}</span>
              <span className="text-lg font-medium text-violet-600 mb-1">min</span>
            </div>
            <p className="text-sm text-violet-600/80 mt-2 font-medium">
              Total duration {Math.floor(sleepData.length * 0.25)}h {Math.round(((sleepData.length * 0.25) % 1) * 60)}min
            </p>
          </div>
        </div>

        {/* Sleep Pattern Chart */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-violet-200/50 shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300">
          <h4 className="text-sm font-semibold text-violet-700 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            Sleep Pattern Timeline
          </h4>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart
              data={sleepData}
              margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
            >
              <XAxis 
                dataKey="displayTime"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#7c3aed', fontWeight: 500 }}
                interval={0}
              />
              <YAxis hide />
              <Bar 
                dataKey="value" 
                radius={[2, 2, 0, 0]}
                stroke="none"
              >
                {sleepData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.stage)}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl border border-indigo-200/50 hover:shadow-md transition-all duration-300 hover-scale">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <p className="text-lg font-bold text-indigo-700">{Math.floor(deepSleep)}h {Math.round((deepSleep % 1) * 60)}m</p>
            <p className="text-xs text-indigo-600 font-medium">Deep Sleep</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 hover:shadow-md transition-all duration-300 hover-scale">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full opacity-70"></div>
            </div>
            <p className="text-lg font-bold text-purple-700">{Math.floor(lightSleep)}h {Math.round((lightSleep % 1) * 60)}m</p>
            <p className="text-xs text-purple-600 font-medium">Light Sleep</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border border-violet-200/50 hover:shadow-md transition-all duration-300 hover-scale">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <p className="text-lg font-bold text-violet-700">{bedTime}</p>
            <p className="text-xs text-violet-600 font-medium">Sleep Window</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 text-xs mb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-md group-hover:scale-110 transition-transform"></div>
            <span className="text-violet-700 font-medium">Deep Sleep</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-md group-hover:scale-110 transition-transform"></div>
            <span className="text-violet-700 font-medium">Light Sleep</span>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-gray-300 to-gray-400 shadow-md group-hover:scale-110 transition-transform"></div>
            <span className="text-violet-700 font-medium">Awake</span>
          </div>
        </div>

        {/* Sleep Score */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-3 rounded-full border border-emerald-200/70 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
              <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-75"></div>
            </div>
            <span className="text-sm font-bold text-emerald-800">Excellent Sleep Quality</span>
            <span className="text-lg font-bold text-emerald-700">92%</span>
          </div>
        </div>
      </div>
      
      {/* Enhanced bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 shadow-lg"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-violet-400/5 via-purple-400/5 to-indigo-400/5 pointer-events-none"></div>
    </Card>
  );
};