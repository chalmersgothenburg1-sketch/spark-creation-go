import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-senior.jpg";
import watchImage from "@/assets/senior-watch.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Peace of Mind for
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  Your Loved Ones
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Advanced health monitoring with instant emergency response, 
                real-time family notifications, and comprehensive care services.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-card rounded-lg shadow-soft">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">24/7 Health Monitoring</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-card rounded-lg shadow-soft">
                <Phone className="h-6 w-6 text-emergency" />
                <span className="text-sm font-medium">Instant Emergency</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-card rounded-lg shadow-soft">
                <Shield className="h-6 w-6 text-accent-foreground" />
                <span className="text-sm font-medium">Family Connected</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="text-lg">
                  Get Started Today
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg">
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-foreground rounded-full"></div>
                <span>FDA Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emergency rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative">
            {/* Hero Background Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-hero">
              <img 
                src={heroImage} 
                alt="Happy senior wearing SeniorCare health watch"
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Watch Product */}
            <div className="absolute -bottom-8 -left-8 lg:-left-16">
              <div className="bg-card p-6 rounded-2xl shadow-hero border border-border">
                <img 
                  src={watchImage} 
                  alt="SeniorCare Health Watch"
                  className="w-32 h-24 object-contain"
                />
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-foreground">SeniorCare Watch</p>
                  <p className="text-xs text-muted-foreground">Starting at $199</p>
                </div>
              </div>
            </div>

            {/* Floating Emergency Alert */}
            <div className="absolute top-4 right-4 lg:top-8 lg:right-8">
              <div className="bg-emergency text-emergency-foreground p-3 rounded-lg shadow-card animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emergency-foreground rounded-full"></div>
                  <span className="text-xs font-medium">Emergency Alert Sent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl"></div>
    </section>
  );
}