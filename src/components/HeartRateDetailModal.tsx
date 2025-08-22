import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Heart, Activity } from 'lucide-react';

const hourlyHeartRateData = [
  { time: '6AM', heartRate: 68, zone: 'Resting' },
  { time: '7AM', heartRate: 82, zone: 'Fat Burn' },
  { time: '8AM', heartRate: 95, zone: 'Cardio' },
  { time: '9AM', heartRate: 75, zone: 'Fat Burn' },
  { time: '10AM', heartRate: 78, zone: 'Fat Burn' },
  { time: '11AM', heartRate: 88, zone: 'Cardio' },
  { time: '12PM', heartRate: 72, zone: 'Fat Burn' },
  { time: '1PM', heartRate: 70, zone: 'Resting' },
  { time: '2PM', heartRate: 85, zone: 'Cardio' },
  { time: '3PM', heartRate: 102, zone: 'Peak' },
  { time: '4PM', heartRate: 92, zone: 'Cardio' },
  { time: '5PM', heartRate: 80, zone: 'Fat Burn' },
  { time: '6PM', heartRate: 74, zone: 'Fat Burn' },
  { time: '7PM', heartRate: 69, zone: 'Resting' },
  { time: '8PM', heartRate: 66, zone: 'Resting' },
];

const weeklyHeartRateData = [
  { day: 'Mon', avgHeartRate: 78, maxHeartRate: 142, restingHeartRate: 65 },
  { day: 'Tue', avgHeartRate: 82, maxHeartRate: 158, restingHeartRate: 67 },
  { day: 'Wed', avgHeartRate: 75, maxHeartRate: 135, restingHeartRate: 64 },
  { day: 'Thu', avgHeartRate: 85, maxHeartRate: 162, restingHeartRate: 68 },
  { day: 'Fri', avgHeartRate: 79, maxHeartRate: 145, restingHeartRate: 66 },
  { day: 'Sat', avgHeartRate: 73, maxHeartRate: 128, restingHeartRate: 63 },
  { day: 'Sun', avgHeartRate: 77, maxHeartRate: 140, restingHeartRate: 65 },
];

const monthlyHeartRateData = [
  { day: '1', avgHeartRate: 78 }, { day: '2', avgHeartRate: 82 }, { day: '3', avgHeartRate: 75 },
  { day: '4', avgHeartRate: 85 }, { day: '5', avgHeartRate: 79 }, { day: '6', avgHeartRate: 73 },
  { day: '7', avgHeartRate: 77 }, { day: '8', avgHeartRate: 80 }, { day: '9', avgHeartRate: 76 },
  { day: '10', avgHeartRate: 84 }, { day: '11', avgHeartRate: 81 }, { day: '12', avgHeartRate: 78 },
  { day: '13', avgHeartRate: 83 }, { day: '14', avgHeartRate: 72 }, { day: '15', avgHeartRate: 79 },
  { day: '16', avgHeartRate: 77 }, { day: '17', avgHeartRate: 86 }, { day: '18', avgHeartRate: 74 },
  { day: '19', avgHeartRate: 82 }, { day: '20', avgHeartRate: 75 }, { day: '21', avgHeartRate: 88 },
  { day: '22', avgHeartRate: 76 }, { day: '23', avgHeartRate: 81 }, { day: '24', avgHeartRate: 79 },
  { day: '25', avgHeartRate: 84 }, { day: '26', avgHeartRate: 73 }, { day: '27', avgHeartRate: 87 },
  { day: '28', avgHeartRate: 78 }, { day: '29', avgHeartRate: 80 }, { day: '30', avgHeartRate: 76 },
];

interface HeartRateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeartRateDetailModal: React.FC<HeartRateDetailModalProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'hourly' | 'weekly' | 'monthly'>('hourly');

  const getCurrentData = () => {
    switch (activeView) {
      case 'hourly':
        return hourlyHeartRateData;
      case 'weekly':
        return weeklyHeartRateData;
      case 'monthly':
        return monthlyHeartRateData;
      default:
        return hourlyHeartRateData;
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

  const getHeartRateKey = () => {
    switch (activeView) {
      case 'hourly':
        return 'heartRate';
      case 'weekly':
        return 'avgHeartRate';
      case 'monthly':
        return 'avgHeartRate';
      default:
        return 'heartRate';
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'hourly':
        return 'Today\'s Heart Rate Zones';
      case 'weekly':
        return 'This Week\'s Heart Rate Trends';
      case 'monthly':
        return 'This Month\'s Heart Rate Average';
      default:
        return 'Heart Rate Data';
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'Resting': return '#10b981';
      case 'Fat Burn': return '#f59e0b';
      case 'Cardio': return '#ef4444';
      case 'Peak': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Heart Rate Analysis
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

          {/* Chart */}
          <div className="bg-gradient-to-br from-red-50 to-rose-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-700">{getTitle()}</h3>
            <ResponsiveContainer width="100%" height={400}>
              {activeView === 'hourly' ? (
                <AreaChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <XAxis 
                    dataKey={getDataKey()} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value} BPM (${props.payload.zone})`,
                      'Heart Rate'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={getHeartRateKey()} 
                    stroke="#dc2626" 
                    fill="url(#heartRateGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : (
                <LineChart data={getCurrentData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <XAxis 
                    dataKey={getDataKey()} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    domain={['dataMin - 5', 'dataMax + 5']}
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
                    dataKey={getHeartRateKey()} 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    dot={{ fill: '#dc2626', r: 4 }}
                    activeDot={{ r: 6, fill: '#dc2626' }}
                  />
                  {activeView === 'weekly' && (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="maxHeartRate" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f97316', r: 3 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="restingHeartRate" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#10b981', r: 3 }}
                      />
                    </>
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Heart Rate Zones (for hourly view) */}
          {activeView === 'hourly' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border rounded-lg p-4 text-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-green-700">Resting</p>
                <p className="text-xs text-muted-foreground">50-100 BPM</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4 text-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-yellow-700">Fat Burn</p>
                <p className="text-xs text-muted-foreground">100-120 BPM</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4 text-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-red-700">Cardio</p>
                <p className="text-xs text-muted-foreground">120-140 BPM</p>
              </div>
              <div className="bg-background border border-border rounded-lg p-4 text-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mx-auto mb-2"></div>
                <p className="text-sm font-medium text-purple-700">Peak</p>
                <p className="text-xs text-muted-foreground">140+ BPM</p>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {Math.round(getCurrentData().reduce((sum: number, item: any) => sum + item[getHeartRateKey()], 0) / getCurrentData().length)}
              </p>
              <p className="text-sm text-muted-foreground">Avg BPM</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...getCurrentData().map((item: any) => item[getHeartRateKey()]))}
              </p>
              <p className="text-sm text-muted-foreground">Max BPM</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.min(...getCurrentData().map((item: any) => item[getHeartRateKey()]))}
              </p>
              <p className="text-sm text-muted-foreground">Min BPM</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {activeView === 'hourly' 
                  ? `${(getCurrentData() as any[]).filter(item => item.zone === 'Cardio' || item.zone === 'Peak').length}h`
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