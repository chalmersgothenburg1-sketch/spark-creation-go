import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PlansSection } from "@/components/PlansSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { CTASection } from "@/components/CTASection";
import { Heart, Activity, Shield, MessageCircle, Phone, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [hasOrderedWatch, setHasOrderedWatch] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { title: "Home", icon: Heart, action: () => window.scrollTo(0, 0) },
    { title: "Features", icon: Activity, action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Plans", icon: Shield, action: () => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Why Us", icon: MessageCircle, action: () => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "FAQs", icon: Phone, action: () => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const email = localStorage.getItem("userEmail");
    
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
      // Simulate checking if user has ordered watch (in real app, this would be an API call)
      const watchOrdered = localStorage.getItem("hasOrderedWatch") === "true";
      setHasOrderedWatch(watchOrdered);
    }
  }, []);

  const handleNavigation = (item: any) => {
    item.action();
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("uid");
    localStorage.removeItem("hasOrderedWatch");
    setIsLoggedIn(false);
    setUserEmail("");
    setHasOrderedWatch(false);
    toast.success("Logged out successfully");
  };

  const getUsername = (email: string) => {
    return email.split('@')[0];
  };

  const handleGetStarted = () => {
    navigate("/auth");
  };

  const handleOrderStatus = () => {
    // Navigate to order status page or show modal
    toast.info("Order status feature coming soon!");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-700 via-green-300 to-white">
      {/* Modern Header with Navigation */}
      <header className="h-20 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mr-3">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            WeCareWell
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <button
              key={item.title}
              onClick={() => handleNavigation(item)}
              className="group flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-200 relative"
            >
              <item.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              {item.title}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/70 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* <ThemeToggle /> */}
          {isLoggedIn ? (
            /* Account Dropdown for Logged In Users */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{getUsername(userEmail)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Login Button for Non-Logged In Users */
            <Button
              onClick={() => navigate("/auth")}
              className="hidden md:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Log In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/50 z-40">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.title}
                onClick={() => handleNavigation(item)}
                className="flex items-center p-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.title}
              </button>
            ))}
            {!isLoggedIn && (
              <Button
                onClick={() => navigate("/auth")}
                className="mt-4 bg-gradient-to-r from-primary to-primary/80 text-white"
              >
                Log In
              </Button>
            )}
            {isLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="mt-4 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{getUsername(userEmail)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="overflow-auto">
        <HeroSection 
          isLoggedIn={isLoggedIn} 
          hasOrderedWatch={hasOrderedWatch}
          onGetStarted={handleGetStarted}
          onOrderStatus={handleOrderStatus}
        />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="plans">
          <PlansSection />
        </div>
        <div id="why-us">
          <WhyUsSection />
        </div>
        <div id="faqs">
          <FAQSection />
        </div>
        <ContactSection />
        <CTASection />
      </main>
    </div>
  );
};

export default Index;
