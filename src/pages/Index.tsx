import { Button } from "@/components/ui/button";
import Navigation from "@/components/ui/navigation";
import FeatureCard from "@/components/ui/feature-card";
import TrustBadge from "@/components/ui/trust-badge";
import EmergencyAlert from "@/components/ui/emergency-alert";
import ProductShowcase from "@/components/ui/product-showcase";
import { Heart, Phone, Users, ArrowRight } from "lucide-react";
import heroImage from "@/assets/elderly-man-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <title>WeCareWell - Peace of Mind for Your Loved Ones | Advanced Health Monitoring</title>
      <meta name="description" content="Advanced health monitoring with instant emergency response, real-time family notifications, and comprehensive care services for your elderly loved ones." />
      
      <Navigation />
      
      <main>
        <section className="relative px-6 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                    <span className="text-foreground">Peace of Mind for</span>
                    <br />
                    <span className="text-primary">Your Loved Ones</span>
                  </h1>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                    Advanced health monitoring with instant emergency response, real-time family notifications, and comprehensive care services.
                  </p>
                </div>
                
                {/* Feature Cards */}
                <div className="space-y-4">
                  <FeatureCard 
                    icon={<Heart className="w-6 h-6 text-primary" />}
                    title="24/7 Health Monitoring"
                  />
                  <FeatureCard 
                    icon={<Phone className="w-6 h-6 text-primary" />}
                    title="Instant Emergency"
                  />
                  <FeatureCard 
                    icon={<Users className="w-6 h-6 text-primary" />}
                    title="Family Connected"
                  />
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="lg" className="group">
                    Get Started Today
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="demo" size="lg">
                    Watch Demo
                  </Button>
                </div>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <TrustBadge icon="✓" text="FDA Approved" color="success" />
                  <TrustBadge icon="✓" text="HIPAA Compliant" color="primary" />
                  <TrustBadge icon="⭕" text="24/7 Support" color="emergency" />
                </div>
              </div>
              
              {/* Right Content - Hero Image */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={heroImage}
                    alt="Happy elderly man wearing a SeniorCare health monitoring smartwatch in a peaceful park setting"
                    className="w-full h-full object-cover"
                  />
                  <EmergencyAlert />
                </div>
                
                {/* Product Showcase */}
                <div className="absolute -bottom-6 -left-6 hidden lg:block">
                  <ProductShowcase />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;