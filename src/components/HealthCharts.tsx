import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Heart, Activity, Moon, Footprints, Thermometer } from "lucide-react";

const mockData = [
  { time: "6:00", heart_rate: 68, steps: 0, sleep: 8, temperature: 98.2 },
  { time: "9:00", heart_rate: 72, steps: 2500, sleep: 8, temperature: 98.4 },
  { time: "12:00", heart_rate: 78, steps: 5200, sleep: 8, temperature: 98.6 },
  { time: "15:00", heart_rate: 75, steps: 7800, sleep: 8, temperature: 98.5 },
  { time: "18:00", heart_rate: 70, steps: 9200, sleep: 8, temperature: 98.3 },
  { time: "21:00", heart_rate: 65, steps: 10500, sleep: 8, temperature: 98.1 },
];

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
  const metricCards = [
    {
      type: 'heart_rate',
      title: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      icon: Heart,
      color: 'text-red-500'
    },
    {
      type: 'steps',
      title: 'Daily Steps',
      value: 10500,
      unit: 'steps',
      icon: Footprints,
      color: 'text-blue-500'
    },
    {
      type: 'sleep',
      title: 'Sleep Hours',
      value: 8,
      unit: 'hrs',
      icon: Moon,
      color: 'text-purple-500'
    },
    {
      type: 'temperature',
      title: 'Body Temperature',
      value: 98.3,
      unit: '°F',
      icon: Thermometer,
      color: 'text-orange-500'
    }
  ];

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
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="heart_rate" 
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
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="steps" fill="var(--color-steps)" />
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
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="sleep" 
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
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[96, 102]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
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