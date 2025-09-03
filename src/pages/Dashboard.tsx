import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MarketingDashboard } from "@/components/dashboards/MarketingDashboard";
import { FinanceDashboard } from "@/components/dashboards/FinanceDashboard";
import { CustomerSupportDashboard } from "@/components/dashboards/CustomerSupportDashboard";
import { CustomerDashboard } from "@/components/dashboards/CustomerDashboard";
import { EmergencyDashboard } from "@/components/dashboards/EmergencyDashboard";
import { PrescriptionDashboard } from "@/components/dashboards/PrescriptionDashboard";
import { InsuranceDashboard } from "@/components/dashboards/InsuranceDashboard";
import { SettingsDashboard } from "@/components/dashboards/SettingsDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClinicalDiagnosisDashboard } from "@/components/dashboards/ClinicalDiagnosisDashboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { fetchDevices, fetchDashboard } from "@/lib/deviceApi";
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
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { DashboardData } from "@/types/types";

function transformApiResponse(apiData: any): DashboardData {
  return {
    latest_bp_systolic: apiData.bp.bp_systolic,
    latest_bp_diastolic: apiData.bp.bp_diastolic,
    latest_o2: apiData.spo2.latest,
    latest_battery: apiData.battery,
    latest_latitude: apiData.location.latitude,
    latest_longitude: apiData.location.longitude,
    total_steps: apiData.steps.total,
    calories_burned: apiData.calories_burned.total,
    calories_burned_active: apiData.calories_burned.active,
    calories_burned_resting: apiData.calories_burned.resting,
    calories_burned_trend7d: apiData.calories_burned.trend_7d,
    heartrate: apiData.heartrate.latest,
    stress: apiData.heartrate.stress,
    sleep_quality: {
      duration: apiData.sleep_quality.duration,
      deep_sleep: apiData.sleep_quality.deep_sleep,
      light_sleep: apiData.sleep_quality.light_sleep,
      sleep_quality_score: apiData.sleep_quality.sleep_quality_score,
      sleep_pattern_timeline: apiData.sleep_quality.sleep_pattern_timeline,
      sleep_quality_text: apiData.sleep_quality.sleep_quality_text,
      sleep_period: apiData.sleep_quality.sleep_period,
    },
  };
}

interface Device {
  device_id: string;
  model?: string;
}

export const Dashboard = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>("00bf82a1-217e-4188-ba2e-6697595c49b9");
  const [devices, setDevices] = useState<Device[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
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

  const email = localStorage.getItem("userEmail");
  const userRole = email != null ? getUserRole(email) : 'customer';
  const username = email != null ? getUsername(email) : 'User';

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
    // Check for user session (token/email) in localStorage
    const email = localStorage.getItem("userEmail");
    if (!email) {
      navigate("/auth");
    } else {
      setUserEmail(email);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    // Fetch devices for user on dashboard load
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("access_token");
    if (!uid || !token) {
      navigate("/auth");
      setLoading(false);
      return;
    }
    setUserEmail(localStorage.getItem("userEmail"));
    fetchDevices(uid, token)
      .then((data) => {
        setDevices(data);
        // setSelectedDevice("00bf82a1-217e-4188-ba2e-6697595c49b9");
        if (data.length > 0) {
          setSelectedDevice(data[0].id);
        } else {
          setSelectedDevice("");
        }
      })
      .catch(() => toast.error("Failed to load devices"))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("userEmail");
    console.log("Effect running: selectedDevice=", selectedDevice, "email=", email, "token=", token);

    if (!uid || !token) {
      setDashboardData(null);
      return;
    }

    // function to fetch and set data
    const fetchData = () => {
      console.log("Polling tick @", new Date().toISOString());

      fetchDashboard(email, selectedDevice, token)
        .then((data) => {console.log("Fetched data: ",data); 
          setDashboardData(transformApiResponse(data))})
        .catch((err) => {
          console.error("Fetch error:", err);
          setDashboardData(null);
          toast.error("Failed to load dashboard data");
        });
    };

    // fetch immediately once
    fetchData();

    // set interval for 10 sec
    const intervalId = setInterval(() => {fetchData();}, 3000);

    // cleanup on unmount or when selectedDevice changes
    return () => clearInterval(intervalId);
  }, [selectedDevice, email]);


  const handleSignOut = async () => {
    // Remove user session
    localStorage.removeItem("userEmail");
    toast.success("Signed out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!userEmail) {
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
        // console.log("Dashboard data updated:", dashboardData);
        return renderCustomerDashboard();
    }
  };

  const renderCustomerDashboard = () => {
    switch (activeTab) {
      case "dashboard":
        return <CustomerDashboard data={dashboardData} devices={devices} selectedDevice={selectedDevice} onDeviceChange={setSelectedDevice} />;
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
        return <CustomerDashboard data={dashboardData} devices={devices} selectedDevice={selectedDevice} onDeviceChange={setSelectedDevice}/>;
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
                <TabsList className="grid grid-cols-4 w-full max-w-md">
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
              <span className="text-xs font-medium">{dashboardData ? `${dashboardData.latest_battery} %` : "--"}</span>
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