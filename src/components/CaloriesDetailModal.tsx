import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Flame, TrendingUp } from 'lucide-react';

const hourlyCaloriesData = [
  { time: '6AM', calories: 45, active: 15, resting: 30 },
  { time: '7AM', calories: 120, active: 95, resting: 25 },
  { time: '8AM', calories: 150, active: 125, resting: 25 },
  { time: '9AM', calories: 80, active: 55, resting: 25 },
  { time: '10AM', calories: 95, active: 70, resting: 25 },
  { time: '11AM', calories: 110, active: 85, resting: 25 },
  { time: '12PM', calories: 140, active: 115, resting: 25 },
  { time: '1PM', calories: 85, active: 60, resting: 25 },
  { time: '2PM', calories: 100, active: 75, resting: 25 },
  { time: '3PM', calories: 180, active: 155, resting: 25 },
  { time: '4PM', calories: 160, active: 135, resting: 25 },
  { time: '5PM', calories: 120, active: 95, resting: 25 },
  { time: '6PM', calories: 90, active: 65, resting: 25 },
  { time: '7PM', calories: 70, active: 45, resting: 25 },
  { time: '8PM', calories: 55, active: 30, resting: 25 },
];

const weeklyCaloriesData = [
  { day: 'Mon', calories: 1850, active: 540, resting: 1310 },
  { day: 'Tue', calories: 2100, active: 680, resting: 1420 },
  { day: 'Wed', calories: 1650, active: 420, resting: 1230 },
  { day: 'Thu', calories: 2250, active: 750, resting: 1500 },
  { day: 'Fri', calories: 1950, active: 580, resting: 1370 },
  { day: 'Sat', calories: 1480, active: 320, resting: 1160 },
  { day: 'Sun', calories: 1920, active: 610, resting: 1310 },
];

const monthlyCaloriesData = [
  { day: '1', calories: 1850 }, { day: '2', calories: 2100 }, { day: '3', calories: 1650 },
  { day: '4', calories: 2250 }, { day: '5', calories: 1950 }, { day: '6', calories: 1480 },
  { day: '7', calories: 1920 }, { day: '8', calories: 1780 }, { day: '9', calories: 2050 },
  { day: '10', calories: 1890 }, { day: '11', calories: 1720 }, { day: '12', calories: 2200 },
  { day: '13', calories: 1840 }, { day: '14', calories: 1620 }, { day: '15', calories: 2180 },
  { day: '16', calories: 1960 }, { day: '17', calories: 1580 }, { day: '18', calories: 2300 },
  { day: '19', calories: 1990 }, { day: '20', calories: 1740 }, { day: '21', calories: 2060 },
  { day: '22', calories: 1820 }, { day: '23', calories: 1690 }, { day: '24', calories: 2140 },
  { day: '25', calories: 1880 }, { day: '26', calories: 1560 }, { day: '27', calories: 2240 },
  { day: '28', calories: 1960 }, { day: '29', calories: 1700 }, { day: '30', calories: 2120 },
];

const calorieBreakdown = [
  { name: 'Active Calories', value: 540, color: '#ef4444' },
  { name: 'Resting Calories', value: 1391, color: '#10b981' },
];

interface CaloriesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CaloriesDetailModal: React.FC<CaloriesDetailModalProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'hourly' | 'weekly' | 'monthly'>('hourly');

  const getCurrentData = () => {
    switch (activeView) {
      case 'hourly':
        return hourlyCaloriesData;
      case 'weekly':
        return weeklyCaloriesData;
      case 'monthly':
        return monthlyCaloriesData;
      default:
        return hourlyCaloriesData;
    }
  };

  const getDataKey = () => {
    switch (activeView) {
      case 'hourly':
        return 'time';
      case 'weekly':
        return 'day';
      case 'monthly':
        return 'day';
      default:
        return 'time';
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'hourly':
        return 'Today\'s Hourly Calories';
      case 'weekly':
        return 'This Week\'s Daily Calories';
      case 'monthly':
        return 'This Month\'s Daily Calories';
      default:
        return 'Calories Data';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Calories Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* View Toggle Buttons */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={activeView === 'hourly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('hourly')}
              className="flex-1"
            >
              Today
            </Button>
            <Button
              variant={activeView === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('weekly')}
              className="flex-1"
            >
              This Week
            </Button>
            <Button
              variant={activeView === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveView('monthly')}
              className="flex-1"
            >
              This Month
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-700">{getTitle()}</h3>
              <ResponsiveContainer width="100%" height={400}>
                {activeView === 'hourly' || activeView === 'weekly' ? (
                  <BarChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                    <XAxis 
                      dataKey={getDataKey()} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} />
                    {(activeView === 'hourly' || activeView === 'weekly') && (
                      <>
                        <Bar dataKey="active" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="resting" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </>
                    )}
                  </BarChart>
                ) : (
                  <LineChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                    <XAxis 
                      dataKey={getDataKey()} 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 4 }}
                      activeDot={{ r: 6, fill: '#f97316' }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Calories Breakdown (for hourly view) */}
            {activeView === 'hourly' && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-700">Today's Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={calorieBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {calorieBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {calorieBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weekly/Monthly Summary */}
            {(activeView === 'weekly' || activeView === 'monthly') && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-700">
                  {activeView === 'weekly' ? 'Weekly Summary' : 'Monthly Summary'}
                </h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-700">
                      {getCurrentData().reduce((sum: number, item: any) => sum + item.calories, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600">Total Calories</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round(getCurrentData().reduce((sum: number, item: any) => sum + item.calories, 0) / getCurrentData().length).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Daily Average</p>
                  </div>
                  {activeView === 'weekly' && (
                    <>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">
                          {(getCurrentData() as any[]).reduce((sum, item) => sum + (item.active || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Active Calories</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-500">
                          {(getCurrentData() as any[]).reduce((sum, item) => sum + (item.resting || 0), 0)}
                        </p>
                        <p className="text-sm text-muted-foreground">Resting Calories</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {getCurrentData().reduce((sum: number, item: any) => sum + item.calories, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Calories</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(getCurrentData().reduce((sum: number, item: any) => sum + item.calories, 0) / getCurrentData().length).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {Math.max(...getCurrentData().map((item: any) => item.calories)).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Peak Day</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {activeView === 'hourly' 
                  ? `${(getCurrentData() as any[]).filter(item => item.calories > 100).length}h`
                  : `${getCurrentData().length}d`
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {activeView === 'hourly' ? 'Active Hours' : 'Days Tracked'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};