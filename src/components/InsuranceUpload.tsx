import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Shield } from "lucide-react";

export const InsuranceUpload = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    provider_name: "",
    policy_number: "",
    group_number: "",
    coverage_type: "",
    expiry_date: "",
    emergency_contact_number: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('insurance')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('insurance')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      let fileUrl = null;
      const file = fileInputRef.current?.files?.[0];
      
      if (file) {
        fileUrl = await uploadFile(file);
        if (!fileUrl) {
          throw new Error("Failed to upload file");
        }
      }

      const { error } = await (supabase as any)
        .from('insurance_details')
        .insert({
          user_id: user.id,
          ...formData,
          file_url: fileUrl,
          expiry_date: formData.expiry_date || null
        });

      if (error) throw error;

      toast.success("Insurance details added successfully");
      setFormData({
        provider_name: "",
        policy_number: "",
        group_number: "",
        coverage_type: "",
        expiry_date: "",
        emergency_contact_number: ""
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error adding insurance details:', error);
      toast.error("Failed to add insurance details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="provider_name">Insurance Provider *</Label>
        <Input
          id="provider_name"
          value={formData.provider_name}
          onChange={(e) => handleInputChange("provider_name", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="policy_number">Policy Number *</Label>
        <Input
          id="policy_number"
          value={formData.policy_number}
          onChange={(e) => handleInputChange("policy_number", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="group_number">Group Number</Label>
          <Input
            id="group_number"
            value={formData.group_number}
            onChange={(e) => handleInputChange("group_number", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="coverage_type">Coverage Type</Label>
          <Input
            id="coverage_type"
            value={formData.coverage_type}
            onChange={(e) => handleInputChange("coverage_type", e.target.value)}
            placeholder="e.g., Health, Dental"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="expiry_date">Policy Expiry Date</Label>
        <Input
          id="expiry_date"
          type="date"
          value={formData.expiry_date}
          onChange={(e) => handleInputChange("expiry_date", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="emergency_contact_number">Emergency Contact Number</Label>
        <Input
          id="emergency_contact_number"
          type="tel"
          value={formData.emergency_contact_number}
          onChange={(e) => handleInputChange("emergency_contact_number", e.target.value)}
          placeholder="24/7 insurance emergency line"
        />
      </div>

      <div>
        <Label htmlFor="insurance_file">Upload Insurance Card/Documents</Label>
        <Input
          id="insurance_file"
          type="file"
          ref={fileInputRef}
          accept=".pdf,.jpg,.jpeg,.png"
          className="cursor-pointer"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Accepted formats: PDF, JPG, PNG
        </p>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Upload className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4 mr-2" />
            Add Insurance Details
          </>
        )}
      </Button>
    </form>
  );
};