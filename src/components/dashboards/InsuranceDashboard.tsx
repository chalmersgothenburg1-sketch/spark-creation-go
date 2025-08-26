import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Shield, Calendar, Download, CheckCircle } from "lucide-react";
import { InsuranceUpload } from "@/components/InsuranceUpload";
import { ChatBox } from "@/components/ChatBox";

const insuranceDocuments = [
  {
    id: 1,
    fileName: "Insurance_Card_2024.pdf",
    uploadDate: "2024-01-01",
    documentType: "Insurance Card",
    provider: "BlueCross BlueShield",
    policyNumber: "ABC123456789",
    status: "active",
    expiryDate: "2024-12-31"
  },
  {
    id: 2,
    fileName: "Medicare_Card_2024.pdf",
    uploadDate: "2024-01-01", 
    documentType: "Medicare Card",
    provider: "Medicare",
    policyNumber: "1AB-CD2-EF34",
    status: "active",
    expiryDate: "2024-12-31"
  },
  {
    id: 3,
    fileName: "Insurance_Card_2023.pdf",
    uploadDate: "2023-01-01",
    documentType: "Insurance Card", 
    provider: "BlueCross BlueShield",
    policyNumber: "ABC123456789",
    status: "expired",
    expiryDate: "2023-12-31"
  }
];

export const InsuranceDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Insurance Management</h2>
        <Badge variant="secondary">Insurance Portal</Badge>
      </div>

      {/* Upload Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Insurance Documents
        </h3>
        <InsuranceUpload />
      </Card>

      {/* Current Active Insurance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Current Active Insurance
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insuranceDocuments
            .filter(doc => doc.status === 'active')
            .map((document) => (
            <div key={document.id} className="p-4 border border-primary/20 bg-primary/5 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-foreground">{document.documentType}</p>
                  <p className="text-sm text-muted-foreground">{document.provider}</p>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-primary mr-1" />
                  <Badge variant="default" className="bg-primary text-primary-foreground">Active</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Policy Number:</p>
                    <p className="font-medium">{document.policyNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Expires:</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Uploaded: {new Date(document.uploadDate).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Download {document.documentType}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Coverage Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Coverage Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground">Medical Coverage</p>
            <p className="text-sm text-muted-foreground mb-2">Primary Insurance</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Deductible:</span>
                <span className="font-medium">$1,500</span>
              </div>
              <div className="flex justify-between">
                <span>Co-pay:</span>
                <span className="font-medium">$20</span>
              </div>
              <div className="flex justify-between">
                <span>Out-of-pocket max:</span>
                <span className="font-medium">$6,000</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground">Prescription Coverage</p>
            <p className="text-sm text-muted-foreground mb-2">Included in Primary</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Generic:</span>
                <span className="font-medium">$10</span>
              </div>
              <div className="flex justify-between">
                <span>Brand:</span>
                <span className="font-medium">$30</span>
              </div>
              <div className="flex justify-between">
                <span>Specialty:</span>
                <span className="font-medium">$50</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium text-foreground">Emergency Services</p>
            <p className="text-sm text-muted-foreground mb-2">24/7 Coverage</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Emergency Room:</span>
                <span className="font-medium">$250</span>
              </div>
              <div className="flex justify-between">
                <span>Ambulance:</span>
                <span className="font-medium">$150</span>
              </div>
              <div className="flex justify-between">
                <span>Urgent Care:</span>
                <span className="font-medium">$50</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Previous Insurance Documents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Previous Insurance Documents</h3>
        <div className="space-y-4">
          {insuranceDocuments
            .filter(doc => doc.status === 'expired')
            .map((document) => (
            <div key={document.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground">{document.fileName}</p>
                    <Badge variant="secondary">Expired</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Provider:</p>
                      <p className="font-medium">{document.provider}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Policy Number:</p>
                      <p className="font-medium">{document.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Upload Date:</p>
                      <p className="font-medium">{new Date(document.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expired:</p>
                      <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
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

      {/* Insurance Guidelines */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <h3 className="text-lg font-semibold mb-4">Insurance Document Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">Required Documents:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Primary insurance card (front & back)</li>
              <li>• Medicare card (if applicable)</li>
              <li>• Supplemental insurance documents</li>
              <li>• Benefits summary</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Upload Requirements:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Clear, high-resolution images</li>
              <li>• All text must be legible</li>
              <li>• File formats: PDF, JPG, PNG</li>
              <li>• Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </Card>
      
      {/* AI Chatbox */}
      <ChatBox />
    
    </div>
  );
};