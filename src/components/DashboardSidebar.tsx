import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Activity, 
  AlertTriangle, 
  FileText, 
  Shield, 
  Settings,
  LogOut
} from "lucide-react";
import { CustomerDashboard } from "@/components/dashboards/CustomerDashboard";
import { EmergencyDashboard } from "@/components/dashboards/EmergencyDashboard";
import { PrescriptionDashboard } from "@/components/dashboards/PrescriptionDashboard";
import { InsuranceDashboard } from "@/components/dashboards/InsuranceDashboard";
import { SettingsDashboard } from "@/components/dashboards/SettingsDashboard";

interface DashboardSidebarProps {
  onSignOut: () => void;
}

export const DashboardSidebar = ({ onSignOut }: DashboardSidebarProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Mock data for CustomerDashboard that matches DashboardData interface
  const mockData = {
    latest_bp_systolic: 120,
    latest_bp_diastolic: 80,
    latest_o2: 98,
    latest_battery: 85,
    latest_latitude: 40.7128,
    latest_longitude: -74.0060,
    total_steps: 8543,
    calories_burned: 2100,
    calories_burned_active: 800,
    calories_burned_resting: 1300,
    calories_burned_trend7d: [
      { day: "Mon", calories: 2000 },
      { day: "Tue", calories: 2150 },
      { day: "Wed", calories: 1950 },
      { day: "Thu", calories: 2100 },
      { day: "Fri", calories: 2050 },
      { day: "Sat", calories: 2200 },
      { day: "Sun", calories: 2100 }
    ],
    heartrate: 72,
    stress: "Low",
    sleep_quality: {
      duration: 7.5,
      deep_sleep: 2.5,
      light_sleep: 5.0,
      sleep_quality_score: 85,
      sleep_pattern_timeline: [
        { time: "10 PM", status: "light" as const, duration: 1 },
        { time: "11 PM", status: "deep" as const, duration: 1 },
        { time: "12 AM", status: "deep" as const, duration: 1 },
        { time: "1 AM", status: "light" as const, duration: 1 },
        { time: "2 AM", status: "light" as const, duration: 1 },
        { time: "3 AM", status: "deep" as const, duration: 1 },
        { time: "4 AM", status: "light" as const, duration: 1 },
        { time: "5 AM", status: "awake" as const, duration: 0.5 }
      ],
      sleep_quality_text: "Good sleep with adequate deep sleep phases",
      sleep_period: [
        { start: "10:00 PM", end: "5:30 AM" }
      ]
    }
  };

  const mockDevices = [
    { id: "watch-1", name: "Health Watch Pro", type: "smartwatch", connected: true },
    { id: "sensor-1", name: "Blood Pressure Monitor", type: "bp_monitor", connected: true },
  ];

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CustomerDashboard 
          data={mockData} 
          devices={mockDevices} 
          selectedDevice="watch-1" 
          onDeviceChange={(id: string) => console.log('Device changed:', id)} 
        />;
      case "emergency":
        return <EmergencyDashboard />;
      case "prescriptions":
        return <PrescriptionDashboard />;
      case "insurance":
        return <InsuranceDashboard />;
      case "settings":
        return <SettingsDashboard />;
      default:
        return <CustomerDashboard 
          data={mockData} 
          devices={mockDevices} 
          selectedDevice="watch-1" 
          onDeviceChange={(id: string) => console.log('Device changed:', id)} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-border h-screen flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Health Monitor</h2>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border space-y-4">
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderDashboardContent()}
        </div>
      </main>
    </div>
  );
};