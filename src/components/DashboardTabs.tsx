import React from 'react';
import { Activity, AlertTriangle, FileText, Shield } from 'lucide-react';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const dashboardTabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
  ];

  return (
    <div className="border-b border-border/20 bg-card/30 backdrop-blur-sm overflow-x-auto">
      <div className="flex space-x-1 p-1 min-w-max">
        {dashboardTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 whitespace-nowrap
                ${isActive 
                  ? 'bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary border border-primary/20 shadow-soft' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                }
              `}
            >
              <Icon className={`h-3 w-3 md:h-4 md:w-4 ${isActive ? 'text-primary' : ''}`} />
              <span className="hidden sm:block">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};