import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PlansSection } from "@/components/PlansSection";
import { WhyUsSection } from "@/components/WhyUsSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { CTASection } from "@/components/CTASection";
import { Heart, Activity, Shield, MessageCircle, Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { title: "Home", icon: Heart, action: () => window.scrollTo(0, 0) },
    { title: "Features", icon: Activity, action: () => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Plans", icon: Shield, action: () => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Why Us", icon: MessageCircle, action: () => document.getElementById('why-us')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "FAQs", icon: Phone, action: () => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  const handleNavigation = (item: any) => {
    item.action();
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full">
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
          <Button
            asChild
            className="hidden md:flex bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <a href="/auth">
              Log In
            </a>
          </Button>

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
            <Button
              asChild
              className="mt-4 bg-gradient-to-r from-primary to-primary/80 text-white"
            >
              <a href="/auth">
                Log In
              </a>
            </Button>
          </nav>
        </div>
      )}

      {/* Page Content */}
      <main className="overflow-auto">
        <HeroSection />
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
