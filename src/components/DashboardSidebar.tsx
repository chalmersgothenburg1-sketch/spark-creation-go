import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Heart, 
  Activity, 
  Shield, 
  MessageCircle, 
  Phone, 
  AlertTriangle, 
  FileText, 
  Settings,
  Home
} from 'lucide-react';

interface DashboardSidebarProps {
  userRole: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNavigate: (path: string) => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userRole,
  activeTab,
  setActiveTab,
  onNavigate,
}) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  // Dashboard navigation items (only for customers)
  const dashboardNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
  ];

  return (
    <Sidebar className="border-r border-border/20 bg-card/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/20 p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-soft">
            <Heart className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              WeCareWell
            </h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Dashboard Navigation (Customer Only) - Mobile Sidebar */}
        {userRole === 'customer' && (
          <SidebarGroup>
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {dashboardNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveTab(item.id)}
                        className={`transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary border border-primary/20 shadow-soft'
                            : 'hover:bg-accent/20'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                        {!isCollapsed && <span>{item.label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};