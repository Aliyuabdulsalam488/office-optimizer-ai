import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Shield, Bell, Moon, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmailVerificationStatus } from "@/components/EmailVerificationStatus";

const ProfileSettings = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      // Get user roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      setUser(user);
      setProfile({ ...profileData, roles: userRoles || [] });
      setPreferences(profileData?.preferences || {});
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          preferences,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error saving settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePreference = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={() => navigate(-1)} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground mb-8">
          Manage your account preferences and settings
        </p>

        <div className="space-y-6">
          {/* Email Verification Status */}
          <EmailVerificationStatus />

          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  value={profile?.full_name || ""}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <Label>Role(s)</Label>
                <Input
                  value={profile?.roles?.map((r: any) => {
                    const role = r.role.toString();
                    return role === "hr_manager" ? "HR Manager" :
                           role === "finance_manager" ? "Finance Manager" :
                           role === "procurement_manager" ? "Procurement Manager" :
                           role === "sales_manager" ? "Sales Manager" :
                           role === "executive" ? "Executive" :
                           role === "architect" ? "Architect" :
                           role === "home_builder" ? "Home Builder" :
                           role === "admin" ? "Admin" : "Employee";
                  }).join(", ") || "Employee"}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div>
                <Label>Login Method</Label>
                <Input
                  value={
                    profile?.login_method === "email_link"
                      ? "Email Link (Passwordless)"
                      : profile?.login_method === "google"
                      ? "Google"
                      : "Email & Password"
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and notifications via email
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications_enabled || false}
                  onCheckedChange={(checked) =>
                    handleUpdatePreference("notifications_enabled", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-primary" />
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark theme across the platform
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.dark_mode || false}
                  onCheckedChange={(checked) =>
                    handleUpdatePreference("dark_mode", checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.two_factor_enabled || false}
                  onCheckedChange={(checked) =>
                    handleUpdatePreference("two_factor_enabled", checked)
                  }
                />
              </div>
            </div>
          </Card>

          {/* Optional Features */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Optional Features</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enhance your account with these optional features
            </p>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  toast({
                    title: "Coming soon",
                    description: "Profile photo upload will be available soon",
                  })
                }
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Profile Photo
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  toast({
                    title: "Coming soon",
                    description: "Advanced security options will be available soon",
                  })
                }
              >
                <Shield className="w-4 h-4 mr-2" />
                Configure 2FA
              </Button>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              onClick={handleSavePreferences}
              disabled={saving}
              className="bg-gradient-primary"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button onClick={() => navigate(-1)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
