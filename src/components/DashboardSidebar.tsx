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

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <CustomerDashboard />;
      case "emergency":
        return <EmergencyDashboard />;
      case "prescriptions":
        return <PrescriptionDashboard />;
      case "insurance":
        return <InsuranceDashboard />;
      case "settings":
        return <SettingsDashboard />;
      default:
        return <CustomerDashboard />;
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