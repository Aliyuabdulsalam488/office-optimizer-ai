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
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, Lock, LogIn, UserPlus, Chrome, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessSetupForm } from "@/components/BusinessSetupForm";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import { RoleSpecificSignupFields } from "@/components/RoleSpecificSignupFields";
import { logUserActivity } from "@/utils/activityLogger";

const loginSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
});

const signupSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Invalid email address").max(255),
    password: z.string().optional(),
    fullName: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100)
      .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
    role: z.enum([
      "employee",
      "hr_manager",
      "finance_manager",
      "procurement_manager",
      "sales_manager",
      "executive",
      "executive_assistant",
      "architect",
      "home_builder",
    ]),
    loginMethod: z.enum(["email_link", "email_password", "google"]),
  })
  .superRefine((val, ctx) => {
    if (val.loginMethod === "email_password") {
      if (!val.password || val.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must be at least 8 characters",
        });
      } else if (!/[A-Z]/.test(val.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain at least one uppercase letter",
        });
      } else if (!/[a-z]/.test(val.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain at least one lowercase letter",
        });
      } else if (!/[0-9]/.test(val.password)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "Password must contain at least one number",
        });
      }
    }
  });

const EnhancedAuth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email_link" | "email_password" | "google">("email_password");
  const [showBusinessSetup, setShowBusinessSetup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [roleSpecificData, setRoleSpecificData] = useState<any>({});
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

      // Get user role to determine redirect
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      const role = userRoles?.[0]?.role?.toString();
      
      // Role-based routing map
      const roleRoutes: Record<string, string> = {
        hr_manager: "/hr-dashboard",
        finance_manager: "/finance-dashboard",
        architect: "/architect-dashboard",
        home_builder: "/home-builder-dashboard",
        executive: "/executive-dashboard",
        executive_assistant: "/ea-dashboard",
        sales_manager: "/sales-dashboard",
        procurement_manager: "/procurement-dashboard",
        employee: "/employee-dashboard",
        admin: "/dashboard",
      };
      
      navigate(roleRoutes[role] || "/employee-dashboard");

      // Log login activity
      await logUserActivity("login", data.user.id);

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
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
          // Avoid immediate hard redirect so we can handle errors gracefully
          skipBrowserRedirect: true,
        } as any,
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Safe to redirect now
        window.location.href = data.url;
      } else {
        throw new Error("Google provider did not return a redirect URL");
      }
    } catch (error: any) {
      const msg = (error?.message || "").toLowerCase();
      const providerDisabled = msg.includes("provider is not enabled") || msg.includes("unsupported provider");
      toast({
        title: providerDisabled ? "Google Sign-in not enabled" : "Google login failed",
        description: providerDisabled
          ? "Enable Google in your backend auth settings, then try again."
          : (error.message || "An unexpected error occurred"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

const handleSignup = async (data: z.infer<typeof signupSchema>) => {
  try {
    setLoading(true);

    // Handle provider-specific signups
    if (data.loginMethod === "google") {
      await handleGoogleLogin();
      return;
    }

    if (data.loginMethod === "email_link") {
      // Send a magic link for passwordless sign up
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description:
          "We've sent you a sign-in link to finish creating your account.",
      });
      return;
    }

    // Email & password signup
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password!,
      options: {
        emailRedirectTo: `${window.location.origin}/onboarding`,
        data: {
          full_name: data.fullName,
          preferred_role: data.role,
          login_method: data.loginMethod,
        },
      },
    });

    if (error) throw error;

    // Call edge function to assign role from metadata
    if (authData.session?.user) {
      try {
        await supabase.functions.invoke('assign-user-role', {
          headers: {
            Authorization: `Bearer ${authData.session.access_token}`
          }
        });
      } catch (roleError) {
        console.error('Error assigning role:', roleError);
        // Don't block signup if role assignment fails
      }
    }

    // Only attempt DB writes if we have an authenticated session (auto-confirm enabled)
    if (authData.session?.user) {
      try {
        await supabase.from("user_auth_methods").insert([
          {
            user_id: authData.session.user.id,
            method: data.loginMethod,
            is_primary: true,
          },
        ]);

        // Store role-specific data if provided
        if (Object.keys(roleSpecificData).length > 0) {
          await supabase.from("role_specific_data").insert([{
            user_id: authData.session.user.id,
            role: data.role as any,
            data: roleSpecificData,
          }]);
        }
      } catch {
        // Non-fatal during sign up
      }

      // IMPORTANT: Roles are managed securely by admins/backend functions.
      // Do not insert into user_roles from the client at signup time.
    }

    const needsBusinessSetup = [
      "hr_manager",
      "finance_manager",
      "procurement_manager",
      "sales_manager",
      "executive",
      "admin",
      "architect",
      "home_builder",
    ].includes(data.role);

    if (needsBusinessSetup && authData.session?.user) {
      setShowBusinessSetup(true);
      toast({
        title: "Account created!",
        description: "Let's set up your business information",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account",
      });
    }
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

  if (showBusinessSetup) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-4">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-6">
            <Button onClick={() => setShowBusinessSetup(false)} variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
          <BusinessSetupForm onComplete={() => {
            toast({
              title: "Setup complete!",
              description: "Please check your email to verify your account",
            });
            setShowBusinessSetup(false);
          }} />
        </div>
      </div>
    );
  }

  return (
    <>
      {loading && <LoadingOverlay text="Processing..." />}
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
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Chrome className="w-4 h-4 mr-2" />
                  )}
                  {loading ? "Connecting..." : "Continue with Google"}
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
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Sending..." : "Send Login Link"}
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
                    <div className="relative">
                      <Input
                        id="pwd-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    {loading ? "Signing in..." : "Sign In"}
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
                  className="mt-2 grid grid-cols-2 gap-3"
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="finance_manager" id="finance_manager" />
                    <Label htmlFor="finance_manager" className="cursor-pointer">
                      Finance Manager
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="procurement_manager" id="procurement_manager" />
                    <Label htmlFor="procurement_manager" className="cursor-pointer">
                      Procurement Manager
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sales_manager" id="sales_manager" />
                    <Label htmlFor="sales_manager" className="cursor-pointer">
                      Sales Manager
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive" id="executive" />
                    <Label htmlFor="executive" className="cursor-pointer">
                      Executive
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="architect" id="architect" />
                    <Label htmlFor="architect" className="cursor-pointer">
                      Architect
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home_builder" id="home_builder" />
                    <Label htmlFor="home_builder" className="cursor-pointer">
                      Home Builder
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="executive_assistant" id="executive_assistant" />
                    <Label htmlFor="executive_assistant" className="cursor-pointer">
                      Executive Assistant
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
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      {...signupForm.register("password")}
                      placeholder="••••••••"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              )}

              <RoleSpecificSignupFields
                role={signupForm.watch("role")}
                data={roleSpecificData}
                onChange={(field, value) => setRoleSpecificData({ ...roleSpecificData, [field]: value })}
              />

              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
    </>
  );
};

export default EnhancedAuth;
