import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard, ArrowLeft, Package, User, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

interface UserDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  selectedPlan: Plan;
}

interface PaymentFormProps {
  userDetails: UserDetails;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentForm({ userDetails, onBack, onPaymentSuccess }: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    // Validate required fields
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.nameOnCard) {
      toast.error("Please fill in all payment details");
      return;
    }

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment successful! Your order has been placed.");
      onPaymentSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{userDetails.selectedPlan.name} Plan</span>
                  <span className="font-bold text-primary">{userDetails.selectedPlan.price}</span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Included Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {userDetails.selectedPlan.features.slice(0, 5).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                    {userDetails.selectedPlan.features.length > 5 && (
                      <li>• And {userDetails.selectedPlan.features.length - 5} more features...</li>
                    )}
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{userDetails.selectedPlan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary">{userDetails.selectedPlan.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{userDetails.fullName}</p>
                  <p className="text-muted-foreground">{userDetails.email}</p>
                  <p className="text-muted-foreground">{userDetails.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">{userDetails.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-green-500" />
                Secure Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nameOnCard">Name on Card *</Label>
                <Input
                  id="nameOnCard"
                  value={paymentData.nameOnCard}
                  onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                  placeholder="Name as it appears on card"
                />
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Verification
        </Button>
        <Button 
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Shield className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : `Pay Securely ${userDetails.selectedPlan.price}`}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Your payment is secured with 256-bit SSL encryption. 
        30-day money-back guarantee included.
      </p>
    </div>
  );
}