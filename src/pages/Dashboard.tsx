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
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ChatBox } from "@/components/ChatBox";
import { 
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Heart } from "lucide-react";
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

  const handleNavigate = (path: string) => {
    if (path.startsWith("/#")) {
      navigate("/");
      // Scroll to section after navigation
      setTimeout(() => {
        const sectionId = path.substring(2);
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(path);
    }
  };

  const handleSettings = () => {
    if (userRole === 'customer') {
      setActiveTab('settings');
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar
          userRole={userRole}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNavigate={handleNavigate}
        />
        
        <SidebarInset className="flex-1">
          {/* Enhanced Responsive Header */}
          <header className="sticky top-0 z-40 border-b border-border/20 bg-gradient-to-r from-primary/5 via-primary-glow/3 to-accent/5 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
              {/* Left: Sidebar trigger and logo */}
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="md:hidden" />
                <div className="flex items-center space-x-3 md:hidden">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-soft">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                    WeCareWell
                  </h1>
                </div>
                <SidebarTrigger className="hidden md:flex" />
              </div>

              {/* Right: User actions */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-card/60 backdrop-blur-sm rounded-xl border border-border/30 shadow-soft">
                  <span className="text-sm text-muted-foreground">Welcome,</span>
                  <span className="text-sm font-semibold text-foreground">{user.email?.split('@')[0]}</span>
                </div>
                <ThemeToggle />
                <UserProfileDropdown
                  user={user}
                  onSignOut={handleSignOut}
                  onSettings={handleSettings}
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6 space-y-6">
              {renderDashboard()}
            </div>
          </main>
        </SidebarInset>

        {/* AI Assistant Chatbox */}
        <ChatBox showWelcomeMessage={true} />
      </div>
    </SidebarProvider>
  );
};