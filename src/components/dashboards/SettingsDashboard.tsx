import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  User, 
  Phone, 
  Lock, 
  AlertTriangle, 
  Bell, 
  Shield, 
  Save,
  Edit
} from "lucide-react";

export const SettingsDashboard = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState({
    profile: false,
    emergency: false,
    contact: false,
    password: false
  });

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Smith", 
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    emergencyContact: "(555) 987-6543",
    emergencyName: "Mary Smith",
    emergencyRelation: "Spouse",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = (section: string) => {
    toast({
      title: "Settings Updated",
      description: `Your ${section} information has been successfully updated.`,
    });
    setIsEditing(prev => ({ ...prev, [section]: false }));
  };

  const handleEdit = (section: string) => {
    setIsEditing(prev => ({ ...prev, [section]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Account Settings</h2>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary">Settings Portal</Badge>
          <ThemeToggle /> {/* 👈 Theme toggle now lives in settings */}
        </div>
      </div>

      {/* Profile Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <User className="h-5 w-5 mr-2" />
            Profile Information
          </h3>
          {!isEditing.profile ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit('profile')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(prev => ({ ...prev, profile: false }))}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave('profile')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing.profile}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing.profile}
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={!isEditing.profile}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={!isEditing.profile}
            />
          </div>
        </div>
      </Card>

      {/* Emergency Contact Information */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Emergency Contact Information
          </h3>
          {!isEditing.emergency ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit('emergency')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(prev => ({ ...prev, emergency: false }))}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave('emergency contact')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="emergencyName">Emergency Contact Name</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyName}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyName: e.target.value }))}
              disabled={!isEditing.emergency}
            />
          </div>
          <div>
            <Label htmlFor="emergencyContact">Emergency Phone Number</Label>
            <Input
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              disabled={!isEditing.emergency}
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelation">Relationship</Label>
            <Input
              id="emergencyRelation"
              value={formData.emergencyRelation}
              onChange={(e) => setFormData(prev => ({ ...prev, emergencyRelation: e.target.value }))}
              disabled={!isEditing.emergency}
            />
          </div>
        </div>
      </Card>

      {/* Password Change */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Change Password
          </h3>
          {!isEditing.password ? (
            <Button variant="outline" size="sm" onClick={() => handleEdit('password')}>
              <Edit className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(prev => ({ ...prev, password: false }))}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => handleSave('password')}>
                <Save className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          )}
        </div>
        
        {isEditing.password && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
        )}
        
        {!isEditing.password && (
          <p className="text-sm text-muted-foreground">
            Password was last changed on January 15, 2024
          </p>
        )}
      </Card>

      {/* Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Health Alerts</p>
              <p className="text-sm text-muted-foreground">Receive notifications about health readings</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Emergency Notifications</p>
              <p className="text-sm text-muted-foreground">Critical alerts and emergency responses</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Medication Reminders</p>
              <p className="text-sm text-muted-foreground">Daily medication and appointment reminders</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Security & Privacy
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Data Privacy Settings</p>
              <p className="text-sm text-muted-foreground">Manage how your health data is shared</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Download My Data</p>
              <p className="text-sm text-muted-foreground">Export all your health data and documents</p>
            </div>
            <Button variant="outline" size="sm">Download</Button>
          </div>
        </div>
      </Card>

      {/* Device Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Device & Monitoring Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="font-medium mb-2">Connected Devices</p>
            <div className="space-y-2">
              <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Watch Pro</p>
                  <p className="text-sm text-muted-foreground">Connected • Battery: 78%</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Manage Devices
              </Button>
            </div>
          </div>
          
          <div>
            <p className="font-medium mb-2">Monitoring Frequency</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Heart Rate:</span>
                <span className="font-medium">Every 5 minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Blood Pressure:</span>
                <span className="font-medium">4 times daily</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Activity Tracking:</span>
                <span className="font-medium">Continuous</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Adjust Settings
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};