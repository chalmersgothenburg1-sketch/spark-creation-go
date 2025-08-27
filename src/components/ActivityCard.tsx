import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Activity, Clock, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ActivityData {
  time: string;
  hour: number;
  activityLevel: 'rest' | 'light' | 'moderate' | 'very_active';
  value: number;
}

interface ActivityCardProps {
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ className }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'1d' | '3d' | '7d' | '30d'>('7d');

  // Sample data for different activity levels throughout the day
  const generateActivityData = (days: number): ActivityData[] => {
    const data: ActivityData[] = [];
    const activityLevels = ['rest', 'light', 'moderate', 'very_active'] as const;
    
    for (let day = 0; day < days; day++) {
      for (let hour = 0; hour < 24; hour++) {
        const timeLabel = days === 1 ? `${hour}:00` : `Day ${day + 1} ${hour}:00`;
        let activityLevel: 'rest' | 'light' | 'moderate' | 'very_active';
        let value: number;

        // Simulate realistic activity patterns
        if (hour >= 23 || hour <= 6) {
          activityLevel = 'rest';
          value = Math.random() * 20;
        } else if (hour >= 7 && hour <= 9) {
          activityLevel = Math.random() > 0.5 ? 'moderate' : 'light';
          value = 40 + Math.random() * 40;
        } else if (hour >= 12 && hour <= 14) {
          activityLevel = Math.random() > 0.3 ? 'light' : 'moderate';
          value = 30 + Math.random() * 50;
        } else if (hour >= 17 && hour <= 19) {
          activityLevel = Math.random() > 0.4 ? 'moderate' : 'very_active';
          value = 60 + Math.random() * 40;
        } else {
          activityLevel = activityLevels[Math.floor(Math.random() * 3)];
          value = 20 + Math.random() * 60;
        }

        data.push({
          time: timeLabel,
          hour,
          activityLevel,
          value
        });
      }
    }
    return data;
  };

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case '1d': return generateActivityData(1);
      case '3d': return generateActivityData(3);
      case '7d': return generateActivityData(7);
      case '30d': return generateActivityData(30);
      default: return generateActivityData(7);
    }
  };

  // Calculate proportions for pie chart
  const calculateProportions = (data: ActivityData[]) => {
    const counts = { rest: 0, light: 0, moderate: 0, very_active: 0 };
    data.forEach(item => counts[item.activityLevel]++);
    
    const total = data.length;
    return [
      { name: 'Rest', value: counts.rest, percentage: Math.round((counts.rest / total) * 100), color: '#8b5cf6' },
      { name: 'Light Activity', value: counts.light, percentage: Math.round((counts.light / total) * 100), color: '#06b6d4' },
      { name: 'Moderate', value: counts.moderate, percentage: Math.round((counts.moderate / total) * 100), color: '#10b981' },
      { name: 'Very Active', value: counts.very_active, percentage: Math.round((counts.very_active / total) * 100), color: '#f59e0b' }
    ];
  };

  const currentData = getCurrentData();
  const proportionData = calculateProportions(currentData);

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'rest': return '#8b5cf6';
      case 'light': return '#06b6d4';
      case 'moderate': return '#10b981';
      case 'very_active': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  // Create timeline data for area chart
  const timelineData = selectedPeriod === '1d' 
    ? currentData 
    : selectedPeriod === '3d' || selectedPeriod === '7d' 
    ? currentData.filter((_, index) => index % (selectedPeriod === '3d' ? 2 : 4) === 0)
    : currentData.filter((_, index) => index % 12 === 0);

  return (
    <Card className={`p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-700">Daily Activity</h3>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-1 bg-white/50 rounded-lg p-1">
          {(['1d', '3d', '7d', '30d'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={`text-xs ${
                selectedPeriod === period 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              {period === '1d' ? '1 Day' : period === '3d' ? '3 Days' : period === '7d' ? '7 Days' : '30 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Activity Timeline
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }} 
              interval={selectedPeriod === '30d' ? 5 : 2}
            />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any, name: any, props: any) => [
                `${value}%`,
                `Activity Level: ${props.payload.activityLevel.replace('_', ' ').toUpperCase()}`
              ]}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              fill="url(#activityGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Proportions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-blue-600 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Activity Distribution
          </h4>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={proportionData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {proportionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: any) => [`${value} hours`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Legend & Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-blue-600 mb-3">Breakdown</h4>
          {proportionData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-gray-600">{item.name}</span>
              </div>
              <div className="text-xs font-bold text-gray-700">
                {item.percentage}%
              </div>
            </div>
          ))}
          
          {/* Summary Stats */}
          <div className="mt-4 pt-3 border-t border-blue-200">
            <div className="text-xs text-blue-600 space-y-1">
              <div className="flex justify-between">
                <span>Most Active Period:</span>
                <span className="font-medium">6-8 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Average:</span>
                <span className="font-medium">12.5k steps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;