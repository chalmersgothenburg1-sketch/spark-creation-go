import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";
import { AlertTriangle, Phone, MessageSquare, Clock, Users, CheckCircle } from "lucide-react";

const liveEmergencies = [
  {
    id: "EMG-001",
    customerName: "Margaret Johnson",
    customerEmail: "margaret.j@email.com",
    emergencyType: "Fall Detection",
    location: "Living Room, 123 Oak St, Springfield",
    timeReported: "2 minutes ago",
    status: "Critical",
    contactsNotified: true,
    ambulanceCalled: true,
    insuranceContacted: false,
    deviceBattery: "65%",
    lastHeartRate: "88 BPM",
  },
  {
    id: "EMG-002", 
    customerName: "Robert Chen",
    customerEmail: "r.chen@email.com",
    emergencyType: "Heart Rate Alert",
    location: "Bedroom, 456 Pine Ave, Downtown",
    timeReported: "8 minutes ago",
    status: "High Priority",
    contactsNotified: true,
    ambulanceCalled: false,
    insuranceContacted: false,
    deviceBattery: "42%",
    lastHeartRate: "145 BPM",
  },
  {
    id: "EMG-003",
    customerName: "Dorothy Williams",
    customerEmail: "dorothy.w@email.com", 
    emergencyType: "Manual SOS",
    location: "Kitchen, 789 Elm St, Riverside",
    timeReported: "15 minutes ago",
    status: "Medium Priority",
    contactsNotified: true,
    ambulanceCalled: false,
    insuranceContacted: true,
    deviceBattery: "78%",
    lastHeartRate: "72 BPM",
  },
];

const supportMetrics = [
  { hour: "00:00", tickets: 5, emergencies: 2 },
  { hour: "04:00", tickets: 3, emergencies: 1 },
  { hour: "08:00", tickets: 15, emergencies: 4 },
  { hour: "12:00", tickets: 25, emergencies: 3 },
  { hour: "16:00", tickets: 20, emergencies: 5 },
  { hour: "20:00", tickets: 12, emergencies: 2 },
];

const responseTimeData = [
  { day: "Mon", avgResponse: 3.2, target: 5 },
  { day: "Tue", avgResponse: 2.8, target: 5 },
  { day: "Wed", avgResponse: 4.1, target: 5 },
  { day: "Thu", avgResponse: 3.5, target: 5 },
  { day: "Fri", avgResponse: 4.8, target: 5 },
  { day: "Sat", avgResponse: 2.1, target: 5 },
  { day: "Sun", avgResponse: 1.9, target: 5 },
];

export const CustomerSupportDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Customer Support Dashboard</h1>
        <Badge variant="secondary">Support Team</Badge>
      </div>

      {/* Live Emergency Alert */}
      <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <strong>3 Active Emergencies</strong> - Immediate attention required
        </AlertDescription>
      </Alert>

      {/* Support KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active Emergencies</p>
              <p className="text-2xl font-bold text-foreground">3</p>
              <p className="text-sm text-red-600">Requires immediate action</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold text-foreground">47</p>
              <p className="text-sm text-green-600">-8 from yesterday</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-secondary" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold text-foreground">3.2 min</p>
              <p className="text-sm text-green-600">Under 5 min target</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Resolution Rate</p>
              <p className="text-2xl font-bold text-foreground">94.5%</p>
              <p className="text-sm text-green-600">+2.1% this week</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Live Emergencies Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Live Emergency Events</h3>
          <Badge variant="destructive">LIVE</Badge>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-foreground">ID</th>
                <th className="text-left p-3 text-foreground">Customer</th>
                <th className="text-left p-3 text-foreground">Emergency Type</th>
                <th className="text-left p-3 text-foreground">Location</th>
                <th className="text-left p-3 text-foreground">Time</th>
                <th className="text-left p-3 text-foreground">Status</th>
                <th className="text-left p-3 text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {liveEmergencies.map((emergency) => (
                <tr key={emergency.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-3">
                    <span className="font-mono text-sm">{emergency.id}</span>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground">{emergency.customerName}</p>
                      <p className="text-sm text-muted-foreground">{emergency.customerEmail}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant={emergency.emergencyType === "Fall Detection" ? "destructive" : "outline"}>
                      {emergency.emergencyType}
                    </Badge>
                  </td>
                  <td className="p-3 text-sm text-foreground max-w-xs">
                    {emergency.location}
                  </td>
                  <td className="p-3 text-sm text-foreground">{emergency.timeReported}</td>
                  <td className="p-3">
                    <Badge variant={emergency.status === "Critical" ? "destructive" : emergency.status === "High Priority" ? "secondary" : "outline"}>
                      {emergency.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="destructive">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Emergency Details for Live Events */}
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-foreground">Emergency Response Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveEmergencies.map((emergency) => (
              <Card key={emergency.id} className="p-4 border-l-4 border-l-red-500">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{emergency.id}</span>
                    <Badge variant="outline">{emergency.lastHeartRate}</Badge>
                  </div>
                  <p className="font-medium">{emergency.customerName}</p>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Emergency Contacts:</span>
                      <span className={emergency.contactsNotified ? "text-green-600" : "text-red-600"}>
                        {emergency.contactsNotified ? "✓ Notified" : "✗ Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ambulance:</span>
                      <span className={emergency.ambulanceCalled ? "text-green-600" : "text-red-600"}>
                        {emergency.ambulanceCalled ? "✓ Called" : "✗ Not Called"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance:</span>
                      <span className={emergency.insuranceContacted ? "text-green-600" : "text-red-600"}>
                        {emergency.insuranceContacted ? "✓ Contacted" : "✗ Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Device Battery:</span>
                      <span className="text-foreground">{emergency.deviceBattery}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Support Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">24h Support Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={supportMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="tickets" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="emergencies" stroke="hsl(var(--destructive))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Response Time Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} min`, ""]} />
              <Bar dataKey="avgResponse" fill="hsl(var(--primary))" />
              <Bar dataKey="target" fill="hsl(var(--muted))" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};