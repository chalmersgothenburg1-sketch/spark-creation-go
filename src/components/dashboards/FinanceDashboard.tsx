import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 250000, expenses: 180000, profit: 70000 },
  { month: "Feb", revenue: 280000, expenses: 195000, profit: 85000 },
  { month: "Mar", revenue: 320000, expenses: 210000, profit: 110000 },
  { month: "Apr", revenue: 295000, expenses: 205000, profit: 90000 },
  { month: "May", revenue: 340000, expenses: 225000, profit: 115000 },
  { month: "Jun", revenue: 380000, expenses: 240000, profit: 140000 },
];

const expenseBreakdown = [
  { category: "Payroll", amount: 120000, percentage: 50 },
  { category: "Marketing", amount: 48000, percentage: 20 },
  { category: "Operations", amount: 36000, percentage: 15 },
  { category: "Technology", amount: 24000, percentage: 10 },
  { category: "Other", amount: 12000, percentage: 5 },
];

const cashFlowData = [
  { month: "Jan", inflow: 250000, outflow: 180000, net: 70000 },
  { month: "Feb", inflow: 280000, outflow: 195000, net: 85000 },
  { month: "Mar", inflow: 320000, outflow: 210000, net: 110000 },
  { month: "Apr", inflow: 295000, outflow: 205000, net: 90000 },
  { month: "May", inflow: 340000, outflow: 225000, net: 115000 },
  { month: "Jun", inflow: 380000, outflow: 240000, net: 140000 },
];

export const FinanceDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Finance Dashboard</h1>
        <Badge variant="secondary">Finance Team</Badge>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">$380,000</p>
              <p className="text-sm text-green-600">+11.8% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold text-foreground">$140,000</p>
              <p className="text-sm text-green-600">+21.7% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-2xl font-bold text-foreground">$240,000</p>
              <p className="text-sm text-red-600">+6.7% from last month</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <PiggyBank className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Profit Margin</p>
              <p className="text-2xl font-bold text-foreground">36.8%</p>
              <p className="text-sm text-green-600">+3.2% from last month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue & Profit Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue vs Profit Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
            <Area type="monotone" dataKey="profit" stackId="2" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Expenses and Cash Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={expenseBreakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={80} />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]} />
              <Bar dataKey="amount" fill="hsl(var(--accent))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Flow Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
              <Line type="monotone" dataKey="inflow" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="outflow" stroke="hsl(var(--destructive))" strokeWidth={2} />
              <Line type="monotone" dataKey="net" stroke="hsl(var(--secondary))" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Financial Summary Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-foreground">Month</th>
                <th className="text-right p-3 text-foreground">Revenue</th>
                <th className="text-right p-3 text-foreground">Expenses</th>
                <th className="text-right p-3 text-foreground">Profit</th>
                <th className="text-right p-3 text-foreground">Margin</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row) => (
                <tr key={row.month} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{row.month}</td>
                  <td className="p-3 text-right text-foreground">${row.revenue.toLocaleString()}</td>
                  <td className="p-3 text-right text-foreground">${row.expenses.toLocaleString()}</td>
                  <td className="p-3 text-right text-green-600">${row.profit.toLocaleString()}</td>
                  <td className="p-3 text-right text-foreground">{((row.profit / row.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};