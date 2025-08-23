import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { MarketingDashboard } from "@/components/dashboards/MarketingDashboard";
import { FinanceDashboard } from "@/components/dashboards/FinanceDashboard";
import { CustomerSupportDashboard } from "@/components/dashboards/CustomerSupportDashboard";
import { CustomerDashboard } from "@/components/dashboards/CustomerDashboard";
import { EmergencyDashboard } from "@/components/dashboards/EmergencyDashboard";
import { PrescriptionDashboard } from "@/components/dashboards/PrescriptionDashboard";
import { InsuranceDashboard } from "@/components/dashboards/InsuranceDashboard";
import { SettingsDashboard } from "@/components/dashboards/SettingsDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Activity, 
  Shield, 
  MessageCircle, 
  Phone, 
  AlertTriangle, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // Determine user role based on email domain
  const getUserRole = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    
    if (domain?.includes('marketing') || domain?.includes('mktg')) {
      return 'marketing';
    } else if (domain?.includes('finance') || domain?.includes('accounting') || domain?.includes('fin')) {
      return 'finance';
    } else if (domain?.includes('support') || domain?.includes('cs') || domain?.includes('help')) {
      return 'support';
    } else {
      return 'customer'; // Default for regular customers
    }
  };

  const userRole = user?.email ? getUserRole(user.email) : 'customer';

  // Navigation items for main pages
  const mainNavItems = [
    { id: "home", label: "Home", icon: Heart, action: () => navigate("/") },
    { id: "features", label: "Features", icon: Activity, action: () => navigate("/") },
    { id: "plans", label: "Plans", icon: Shield, action: () => navigate("/") },
    { id: "why-us", label: "Why Us", icon: MessageCircle, action: () => navigate("/") },
    { id: "faqs", label: "FAQs", icon: Phone, action: () => navigate("/") },
  ];

  // Dashboard navigation items (only for customers)
  const dashboardNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'marketing':
        return <MarketingDashboard />;
      case 'finance':
        return <FinanceDashboard />;
      case 'support':
        return <CustomerSupportDashboard />;
      case 'customer':
      default:
        return renderCustomerDashboard();
    }
  };

  const renderCustomerDashboard = () => {
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
    <div className="min-h-screen bg-background">
      {/* Enhanced Warm Header */}
      <header className="relative h-20 flex items-center justify-between border-b border-border/20 bg-gradient-to-r from-primary/5 via-primary-glow/3 to-accent/5 backdrop-blur-md sticky top-0 z-40 px-8 shadow-soft">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-sm"></div>
        
        <div className="relative flex items-center space-x-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-soft">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              WeCareWell
            </h1>
          </div>
          
          {/* Battery Indicator for Customer Portal */}
          {userRole === 'customer' && (
            <div className="flex items-center space-x-3 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-soft">
              <span className="text-sm font-medium text-muted-foreground">Customer Portal</span>
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-4 bg-muted rounded-sm border border-border/50">
                  <div className="absolute inset-0.5 w-6 bg-gradient-to-r from-accent-foreground to-primary rounded-sm"></div>
                  <div className="absolute -right-0.5 top-1 w-1 h-2 bg-border rounded-sm"></div>
                </div>
                <span className="text-xs font-medium text-foreground">85%</span>
              </div>
            </div>
          )}
          
          {/* Navigation Tabs for Customer */}
          {userRole === 'customer' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-card/40 backdrop-blur-sm border border-border/30 shadow-soft h-12">
                {dashboardNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <TabsTrigger 
                      key={item.id} 
                      value={item.id} 
                      className={`
                        relative flex items-center justify-center space-x-2 text-sm font-medium transition-all duration-300 rounded-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary/20 to-primary-glow/20 text-primary shadow-soft border border-primary/20' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                      <span className="hidden sm:inline">{item.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary to-primary-glow rounded-full"></div>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          ) : (
            <div className="flex items-center space-x-8">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="group flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
                  >
                    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.label}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-glow group-hover:w-full transition-all duration-300"></span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="relative flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-4 py-2 bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 shadow-soft">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="text-sm font-semibold text-foreground">{user.email?.split('@')[0]}</span>
          </div>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center space-x-2 bg-card/60 backdrop-blur-sm border-border/30 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-300 shadow-soft"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-2 left-20 w-16 h-16 bg-primary/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-2 right-32 w-12 h-12 bg-primary-glow/10 rounded-full blur-xl"></div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};