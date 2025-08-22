import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Shield, 
  Heart, 
  Users, 
  Clock, 
  Stethoscope,
  CheckCircle,
  Star
} from "lucide-react";

const whyUsFeatures = [
  {
    icon: Award,
    title: "FDA Approved & Certified",
    description: "Our devices meet the highest medical standards and are FDA-approved for health monitoring.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "HIPAA Compliant Security",
    description: "Your health data is protected with bank-level encryption and strict privacy protocols.",
    color: "text-accent-foreground"
  },
  {
    icon: Heart,
    title: "Medical-Grade Accuracy",
    description: "Clinical-grade sensors provide hospital-quality health monitoring from your wrist.",
    color: "text-emergency"
  },
  {
    icon: Users,
    title: "Family-Centered Care",
    description: "Keep your loved ones connected with real-time health updates and emergency alerts.",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "24/7 Professional Monitoring",
    description: "Trained emergency operators and registered nurses available around the clock.",
    color: "text-accent-foreground"
  },
  {
    icon: Stethoscope,
    title: "Healthcare Provider Integration",
    description: "Seamlessly share data with your doctors and coordinate care with local hospitals.",
    color: "text-emergency"
  }
];

const achievements = [
  {
    number: "50,000+",
    label: "Seniors Protected",
    description: "Families trust us daily"
  },
  {
    number: "98.7%",
    label: "Customer Satisfaction",
    description: "Based on 5,000+ reviews"
  },
  {
    number: "< 2 mins",
    label: "Emergency Response",
    description: "Average response time"
  },
  {
    number: "99.9%",
    label: "System Uptime",
    description: "Always there when needed"
  }
];

const testimonials = [
  {
    name: "Margaret Chen",
    age: 78,
    location: "San Francisco, CA",
    quote: "This watch saved my life when I had a fall. The emergency team was there in minutes, and my daughter was notified immediately.",
    rating: 5
  },
  {
    name: "Robert Williams", 
    age: 82,
    location: "Austin, TX",
    quote: "My family feels so much more at ease knowing I have this. The heart monitoring caught an irregular rhythm that my doctor needed to know about.",
    rating: 5
  },
  {
    name: "Dorothy Martinez",
    age: 75,
    location: "Miami, FL", 
    quote: "The medication reminders and health tracking have helped me stay independent while keeping my children informed about my wellbeing.",
    rating: 5
  }
];

export function WhyUsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Trusted by Families Nationwide
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Families Choose <span className="text-primary">SeniorCare</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The most trusted name in senior health monitoring with proven results and unmatched care
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {whyUsFeatures.map((feature, index) => (
            <Card key={index} className="border-none shadow-soft bg-card/50 backdrop-blur-sm hover:shadow-card transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-feature rounded-2xl">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {achievement.number}
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {achievement.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl lg:text-3xl font-bold text-center text-foreground mb-12">
            What Our <span className="text-primary">Families Say</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-card bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Age {testimonial.age} • {testimonial.location}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground mb-8">
            Trusted & Certified By
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">FDA Approved</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">FCC Certified</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">UL Listed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}