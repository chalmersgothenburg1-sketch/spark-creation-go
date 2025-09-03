import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserDetailsForm } from "./UserDetailsForm";
import { OTPVerification } from "./OTPVerification";
import { PaymentForm } from "./PaymentForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

interface PurchaseFlowProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  allPlans: Plan[];
}

type FlowStep = 'details' | 'otp' | 'payment';

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  selectedPlan: Plan;
}

export function PurchaseFlow({ isOpen, onClose, selectedPlan, allPlans }: PurchaseFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('details');
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const navigate = useNavigate();

  const handleDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    setCurrentStep('otp');
  };

  const handleOTPVerified = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    // Mark that user has ordered a watch
    localStorage.setItem("hasOrderedWatch", "true");
    toast.success("Payment successful! Check your email for login credentials.");
    onClose();
    // Reset flow
    setCurrentStep('details');
    setUserDetails(null);
    // Redirect to login page
    navigate('/auth');
  };

  const handleBack = () => {
    if (currentStep === 'otp') {
      setCurrentStep('details');
    } else if (currentStep === 'payment') {
      setCurrentStep('otp');
    }
  };

  const handleClose = () => {
    setCurrentStep('details');
    setUserDetails(null);
    onClose();
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'details' && 'Complete Your Information'}
            {currentStep === 'otp' && 'Verify Your Email'}
            {currentStep === 'payment' && 'Payment Details'}
          </DialogTitle>
        </DialogHeader>

        {currentStep === 'details' && (
          <UserDetailsForm
            selectedPlan={selectedPlan}
            allPlans={allPlans}
            onSubmit={handleDetailsSubmit}
            onClose={handleClose}
          />
        )}

        {currentStep === 'otp' && userDetails && (
          <OTPVerification
            email={userDetails.email}
            onBack={handleBack}
            onVerified={handleOTPVerified}
          />
        )}

        {currentStep === 'payment' && userDetails && (
          <PaymentForm
            userDetails={userDetails}
            onBack={handleBack}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}