import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Calendar, Clock, Download } from "lucide-react";
import { PrescriptionUpload } from "@/components/PrescriptionUpload";
import { ChatBox } from "@/components/ChatBox";

const previousPrescriptions = [
  {
    id: 1,
    fileName: "Prescription_Jan2024.pdf",
    uploadDate: "2024-01-15",
    medications: ["Lisinopril 10mg", "Metformin 500mg"],
    doctor: "Dr. Sarah Johnson",
    status: "active"
  },
  {
    id: 2,
    fileName: "Prescription_Dec2023.pdf", 
    uploadDate: "2023-12-10",
    medications: ["Aspirin 81mg", "Vitamin D 1000 IU"],
    doctor: "Dr. Sarah Johnson",
    status: "expired"
  },
  {
    id: 3,
    fileName: "Prescription_Nov2023.pdf",
    uploadDate: "2023-11-05", 
    medications: ["Lisinopril 5mg", "Multivitamin"],
    doctor: "Dr. Mike Chen",
    status: "expired"
  }
];

export const PrescriptionDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Prescription Management</h2>
        <Badge variant="secondary">Prescription Portal</Badge>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload New Prescription
        </h3>
        <PrescriptionUpload />
      </Card>

      {/* Current Active Prescriptions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Current Active Prescriptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previousPrescriptions
            .filter(p => p.status === 'active')
            .map((prescription) => (
            <div key={prescription.id} className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{prescription.fileName}</p>
                  <p className="text-sm text-muted-foreground">Dr. {prescription.doctor}</p>
                </div>
                <Badge variant="default" className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Uploaded: {new Date(prescription.uploadDate).toLocaleDateString()}
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Medications:</p>
                  <ul className="text-sm text-muted-foreground">
                    {prescription.medications.map((med, index) => (
                      <li key={index}>• {med}</li>
                    ))}
                  </ul>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Previous Prescriptions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Previous Prescriptions
        </h3>
        <div className="space-y-4">
          {previousPrescriptions
            .filter(p => p.status === 'expired')
            .map((prescription) => (
            <div key={prescription.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{prescription.fileName}</p>
                    <Badge variant="secondary">Expired</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Doctor:</p>
                      <p className="font-medium">{prescription.doctor}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Upload Date:</p>
                      <p className="font-medium">{new Date(prescription.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Medications:</p>
                      <p className="font-medium">{prescription.medications.length} items</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Prescription Guidelines */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="text-lg font-semibold mb-4">Prescription Upload Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">Accepted File Types:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• PDF documents</li>
              <li>• High-resolution images (JPG, PNG)</li>
              <li>• Scanned documents</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Requirements:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Clear, readable text</li>
              <li>• Complete prescription information</li>
              <li>• Doctor's signature visible</li>
              <li>• File size under 10MB</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* AI Chatbox */}
      <ChatBox />
    </div>
  );
};