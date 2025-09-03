import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center text-primary-foreground">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Ready to Protect Your
            <br />
            <span className="text-primary-glow">Loved Ones?</span>
          </h2>
          
          <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of families who trust SeniorCare for peace of mind
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button 
                variant="secondary" 
                size="lg" 
                className="text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Sign Up / Login
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg border-primary-foreground text-secondary-foreground hover:bg-primary-foreground/10"
            >
              Schedule a Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <Phone className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Call Us</p>
                <p className="opacity-90">1-800-SENIOR-CARE</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="h-6 w-6" />
              <div className="text-left">
                <p className="font-semibold">Email Us</p>
                <p className="opacity-90">help@seniorcare.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-40 h-40 bg-primary-glow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}