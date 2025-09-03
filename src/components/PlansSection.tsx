import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { useState } from "react";
import { PurchaseFlow } from "./PurchaseFlow";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: "$199",
    period: "one-time",
    description: "Essential health monitoring for seniors",
    popular: false,
    features: [
      "Heart rate monitoring",
      "Step counter",
      "Emergency button",
      "Basic family notifications",
      "7-day battery life",
      "Water resistant",
      "Basic mobile app"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: "$299",
    period: "one-time",
    description: "Complete health & emergency services",
    popular: true,
    features: [
      "Everything in Basic",
      "Blood pressure monitoring",
      "Fall detection",
      "GPS tracking",
      "24/7 emergency response",
      "Hospital coordination",
      "Advanced family dashboard",
      "Medication reminders",
      "Health trend analysis"
    ]
  },
  {
    id: "premium-plus",
    name: "Premium+",
    price: "$399",
    period: "one-time",
    description: "Premium plan + ongoing care services",
    popular: false,
    features: [
      "Everything in Premium",
      "Monthly health consultations",
      "Personalized care plans",
      "Insurance claim assistance",
      "Priority emergency response",
      "Advanced health analytics",
      "Family care coordination",
      "Medication delivery service",
      "24/7 nurse hotline"
    ]
  }
];

export function PlansSection() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [isPurchaseFlowOpen, setIsPurchaseFlowOpen] = useState(false);

  const handleBuyNow = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setIsPurchaseFlowOpen(true);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Choose Your <span className="text-primary">Care Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect health monitoring solution for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 transition-all duration-300 hover:shadow-hero ${
                plan.popular ? 'border-primary shadow-card' : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <p className="text-muted-foreground mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleBuyNow(plan)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-primary hover:bg-primary/90' 
                      : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                  }`}
                  size="lg"
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include free shipping and 30-day money-back guarantee
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <span>✓ FDA Approved</span>
            <span>✓ HIPAA Compliant</span>
            <span>✓ 2-Year Warranty</span>
          </div>
        </div>
      </div>

      <PurchaseFlow
        isOpen={isPurchaseFlowOpen}
        onClose={() => setIsPurchaseFlowOpen(false)}
        selectedPlan={selectedPlan}
        allPlans={plans}
      />
    </section>
  );
}