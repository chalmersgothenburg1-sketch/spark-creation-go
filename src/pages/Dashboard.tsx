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
import { Badge } from "@/components/ui/badge";
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Navigation Tabs */}
      <header className="h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 px-6">
        <div className="flex items-center flex-1">
          <h1 className="text-xl font-semibold text-foreground mr-8">WeCareWell</h1>
          
          {userRole === 'customer' ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 max-w-2xl">
              <TabsList className="grid grid-cols-5 w-full h-12 bg-muted/30 border border-border/50 p-1">
                {dashboardNavItems.map((item) => (
                  <TabsTrigger 
                    key={item.id} 
                    value={item.id} 
                    className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <div className="flex items-center space-x-6">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {userRole === 'customer' && (
            <div className="flex items-center gap-3 px-3 py-2 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-4 w-6 border-2 border-emerald-600 rounded-sm relative bg-background">
                    <div className="absolute inset-0.5 bg-emerald-500 rounded-sm" style={{ width: '78%' }}></div>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-1 h-2 bg-emerald-600 rounded-r-sm"></div>
                </div>
                <span className="text-sm font-medium text-emerald-700">78%</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <Badge variant="secondary" className="text-xs">Customer Portal</Badge>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
          </div>
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};