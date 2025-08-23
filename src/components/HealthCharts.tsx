import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Activity, Moon, Footprints, Thermometer } from "lucide-react";

interface HealthMetric {
  id: string;
  metric_type: string;
  value: any;
  recorded_at: string;
}

const chartConfig = {
  heart_rate: {
    label: "Heart Rate",
    color: "hsl(var(--chart-1))",
  },
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-2))",
  },
  sleep: {
    label: "Sleep Hours",
    color: "hsl(var(--chart-3))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-4))",
  },
} as const;

export const HealthCharts = () => {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    // Generate mock data for demo
    const mockMetrics: HealthMetric[] = [];
    const now = new Date();
    
    // Generate heart rate data for last 10 readings
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      
      mockMetrics.push({
        id: `heart-${i}`,
        metric_type: 'heart_rate',
        value: 68 + Math.floor(Math.random() * 25), // 68-93 bpm
        recorded_at: time.toISOString()
      });
      
      if (i % 2 === 0) {
        mockMetrics.push({
          id: `steps-${i}`,
          metric_type: 'steps',
          value: 1000 + Math.floor(Math.random() * 2000), // 1000-3000 steps
          recorded_at: time.toISOString()
        });
        
        mockMetrics.push({
          id: `sleep-${i}`,
          metric_type: 'sleep',
          value: 6.5 + Math.random() * 2, // 6.5-8.5 hours
          recorded_at: time.toISOString()
        });
        
        mockMetrics.push({
          id: `temp-${i}`,
          metric_type: 'temperature',
          value: 97.8 + Math.random() * 1.2, // 97.8-99°F
          recorded_at: time.toISOString()
        });
      }
    }
    
    setMetrics(mockMetrics);
    setLoading(false);
  };

  const getMetricsByType = (type: string) => {
    return metrics
      .filter(m => m.metric_type === type)
      .map(m => ({
        time: new Date(m.recorded_at).toLocaleTimeString(),
        value: typeof m.value === 'object' ? m.value.value : m.value,
        date: new Date(m.recorded_at).toLocaleDateString()
      }))
      .reverse()
      .slice(-10);
  };

  const getCurrentValue = (type: string) => {
    const latest = metrics.find(m => m.metric_type === type);
    if (!latest) return 0;
    return typeof latest.value === 'object' ? latest.value.value : latest.value;
  };

  const metricCards = [
    {
      type: 'heart_rate',
      title: 'Heart Rate',
      value: getCurrentValue('heart_rate'),
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      type: 'steps',
      title: 'Daily Steps',
      value: getCurrentValue('steps'),
      unit: 'steps',
      icon: Footprints,
      color: 'text-blue-500'
    },
    {
      type: 'sleep',
      title: 'Sleep Hours',
      value: getCurrentValue('sleep'),
      unit: 'hrs',
      icon: Moon,
      color: 'text-purple-500'
    },
    {
      type: 'temperature',
      title: 'Body Temperature',
      value: getCurrentValue('temperature'),
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-500'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-48">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-20 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metric Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.value} {metric.unit}
                </div>
                <p className="text-xs text-muted-foreground">
                  Latest reading
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Heart Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMetricsByType('heart_rate')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-heart_rate)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Steps Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Footprints className="h-5 w-5 mr-2 text-blue-500" />
              Daily Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getMetricsByType('steps')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-steps)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sleep Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="h-5 w-5 mr-2 text-purple-500" />
              Sleep Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMetricsByType('sleep')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-sleep)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Temperature Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-orange-500" />
              Body Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getMetricsByType('temperature')}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[96, 102]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-temperature)" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};