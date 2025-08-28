import { Menu, X } from "lucide-react";
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
import { ClinicalDiagnosisDashboard } from "@/components/dashboards/ClinicalDiagnosisDashboard";
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
  LogOut,
  User as UserIcon,
  ChevronDown,
  Stethoscope
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Extract username from email
  const getUsername = (email: string) => {
    return email.split('@')[0];
  };

  const userRole = user?.email ? getUserRole(user.email) : 'customer';
  const username = user?.email ? getUsername(user.email) : 'User';

  // Navigation items for main pages
  const mainNavItems = [
    { id: "home", label: "Home", icon: Heart, action: () => navigate("/") },
    { id: "features", label: "Features", icon: Activity, action: () => navigate("/") },
    { id: "plans", label: "Plans", icon: Shield, action: () => navigate("/") },
    { id: "why-us", label: "Why Us", icon: MessageCircle, action: () => navigate("/") },
    { id: "faqs", label: "FAQs", icon: Phone, action: () => navigate("/") },
  ];

  // Dashboard navigation items (only for customers) - removed settings
  const dashboardNavItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "emergency", label: "Emergency", icon: AlertTriangle },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "insurance", label: "Insurance", icon: Shield },
    { id: "diagnosis", label: "Diagnosis", icon: Stethoscope },
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
      case "diagnosis":
        return <ClinicalDiagnosisDashboard />;
      case "settings":
        return <SettingsDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Navigation Tabs */}
      <header className="h-16 flex items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-foreground mr-8">WeCareWell</h1>
          
          <div className="hidden md:flex">
            {userRole === 'customer' ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                  {dashboardNavItems.map((item) => (
                    <TabsTrigger key={item.id} value={item.id} className="text-xs">
                      {item.label}
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
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {/* Battery Percentage like mobile phone */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-6 h-3 border border-muted-foreground rounded-sm relative">
                <div className="absolute inset-0.5 bg-green-500 rounded-sm" style={{ width: '78%' }}></div>
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-muted-foreground rounded-r-sm"></div>
              </div>
              <span className="text-xs font-medium">78%</span>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm">{username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-lg p-4 space-y-4">
          <span className="block text-sm text-muted-foreground">Welcome, {username}</span>

          {userRole === 'customer' ? (
            <div className="flex flex-col space-y-2">
              {dashboardNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsMenuOpen(false);
                }}
                className="text-left text-muted-foreground hover:text-foreground"
              >
                Settings
              </button>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Mobile Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            {/* <ThemeToggle /> */}
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
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {renderDashboard()}
        </div>
      </main>
    </div>
  );
};