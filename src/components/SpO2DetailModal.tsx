import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Heart, TrendingUp, Calendar, BarChart3 } from "lucide-react";

interface SpO2DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dailyData = [
  { time: "6:00", spo2: 98 },
  { time: "9:00", spo2: 97 },
  { time: "12:00", spo2: 98 },
  { time: "15:00", spo2: 99 },
  { time: "18:00", spo2: 97 },
  { time: "21:00", spo2: 98 },
];

const weeklyData = [
  { day: "Mon", spo2: 98, average: 97.8 },
  { day: "Tue", spo2: 97, average: 97.5 },
  { day: "Wed", spo2: 99, average: 98.2 },
  { day: "Thu", spo2: 98, average: 98.0 },
  { day: "Fri", spo2: 97, average: 97.6 },
  { day: "Sat", spo2: 98, average: 98.1 },
  { day: "Sun", spo2: 99, average: 98.3 },
];

const monthlyData = [
  { week: "Week 1", spo2: 98.2 },
  { week: "Week 2", spo2: 97.8 },
  { week: "Week 3", spo2: 98.5 },
  { week: "Week 4", spo2: 98.1 },
];

export const SpO2DetailModal = ({ isOpen, onClose }: SpO2DetailModalProps) => {
  const [activeTab, setActiveTab] = useState("day");

  const renderChart = () => {
    switch (activeTab) {
      case "day":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis domain={[95, 100]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="spo2" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "week":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[95, 100]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="spo2" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "month":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis domain={[96, 100]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="spo2" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="h-6 w-6 text-blue-600" />
            Blood Oxygen (SpO2) Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-700">Current</span>
              </div>
              <div className="text-2xl font-bold text-blue-800">98%</div>
              <div className="text-sm text-blue-600">Normal Range</div>
            </Card>
            
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">Average</span>
              </div>
              <div className="text-2xl font-bold text-green-800">97.8%</div>
              <div className="text-sm text-green-600">Last 7 days</div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-700">Trend</span>
              </div>
              <div className="text-2xl font-bold text-purple-800">Stable</div>
              <div className="text-sm text-purple-600">Within normal range</div>
            </Card>
          </div>

          {/* Chart with Tabs */}
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">SpO2 Trends</h3>
                <TabsList>
                  <TabsTrigger value="day" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="week" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Month
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="day" className="mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Today's SpO2 Levels</h4>
                  <p className="text-sm text-muted-foreground">Hourly blood oxygen saturation readings</p>
                  {renderChart()}
                </div>
              </TabsContent>

              <TabsContent value="week" className="mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Weekly SpO2 Summary</h4>
                  <p className="text-sm text-muted-foreground">Daily average blood oxygen levels</p>
                  {renderChart()}
                </div>
              </TabsContent>

              <TabsContent value="month" className="mt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-700">Monthly SpO2 Overview</h4>
                  <p className="text-sm text-muted-foreground">Weekly average blood oxygen trends</p>
                  {renderChart()}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Health Insights */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <h3 className="font-semibold mb-4 text-blue-800">Health Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-green-700">Excellent Oxygen Levels</p>
                  <p className="text-sm text-muted-foreground">Your SpO2 levels are consistently within the healthy range of 95-100%</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-blue-700">Stable Readings</p>
                  <p className="text-sm text-muted-foreground">Your readings show good stability with minimal fluctuation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-purple-700">Continue Monitoring</p>
                  <p className="text-sm text-muted-foreground">Keep tracking your levels, especially during activity or illness</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};