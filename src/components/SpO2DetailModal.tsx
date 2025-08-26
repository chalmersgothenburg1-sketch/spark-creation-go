import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const spO2Data3Days = [
  { time: "Day 1", morning: 98, afternoon: 97, evening: 98 },
  { time: "Day 2", morning: 99, afternoon: 98, evening: 97 },
  { time: "Day 3", morning: 98, afternoon: 98, evening: 99 },
];

const spO2Data7Days = [
  { time: "Mon", value: 98 },
  { time: "Tue", value: 97 },
  { time: "Wed", value: 99 },
  { time: "Thu", value: 98 },
  { time: "Fri", value: 98 },
  { time: "Sat", value: 97 },
  { time: "Sun", value: 98 },
];

const spO2Data30Days = [
  { time: "Week 1", value: 98 },
  { time: "Week 2", value: 97 },
  { time: "Week 3", value: 98 },
  { time: "Week 4", value: 99 },
];

interface SpO2DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpO2DetailModal = ({ isOpen, onClose }: SpO2DetailModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"3days" | "7days" | "30days">("7days");

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "3days":
        return spO2Data3Days.map(day => ({ time: day.time, value: day.morning }));
      case "7days":
        return spO2Data7Days;
      case "30days":
        return spO2Data30Days;
      default:
        return spO2Data7Days;
    }
  };

  const getAverageSpO2 = () => {
    const data = getCurrentData();
    const average = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    return Math.round(average);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-600" />
            SpO2 (Oxygen Saturation) Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Period Selection */}
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "3days" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("3days")}
            >
              3 Days
            </Button>
            <Button
              variant={selectedPeriod === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("7days")}
            >
              7 Days
            </Button>
            <Button
              variant={selectedPeriod === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("30days")}
            >
              30 Days
            </Button>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-sm text-cyan-600 font-medium">Current</p>
              <p className="text-2xl font-bold text-cyan-700">98%</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Average</p>
              <p className="text-2xl font-bold text-green-700">{getAverageSpO2()}%</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Status</p>
              <p className="text-lg font-semibold text-blue-700">Excellent</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 p-6 rounded-lg border border-cyan-200">
            <h3 className="text-lg font-semibold mb-4 text-cyan-700">
              SpO2 Trends - {selectedPeriod === "3days" ? "Last 3 Days" : selectedPeriod === "7days" ? "Last 7 Days" : "Last 30 Days"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis domain={[95, 100]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #0891b2',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0891b2" 
                  strokeWidth={3}
                  dot={{ fill: '#0891b2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#0891b2', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Health Insights */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200">
            <h4 className="font-semibold text-cyan-700 mb-2">Health Insights</h4>
            <ul className="text-sm text-cyan-600 space-y-1">
              <li>• Your oxygen saturation is excellent and within normal range (95-100%)</li>
              <li>• Consistent readings indicate good respiratory health</li>
              <li>• Continue regular physical activity to maintain optimal levels</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};