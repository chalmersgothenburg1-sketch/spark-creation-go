import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star,
  Plus,
  X,
  Send,
  FileText,
  Activity
} from "lucide-react";
import { toast } from "sonner";

interface Symptom {
  id: string;
  name: string;
  severity: number;
  duration: string;
}

interface DiagnosisResult {
  condition: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
}

export const ClinicalDiagnosisDashboard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const addSymptom = () => {
    if (!newSymptom.trim() || !duration.trim()) {
      toast.error("Please fill in all symptom details");
      return;
    }

    const symptom: Symptom = {
      id: Date.now().toString(),
      name: newSymptom,
      severity: selectedSeverity,
      duration: duration
    };

    setSymptoms([...symptoms, symptom]);
    setNewSymptom("");
    setDuration("");
    setSelectedSeverity(5);
    toast.success("Symptom added successfully");
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error("Please add at least one symptom");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults: DiagnosisResult[] = [
        {
          condition: "Upper Respiratory Infection",
          probability: 78,
          severity: 'medium',
          description: "Common viral infection affecting the nose, throat, and sinuses. Usually resolves within 7-10 days.",
          recommendations: [
            "Rest and stay hydrated",
            "Use over-the-counter pain relievers if needed",
            "Consider throat lozenges for sore throat",
            "Monitor symptoms and seek medical care if worsening"
          ]
        },
        {
          condition: "Allergic Rhinitis",
          probability: 45,
          severity: 'low',
          description: "Inflammation of nasal passages due to allergens. Can be seasonal or year-round.",
          recommendations: [
            "Identify and avoid allergen triggers",
            "Consider antihistamines",
            "Use nasal saline rinses",
            "Consult an allergist for testing"
          ]
        },
        {
          condition: "Sinusitis",
          probability: 32,
          severity: 'medium',
          description: "Inflammation of the sinuses, often following a cold or due to allergies.",
          recommendations: [
            "Use warm compresses on face",
            "Stay hydrated and rest",
            "Consider decongestants",
            "See a doctor if symptoms persist beyond 10 days"
          ]
        }
      ];
      
      setResults(mockResults);
      setIsAnalyzing(false);
      setCurrentStep(3);
      toast.success("Analysis complete");
    }, 3000);
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityLabel = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return 'Low Risk';
      case 'medium': return 'Medium Risk';
      case 'high': return 'High Risk';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clinical Diagnosis Tool</h1>
          <p className="text-muted-foreground">AI-powered symptom checker and health assessment</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <Stethoscope className="h-4 w-4 mr-2" />
            Powered by AI
          </Badge>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                1
              </div>
              <span className={currentStep >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Add Symptoms
              </span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                2
              </div>
              <span className={currentStep >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Analyze
              </span>
            </div>
            <div className={`h-0.5 flex-1 mx-4 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                3
              </div>
              <span className={currentStep >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Results
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Add Symptoms */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Symptoms
              </CardTitle>
              <CardDescription>
                Describe your symptoms in detail to get an accurate assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptom">Symptom</Label>
                <Input
                  id="symptom"
                  placeholder="e.g., headache, fever, cough"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Severity (1-10)</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={selectedSeverity}
                    onChange={(e) => setSelectedSeverity(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <Badge variant="outline">{selectedSeverity}/10</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 2 days, 1 week"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
              
              <Button onClick={addSymptom} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Symptom
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Current Symptoms ({symptoms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {symptoms.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No symptoms added yet. Add your first symptom to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {symptoms.map((symptom) => (
                    <div key={symptom.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{symptom.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>Severity: {symptom.severity}/10</span>
                          <span>Duration: {symptom.duration}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSymptom(symptom.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Label htmlFor="additional">Additional Information (Optional)</Label>
                    <Textarea
                      id="additional"
                      placeholder="Any additional details about your symptoms, medical history, or current medications..."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    onClick={() => setCurrentStep(2)} 
                    className="w-full mt-4"
                    disabled={symptoms.length === 0}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Proceed to Analysis
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Analysis */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis
            </CardTitle>
            <CardDescription>
              Ready to analyze your symptoms using advanced AI algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isAnalyzing ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Symptoms to Analyze:</h4>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <Badge key={symptom.id} variant="secondary">
                        {symptom.name} ({symptom.severity}/10)
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Edit
                  </Button>
                  <Button onClick={analyzeSymptoms} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Start Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-medium">Analyzing your symptoms...</h3>
                <p className="text-muted-foreground">
                  Our AI is processing your symptoms and cross-referencing with medical databases
                </p>
                <Progress value={66} className="w-full max-w-md mx-auto" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Analysis Complete
              </CardTitle>
              <CardDescription>
                Based on your symptoms, here are the possible conditions ranked by likelihood
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{result.condition}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(result.severity)}>
                        {getSeverityLabel(result.severity)}
                      </Badge>
                      <Badge variant="outline">{result.probability}% match</Badge>
                    </div>
                  </div>
                  <CardDescription>{result.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">Important Notice</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    This is an AI-powered assessment tool and should not replace professional medical advice. 
                    Please consult with a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => {
              setCurrentStep(1);
              setSymptoms([]);
              setResults([]);
            }}>
              Start New Assessment
            </Button>
            <Button onClick={() => toast.success("Results saved to your health records")}>
              <FileText className="h-4 w-4 mr-2" />
              Save Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};