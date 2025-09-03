import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Heart, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import heroImage1 from "@/assets/hero-senior1.png";
import heroImage2 from "@/assets/hero-senior2.jpg";

interface HeroSectionProps {
  isLoggedIn?: boolean;
  hasOrderedWatch?: boolean;
  hasActivePlan?: boolean;
  onGetStarted?: () => void;
  onOrderStatus?: () => void;
  onGoToDashboard?: () => void;
}

export function HeroSection({ 
  isLoggedIn = false, 
  hasOrderedWatch = false, 
  hasActivePlan = false,
  onGetStarted, 
  onOrderStatus,
  onGoToDashboard
}: HeroSectionProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitted(true);
    
    // Reset form after 3 seconds and close modal
    setTimeout(() => {
      setIsSubmitted(false);
      setIsContactOpen(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    }, 3000);
  };
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage1}
          alt="Happy senior wearing SeniorCare health watch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Peace of Mind for
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                  Your Loved Ones
                </span>
              </h1>
              <p className="text-xl leading-relaxed max-w-lg text-gray-200">
                Advanced health monitoring with instant emergency response, 
                real-time family notifications, and comprehensive care services.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-soft">
                <Heart className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">24/7 Health Monitoring</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-soft">
                <Phone className="h-6 w-6 text-emergency" />
                <span className="text-sm font-medium">Instant Emergency</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white/10 backdrop-blur-md rounded-lg shadow-soft">
                <Shield className="h-6 w-6 text-accent-foreground" />
                <span className="text-sm font-medium">Family Connected</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isLoggedIn ? (
                <>
                  <Button onClick={onGetStarted} variant="hero" size="lg" className="text-lg">
                    Get Started Today
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" className="text-lg text-gray-800">
                        Contact Us
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact Us</DialogTitle>
                      </DialogHeader>
                      {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Tell us how we can help you..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Send Message
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for contacting us!
                          </div>
                          <p className="text-muted-foreground">
                            We will contact you soon.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              ) : hasActivePlan ? (
                <>
                  <Button onClick={onGoToDashboard} variant="hero" size="lg" className="text-lg">
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" className="text-lg text-gray-800">
                        Contact Us
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact Us</DialogTitle>
                      </DialogHeader>
                      {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Tell us how we can help you..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Send Message
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for contacting us!
                          </div>
                          <p className="text-muted-foreground">
                            We will contact you soon.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              ) : hasOrderedWatch ? (
                <>
                  <Button onClick={onOrderStatus} variant="hero" size="lg" className="text-lg">
                    Order Status
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" className="text-lg text-gray-800">
                        Contact Us
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact Us</DialogTitle>
                      </DialogHeader>
                      {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Tell us how we can help you..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Send Message
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for contacting us!
                          </div>
                          <p className="text-muted-foreground">
                            We will contact you soon.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <>
                  <Button onClick={onGetStarted} variant="hero" size="lg" className="text-lg">
                    Get Started Today
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="lg" className="text-lg text-gray-800">
                        Contact Us
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Contact Us</DialogTitle>
                      </DialogHeader>
                      {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter your email"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter your phone number"
                            />
                          </div>
                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              value={formData.message}
                              onChange={(e) => handleInputChange('message', e.target.value)}
                              placeholder="Tell us how we can help you..."
                              rows={4}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Send Message
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-green-600 text-lg font-semibold mb-2">
                            Thank you for contacting us!
                          </div>
                          <p className="text-muted-foreground">
                            We will contact you soon.
                          </p>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-300">
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
        </div>
      </div>

      {/* Floating Emergency Alert - Top Right */}
      <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
        <div className="bg-emergency text-emergency-foreground p-3 rounded-lg shadow-card animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emergency-foreground rounded-full"></div>
            <span className="text-xs font-medium">Emergency Alert Sent</span>
          </div>
        </div>
      </div>
    </section>
  );
}
