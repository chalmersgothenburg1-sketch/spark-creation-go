import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";

const bpData3Days = [
  { time: "Day 1", systolic: 118, diastolic: 78 },
  { time: "Day 2", systolic: 122, diastolic: 80 },
  { time: "Day 3", systolic: 120, diastolic: 79 },
];

const bpData7Days = [
  { time: "Mon", systolic: 120, diastolic: 80 },
  { time: "Tue", systolic: 118, diastolic: 78 },
  { time: "Wed", systolic: 125, diastolic: 82 },
  { time: "Thu", systolic: 119, diastolic: 79 },
  { time: "Fri", systolic: 122, diastolic: 81 },
  { time: "Sat", systolic: 117, diastolic: 77 },
  { time: "Sun", systolic: 121, diastolic: 80 },
];

const bpData30Days = [
  { time: "Week 1", systolic: 120, diastolic: 80 },
  { time: "Week 2", systolic: 118, diastolic: 78 },
  { time: "Week 3", systolic: 122, diastolic: 81 },
  { time: "Week 4", systolic: 119, diastolic: 79 },
];

interface BloodPressureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BloodPressureDetailModal = ({ isOpen, onClose }: BloodPressureDetailModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"3days" | "7days" | "30days">("7days");

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case "3days":
        return bpData3Days;
      case "7days":
        return bpData7Days;
      case "30days":
        return bpData30Days;
      default:
        return bpData7Days;
    }
  };

  const getAverageBP = () => {
    const data = getCurrentData();
    const avgSystolic = Math.round(data.reduce((sum, item) => sum + item.systolic, 0) / data.length);
    const avgDiastolic = Math.round(data.reduce((sum, item) => sum + item.diastolic, 0) / data.length);
    return { systolic: avgSystolic, diastolic: avgDiastolic };
  };

  const getBPStatus = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "text-green-700" };
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "text-yellow-700" };
    if (systolic < 140 && diastolic < 90) return { status: "Stage 1", color: "text-orange-700" };
    return { status: "Stage 2", color: "text-red-700" };
  };

  const avgBP = getAverageBP();
  const currentStatus = getBPStatus(120, 80);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-orange-600" />
            Blood Pressure Details
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
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-600 font-medium">Current</p>
              <p className="text-2xl font-bold text-orange-700">120/80</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium">Average</p>
              <p className="text-2xl font-bold text-blue-700">{avgBP.systolic}/{avgBP.diastolic}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-600 font-medium">Status</p>
              <p className={`text-lg font-semibold ${currentStatus.color}`}>{currentStatus.status}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
            <h3 className="text-lg font-semibold mb-4 text-orange-700">
              Blood Pressure Trends - {selectedPeriod === "3days" ? "Last 3 Days" : selectedPeriod === "7days" ? "Last 7 Days" : "Last 30 Days"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getCurrentData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis domain={[70, 140]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ea580c',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#ea580c" 
                  strokeWidth={3}
                  name="Systolic"
                  dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#ea580c', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Diastolic"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Health Insights */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-700 mb-2">Health Insights</h4>
            <ul className="text-sm text-orange-600 space-y-1">
              <li>• Your blood pressure is within normal range</li>
              <li>• Maintain a healthy diet with reduced sodium intake</li>
              <li>• Regular exercise helps maintain optimal blood pressure</li>
              <li>• Monitor readings regularly for early detection of changes</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};