import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, EyeOff, Heart } from "lucide-react";
import { PlansSection } from "@/components/PlansSection";
import { ContactSection } from "@/components/ContactSection";
import { OTPVerification } from "@/components/OTPVerification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const navigate = useNavigate();

  const signUp = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const data = await res.json();
        return { error: { message: data.message || "Signup failed" } };
      }
      return { error: null };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: { message: data.detail || "Login failed" } };
      }
      // Save token, uid, and email in localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userEmail", email);
      if (data.uid) {
        localStorage.setItem("uid", data.uid);
      }
      return { error: null };
    } catch (err) {
      return { error: { message: "Network error" } };
    }
  };

  // const signInWithGoogle = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/dashboard`
  //     }
  //   });
  //   if (error) {
  //     toast.error("Failed to sign in with Google");
  //   }
  // };

  // const signInWithFacebook = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'facebook',
  //     options: {
  //       redirectTo: `${window.location.origin}/dashboard`
  //     }
  //   });
  //   if (error) {
  //     toast.error("Failed to sign in with Facebook");
  //   }
  // };

  const handleAuth = async (type: 'signin' | 'signup') => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (type === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.toLowerCase().includes("exists")) {
            toast.error("An account with this email already exists. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        // Show OTP verification for signup
        setSignupEmail(email);
        setShowOTP(true);
        toast.success("Account created! Please verify your email.");
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.toLowerCase().includes("invalid")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    toast.success("Email verified successfully! You can now sign in.");
    // Reset form and switch to signin tab
    setEmail("");
    setPassword("");
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
    setSignupEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-2xl font-bold text-foreground">Health Monitor</h1>
          </div>
          <p className="text-muted-foreground">
            Access your health dashboard and emergency monitoring
          </p>
        </div>

        {showOTP ? (
          <OTPVerification
            email={signupEmail}
            onBack={handleBackFromOTP}
            onVerified={handleOTPVerified}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAuth('signin')}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAuth('signup')}
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>

                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            ← Back to homepage
          </Button>
        </div>
      </div>
    </div>
  );
};