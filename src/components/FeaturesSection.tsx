import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Phone, 
  Users, 
  Shield, 
  Ambulance, 
  Building2,
  Clock,
  Smartphone,
  AlertTriangle
} from "lucide-react";
import dashboardImage from "@/assets/health-dashboard.jpg";

const healthFeatures = [
  {
    icon: Heart,
    title: "Real-Time Health Monitoring",
    description: "Continuous tracking of heart rate, blood pressure, activity levels, and more with instant family access.",
    color: "text-primary"
  },
  {
    icon: Smartphone,
    title: "Family Dashboard",
    description: "Loved ones access real-time health data, medication reminders, and daily activity summaries.",
    color: "text-accent-foreground"
  },
  {
    icon: AlertTriangle,
    title: "Emergency Button",
    description: "One-touch emergency activation sends instant alerts to family and emergency services.",
    color: "text-emergency"
  }
];

const emergencyServices = [
  {
    icon: Phone,
    title: "Hospital Coordination",
    description: "Direct communication with nearby hospitals, medical history sharing, and appointment scheduling.",
    color: "text-primary"
  },
  {
    icon: Ambulance,
    title: "Ambulance Services",
    description: "Immediate ambulance dispatch with pre-shared medical information and GPS location.",
    color: "text-emergency"
  },
  {
    icon: Building2,
    title: "Insurance Support",
    description: "Direct insurance claim filing, pre-authorization handling, and coverage verification.",
    color: "text-accent-foreground"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-8">
        
        {/* Health Monitoring Features */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Complete Health <span className="text-primary">Monitoring</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced technology that keeps families connected and seniors safe
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Dashboard Image */}
          <div className="order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-hero">
              <img 
                src={dashboardImage} 
                alt="SeniorCare Family Health Dashboard"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
            </div>
          </div>

          {/* Health Features */}
          <div className="order-1 lg:order-2 space-y-6">
            {healthFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-soft bg-card hover:shadow-card transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Services */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comprehensive <span className="text-emergency">Emergency Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional support when it matters most - we handle everything
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {emergencyServices.map((service, index) => (
            <Card key={index} className="text-center border-none shadow-card bg-card hover:shadow-hero transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="mx-auto p-4 bg-gradient-feature rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Response Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {[
            { number: "< 2min", label: "Emergency Response", icon: Clock },
            { number: "24/7", label: "Support Available", icon: Phone },
            { number: "50,000+", label: "Families Protected", icon: Users },
            { number: "99.9%", label: "Uptime Guarantee", icon: Shield }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}