import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: {
    id: string;
    name: string;
    price: string;
    features: string[];
  } | null;
}

export function PaymentModal({ isOpen, onClose, selectedPlan }: PaymentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    dateOfBirth: "",
    age: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = () => {
    // Validate required fields
    const requiredFields = ['name', 'address', 'dateOfBirth', 'phone', 'cardNumber', 'expiryDate', 'cvv', 'nameOnCard'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate payment processing
    toast.success("Payment successful! Your order has been placed.");
    onClose();
    
    // Reset form
    setFormData({
      name: "",
      address: "",
      dateOfBirth: "",
      age: "",
      phone: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: ""
    });
  };

  if (!selectedPlan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{selectedPlan.name} Plan</span>
                    <span className="font-bold text-primary">{selectedPlan.price}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Included Features:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedPlan.features.slice(0, 5).map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                      {selectedPlan.features.length > 5 && (
                        <li>• And {selectedPlan.features.length - 5} more features...</li>
                      )}
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{selectedPlan.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span className="text-primary">{selectedPlan.price}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Age"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nameOnCard">Name on Card *</Label>
                  <Input
                    id="nameOnCard"
                    value={formData.nameOnCard}
                    onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    placeholder="Name as it appears on card"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePayment}
              className="w-full bg-primary hover:bg-primary/90"
              size="lg"
            >
              <Shield className="h-4 w-4 mr-2" />
              Pay Securely {selectedPlan.price}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Your payment is secured with 256-bit SSL encryption. 
              30-day money-back guarantee included.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}