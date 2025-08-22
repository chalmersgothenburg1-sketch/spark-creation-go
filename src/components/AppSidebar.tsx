import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Shield, Heart, MessageCircle, LogIn, Activity } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Home", icon: Heart, action: () => window.scrollTo(0, 0) },
  { title: "Features", icon: Activity, action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
  { title: "Plans", icon: Shield, action: () => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }) },
  { title: "Why Us", icon: MessageCircle, action: () => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' }) },
  { title: "FAQs", icon: Phone, action: () => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }) },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth");
  };

  const handleNavigation = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} transition-all duration-300 border-r border-border bg-card`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="px-4 py-6">
        {/* Logo section */}
        <div className={`mb-8 ${collapsed ? "text-center" : ""}`}>
          {!collapsed ? (
            <h2 className="text-xl font-semibold text-foreground">WeCareWell</h2>
          ) : (
            <div className="w-8 h-8 bg-gradient-hero rounded-lg mx-auto"></div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Quick Access
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item)}
                    className="w-full justify-start hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Theme Toggle */}
        <div className="mb-4">
          <ThemeToggle />
        </div>

        {/* Emergency Contact */}
        {!collapsed && (
          <div className="mt-auto pt-6">
            <div className="bg-emergency/10 border border-emergency/20 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Phone className="h-4 w-4 text-emergency mr-2" />
                <span className="text-sm font-medium text-emergency">Emergency</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                24/7 immediate response
              </p>
              <Button 
                variant="emergency" 
                size="sm" 
                className="w-full"
              >
                Call Now
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}