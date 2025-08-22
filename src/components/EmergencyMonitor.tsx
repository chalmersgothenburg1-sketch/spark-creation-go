import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, Ambulance, Shield, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface EmergencyEvent {
  id: string;
  event_type: string;
  status: string;
  emergency_contacts_notified: boolean;
  hospital_contacted: boolean;
  ambulance_contacted: boolean;
  insurance_contacted: boolean;
  notes: string;
  created_at: string;
  resolved_at: string | null;
}

export const EmergencyMonitor = () => {
  const [isActive, setIsActive] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const handleResolveEmergency = async () => {
    setIsResolving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsResolving(false);
    setIsActive(false);
    toast.success('Emergency resolved');
  };

  return (
    <div className="space-y-4">
      {/* Emergency Status Header */}
      <Card className={isActive ? "border-destructive bg-destructive/5" : "border-green-500 bg-green-50 dark:bg-green-950/20"}>
        <CardHeader>
          <CardTitle className="flex items-center">
            {isActive ? (
              <>
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                <span className="text-destructive">Active Emergency</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-6 w-6 mr-2 text-green-500" />
                <span className="text-green-700 dark:text-green-400">All Clear</span>
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isActive ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Emergency button was pressed. Emergency services are being contacted.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Emergency Contacts: ✓</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Ambulance className="h-4 w-4" />
                  <span className="text-sm">Ambulance: ⏳</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Hospital: ⏳</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Insurance: ⏳</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResolveEmergency}
                disabled={isResolving}
              >
                {isResolving ? "Resolving..." : "Mark Resolved"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No active emergencies. Your loved one is safe.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsActive(true)}
              >
                Simulate Emergency
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};