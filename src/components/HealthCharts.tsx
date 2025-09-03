import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Activity, Moon, Footprints, Thermometer, Battery } from "lucide-react";

interface HealthMetric {
  id: string;
  metric_type: string;
  value: number | { value: number };
  recorded_at: string;
}

interface DashboardData {
  latest_bp_systolic: number;
  latest_bp_diastolic: number;
  latest_o2: number;
  latest_battery: number;
  latest_latitude: number;
  latest_longitude: number;
  steps_hourly: Record<string, number>;
  total_steps: number;
  activity_log_hourly: Record<string, Array<{ timestamp: string; activity: string; latitude: number; longitude: number }>>;
  sleeping_time_hourly: Record<string, string[]>;
  heartrate_hourly_avg: Record<string, number | null>;
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

export const HealthCharts = ({ dashboardData }: { dashboardData: DashboardData | null }) => {
  // Prepare heart rate hourly average data for 24 hours
  const heartRateData = dashboardData && dashboardData.heartrate_hourly_avg
    ? Object.entries(dashboardData.heartrate_hourly_avg).map(([hour, avg]) => ({
        time: hour,
        value: avg === null ? 0 : Number(avg)
      }))
    : [];
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dashboardData) {
      setMetrics([]);
      setLoading(false);
      return;
    }
    // Populate metrics from dashboardData
    setMetrics([
      {
        id: "bp_systolic",
        metric_type: "heart_rate",
        value: dashboardData.latest_bp_systolic,
        recorded_at: new Date().toISOString(),
      },
      {
        id: "steps",
        metric_type: "steps",
        value: dashboardData.total_steps,
        recorded_at: new Date().toISOString(),
      },
      {
        id: "sleep",
        metric_type: "sleep",
        value: Object.values(dashboardData.sleeping_time_hourly).flat().length,
        recorded_at: new Date().toISOString(),
      },
      {
        id: "battery",
        metric_type: "battery",
        value: dashboardData.latest_battery,
        recorded_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, [dashboardData]);

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

  // Prepare daily steps data for 24 hours
  const stepsData = dashboardData
    ? Object.entries(dashboardData.steps_hourly).map(([hour, steps]) => ({
        time: hour,
        value: steps as number
      }))
    : [];

  // Prepare sleep data for 24 hours (hour, sleep count)
  const sleepData = dashboardData
    ? Object.entries(dashboardData.sleeping_time_hourly).map(([hour, arr]) => ({
        time: hour,
        value: Array.isArray(arr) ? arr.length : 0
      }))
    : [];

  // Prepare activity data for 24 hours (hour, activity count)
  const activityData = dashboardData
    ? Object.entries(dashboardData.activity_log_hourly).map(([hour, arr]) => ({
        time: hour,
        value: Array.isArray(arr) ? arr.length : 0
      }))
    : [];

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
      type: 'battery',
      title: 'Battery Percentage',
      value: getCurrentValue('battery'),
      unit: '%',
      icon: Battery,
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
        {/* Heart Rate Chart (Hourly BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={heartRateData}
                  barCategoryGap={2}
                  barGap={1}
                  margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-heart_rate)" minPointSize={2} maxBarSize={12} />
                </BarChart>
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
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={stepsData}
                  barCategoryGap={2}
                  barGap={1}
                  margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-steps)" minPointSize={2} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sleep Chart (Hourly BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="h-5 w-5 mr-2 text-purple-500" />
              Sleep Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={sleepData}
                  barCategoryGap={2}
                  barGap={1}
                  margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-sleep)" minPointSize={2} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Chart (Hourly BarChart) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-500" />
              Activity Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={activityData}
                  barCategoryGap={2}
                  barGap={1}
                  margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    interval={0} 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--chart-4)" minPointSize={2} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};