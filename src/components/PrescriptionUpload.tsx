import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, FileText } from "lucide-react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

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