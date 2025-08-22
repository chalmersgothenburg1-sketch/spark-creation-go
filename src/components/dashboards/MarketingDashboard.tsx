import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, Target, DollarSign } from "lucide-react";

const campaignData = [
  { name: "Email Campaign", leads: 4000, conversions: 2400, cost: 2000 },
  { name: "Social Media", leads: 3000, conversions: 1398, cost: 1500 },
  { name: "Google Ads", leads: 2000, conversions: 800, cost: 3000 },
  { name: "Content Marketing", leads: 2780, conversions: 3908, cost: 1200 },
  { name: "Referral Program", leads: 1890, conversions: 4800, cost: 800 },
];

const monthlyData = [
  { month: "Jan", revenue: 65000, customers: 400 },
  { month: "Feb", revenue: 59000, customers: 300 },
  { month: "Mar", revenue: 80000, customers: 500 },
  { month: "Apr", revenue: 81000, customers: 520 },
  { month: "May", revenue: 56000, customers: 350 },
  { month: "Jun", revenue: 95000, customers: 600 },
];

const audienceData = [
  { name: "18-25", value: 400, color: "hsl(var(--primary))" },
  { name: "26-35", value: 300, color: "hsl(var(--secondary))" },
  { name: "36-45", value: 300, color: "hsl(var(--accent))" },
  { name: "46-60", value: 200, color: "hsl(var(--muted))" },
  { name: "60+", value: 150, color: "hsl(var(--destructive))" },
];

export const MarketingDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Marketing Dashboard</h1>
        <Badge variant="secondary">Marketing Team</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-foreground">$95,000</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">New Customers</p>
              <p className="text-2xl font-bold text-foreground">600</p>
              <p className="text-sm text-green-600">+18% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Target className="h-8 w-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">3.2%</p>
              <p className="text-sm text-green-600">+0.5% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Ad Spend</p>
              <p className="text-2xl font-bold text-foreground">$8,500</p>
              <p className="text-sm text-red-600">+5% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="leads" fill="hsl(var(--primary))" />
              <Bar dataKey="conversions" fill="hsl(var(--secondary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audience Demographics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {audienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Acquisition</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="hsl(var(--accent))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};