import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone, MapPin, Clock, Users } from "lucide-react";
import { ChatBox } from "@/components/ChatBox";

export const EmergencyDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Emergency Information</h2>
        <Button variant="emergency" size="sm">
          <Phone className="h-4 w-4 mr-2" />
          Call 911
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-emergency">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-emergency mr-3" />
            <h3 className="text-lg font-semibold text-emergency">Immediate Emergency Actions</h3>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-emergency rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Call 911 immediately for life-threatening emergencies</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-emergency rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Press the emergency button on your health monitoring device</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-emergency rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Stay calm and provide clear location information</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-emergency rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Follow dispatcher instructions until help arrives</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Phone className="h-6 w-6 text-primary mr-3" />
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Primary Emergency Contact</p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
              <p className="text-sm font-medium">(555) 123-4567</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Family Contact</p>
              <p className="text-sm text-muted-foreground">John Smith (Son)</p>
              <p className="text-sm font-medium">(555) 987-6543</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">Local Hospital</p>
              <p className="text-sm text-muted-foreground">City General Hospital</p>
              <p className="text-sm font-medium">(555) 456-7890</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-accent mr-3" />
            <h3 className="text-lg font-semibold">Location & Medical Info</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium">Current Address:</p>
              <p className="text-muted-foreground">123 Main Street, Apt 4B<br />Springfield, IL 62701</p>
            </div>
            <div>
              <p className="font-medium">Medical Conditions:</p>
              <p className="text-muted-foreground">Hypertension, Type 2 Diabetes</p>
            </div>
            <div>
              <p className="font-medium">Allergies:</p>
              <p className="text-muted-foreground">Penicillin, Shellfish</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-secondary mr-3" />
            <h3 className="text-lg font-semibold">Emergency Response Times</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Ambulance (EMS):</span>
              <span className="font-medium">8-12 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Fire Department:</span>
              <span className="font-medium">5-8 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Police:</span>
              <span className="font-medium">3-6 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Family Notification:</span>
              <span className="font-medium">Immediate</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-emergency/5 border-emergency">
        <div className="flex items-center mb-4">
          <Users className="h-6 w-6 text-emergency mr-3" />
          <h3 className="text-lg font-semibold text-emergency">When to Call for Help</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium mb-2">Call 911 immediately for:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Chest pain or difficulty breathing</li>
              <li>• Severe allergic reactions</li>
              <li>• Loss of consciousness</li>
              <li>• Severe bleeding or injuries</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Contact your doctor for:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Persistent symptoms</li>
              <li>• Medication side effects</li>
              <li>• Regular health concerns</li>
              <li>• Follow-up appointments</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* AI Chatbox */}
      <ChatBox />
    </div>
  );
};