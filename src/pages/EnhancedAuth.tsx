import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, LogIn, UserPlus, Chrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["hr_manager", "employee"]),
  loginMethod: z.enum(["email_link", "email_password", "google"]),
});

const EnhancedAuth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email_link" | "email_password" | "google">("email_password");
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "" },
  });

  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      role: "employee" as const,
      loginMethod: "email_password" as const,
    },
  });

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);

      if (loginMethod === "email_link") {
        const { error } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) throw error;

        toast({
          title: "Check your email",
          description: "We sent you a login link. Click it to sign in.",
        });
      } else {
        // Will show password field for email_password
        toast({
          title: "Email/password login",
          description: "Please enter your password",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user profile to determine redirect
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const redirectPath = profile?.role === "hr_manager" ? "/hr-dashboard" : "/employee-dashboard";
      navigate(redirectPath);

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Google login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSignup = async (data: z.infer<typeof signupSchema>) => {
    try {
      setLoading(true);

      if (data.loginMethod === "google") {
        await handleGoogleLogin();
        return;
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
          data: {
            full_name: data.fullName,
            role: data.role,
            login_method: data.loginMethod,
          },
        },
      });

      if (error) throw error;

      // Track auth method
      if (authData.user) {
        await supabase.from("user_auth_methods").insert({
          user_id: authData.user.id,
          method: data.loginMethod,
          is_primary: true,
        });
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account",
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to TechStora</h1>
          <p className="text-muted-foreground">
            Choose your preferred way to access your account
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN TAB */}
          <TabsContent value="login" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>How would you like to login?</Label>
                <RadioGroup
                  value={loginMethod}
                  onValueChange={(v) => setLoginMethod(v as any)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email_link" id="email-link" />
                    <Label htmlFor="email-link" className="cursor-pointer flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email link (passwordless)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email_password" id="email-password" />
                    <Label htmlFor="email-password" className="cursor-pointer flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Email & Password
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="google" id="google" />
                    <Label htmlFor="google" className="cursor-pointer flex items-center gap-2">
                      <Chrome className="w-4 h-4" />
                      Google
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {loginMethod === "google" ? (
                <Button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full"
                  variant="outline"
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>
              ) : loginMethod === "email_link" ? (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      {...loginForm.register("email")}
                      placeholder="you@example.com"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Login Link
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const email = (e.target as any).email.value;
                    const password = (e.target as any).password.value;
                    handlePasswordLogin(email, password);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="pwd-email">Email</Label>
                    <Input
                      id="pwd-email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pwd-password">Password</Label>
                    <Input
                      id="pwd-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </form>
              )}
            </div>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup" className="space-y-6">
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...signupForm.register("fullName")}
                  placeholder="John Doe"
                />
                {signupForm.formState.errors.fullName && (
                  <p className="text-sm text-destructive mt-1">
                    {signupForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  {...signupForm.register("email")}
                  placeholder="you@example.com"
                />
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Your Role</Label>
                <RadioGroup
                  value={signupForm.watch("role")}
                  onValueChange={(v) => signupForm.setValue("role", v as any)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="employee" id="employee" />
                    <Label htmlFor="employee" className="cursor-pointer">
                      Employee
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hr_manager" id="hr_manager" />
                    <Label htmlFor="hr_manager" className="cursor-pointer">
                      HR Manager
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Preferred Login Method</Label>
                <RadioGroup
                  value={signupForm.watch("loginMethod")}
                  onValueChange={(v) => signupForm.setValue("loginMethod", v as any)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email_password" id="signup-email-password" />
                    <Label htmlFor="signup-email-password" className="cursor-pointer">
                      Email & Password
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email_link" id="signup-email-link" />
                    <Label htmlFor="signup-email-link" className="cursor-pointer">
                      Email link (passwordless)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="google" id="signup-google" />
                    <Label htmlFor="signup-google" className="cursor-pointer">
                      Google
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {signupForm.watch("loginMethod") === "email_password" && (
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    {...signupForm.register("password")}
                    placeholder="••••••••"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 8 characters
                  </p>
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default EnhancedAuth;
