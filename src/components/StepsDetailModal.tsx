import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';

const hourlyStepsData = [
  { hour: '6AM', steps: 120 },
  { hour: '7AM', steps: 890 },
  { hour: '8AM', steps: 1250 },
  { hour: '9AM', steps: 600 },
  { hour: '10AM', steps: 750 },
  { hour: '11AM', steps: 920 },
  { hour: '12PM', steps: 1100 },
  { hour: '1PM', steps: 650 },
  { hour: '2PM', steps: 800 },
  { hour: '3PM', steps: 1450 },
  { hour: '4PM', steps: 1200 },
  { hour: '5PM', steps: 950 },
  { hour: '6PM', steps: 730 },
  { hour: '7PM', steps: 420 },
  { hour: '8PM', steps: 310 },
];

const weeklyStepsData = [
  { day: 'Mon', steps: 8500, active: true },
  { day: 'Tue', steps: 9200, active: true },
  { day: 'Wed', steps: 7800, active: false },
  { day: 'Thu', steps: 10500, active: true },
  { day: 'Fri', steps: 11200, active: true },
  { day: 'Sat', steps: 6500, active: false },
  { day: 'Sun', steps: 9800, active: true },
];

const monthlyStepsData = [
  { day: '1', steps: 8500 }, { day: '2', steps: 9200 }, { day: '3', steps: 7800 },
  { day: '4', steps: 10500 }, { day: '5', steps: 11200 }, { day: '6', steps: 6500 },
  { day: '7', steps: 9800 }, { day: '8', steps: 8900 }, { day: '9', steps: 10200 },
  { day: '10', steps: 9500 }, { day: '11', steps: 8800 }, { day: '12', steps: 11000 },
  { day: '13', steps: 9200 }, { day: '14', steps: 8100 }, { day: '15', steps: 10800 },
  { day: '16', steps: 9600 }, { day: '17', steps: 8400 }, { day: '18', steps: 11500 },
  { day: '19', steps: 9900 }, { day: '20', steps: 8700 }, { day: '21', steps: 10300 },
  { day: '22', steps: 9100 }, { day: '23', steps: 8600 }, { day: '24', steps: 10700 },
  { day: '25', steps: 9400 }, { day: '26', steps: 8900 }, { day: '27', steps: 11200 },
  { day: '28', steps: 9800 }, { day: '29', steps: 8500 }, { day: '30', steps: 10600 },
];

interface StepsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StepsDetailModal: React.FC<StepsDetailModalProps> = ({ isOpen, onClose }) => {
  const [activeView, setActiveView] = useState<'hourly' | 'weekly' | 'monthly'>('hourly');

  const getCurrentData = () => {
    switch (activeView) {
      case 'hourly':
        return hourlyStepsData;
      case 'weekly':
        return weeklyStepsData;
      case 'monthly':
        return monthlyStepsData;
      default:
        return hourlyStepsData;
    }
  };

  const getDataKey = () => {
    switch (activeView) {
      case 'hourly':
        return 'hour';
      case 'weekly':
        return 'day';
      case 'monthly':
        return 'day';
      default:
        return 'hour';
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case 'hourly':
        return 'Today\'s Hourly Steps';
      case 'weekly':
        return 'This Week\'s Daily Steps';
      case 'monthly':
        return 'This Month\'s Daily Steps';
      default:
        return 'Steps Data';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Steps Analysis
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
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">{getTitle()}</h3>
            <ResponsiveContainer width="100%" height={400}>
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
                <Bar 
                  dataKey="steps" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {getCurrentData().reduce((sum, item) => sum + item.steps, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Steps</p>
            </div>
            
            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(getCurrentData().reduce((sum, item) => sum + item.steps, 0) / getCurrentData().length).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Average</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.max(...getCurrentData().map(item => item.steps)).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Peak</p>
            </div>

            <div className="bg-background border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {activeView === 'weekly' 
                  ? `${(getCurrentData() as any[]).filter(item => item.active).length}/7`
                  : getCurrentData().length
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {activeView === 'weekly' ? 'Active Days' : 'Data Points'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};