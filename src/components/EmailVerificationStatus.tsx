import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const EmailVerificationStatus = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error: any) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!user?.email) return;

    try {
      setResending(true);
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });
    } catch (error: any) {
      toast({
        title: "Error sending email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-4">
        <LoadingSpinner size="sm" />
      </Card>
    );
  }

  if (!user) return null;

  const isVerified = user.email_confirmed_at !== null;

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {isVerified ? (
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
        ) : (
          <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">
            {isVerified ? "Email Verified" : "Email Not Verified"}
          </h3>
          {isVerified ? (
            <p className="text-sm text-muted-foreground">
              Your email address {user.email} has been verified.
            </p>
          ) : (
            <>
              <Alert className="mb-4">
                <Mail className="w-4 h-4" />
                <AlertDescription>
                  Please verify your email address {user.email} to access all
                  features. Check your inbox for the verification link.
                </AlertDescription>
              </Alert>
              <Button
                onClick={resendVerificationEmail}
                disabled={resending}
                variant="outline"
                size="sm"
              >
                {resending ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
