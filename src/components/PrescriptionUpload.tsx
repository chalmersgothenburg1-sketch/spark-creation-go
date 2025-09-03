import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const PrescriptionUpload = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    prescribing_doctor: "",
    start_date: "",
    end_date: "",
    notes: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // Replace with API upload logic
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_BASE_URL}/api/prescriptions/upload`, {
        method: "POST",
        body: form
      });
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user email from localStorage
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) throw new Error("User not authenticated");

      let fileUrl = null;
      const file = fileInputRef.current?.files?.[0];
      
      if (file) {
        fileUrl = await uploadFile(file);
        if (!fileUrl) {
          throw new Error("Failed to upload file");
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: userEmail,
          ...formData,
          file_url: fileUrl,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null
        })
      });
      if (!res.ok) throw new Error("Failed to add prescription");

      toast.success("Prescription added successfully");
      setFormData({
        medication_name: "",
        dosage: "",
        frequency: "",
        prescribing_doctor: "",
        start_date: "",
        end_date: "",
        notes: ""
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error('Error adding prescription:', error);
      toast.error("Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="medication_name">Medication Name *</Label>
        <Input
          id="medication_name"
          value={formData.medication_name}
          onChange={(e) => handleInputChange("medication_name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="dosage">Dosage</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => handleInputChange("dosage", e.target.value)}
            placeholder="e.g., 10mg"
          />
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Input
            id="frequency"
            value={formData.frequency}
            onChange={(e) => handleInputChange("frequency", e.target.value)}
            placeholder="e.g., Twice daily"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="prescribing_doctor">Prescribing Doctor</Label>
        <Input
          id="prescribing_doctor"
          value={formData.prescribing_doctor}
          onChange={(e) => handleInputChange("prescribing_doctor", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleInputChange("start_date", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleInputChange("end_date", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="prescription_file">Upload Prescription</Label>
        <Input
          id="prescription_file"
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
            <FileText className="h-4 w-4 mr-2" />
            Add Prescription
          </>
        )}
      </Button>
    </form>
  );
};