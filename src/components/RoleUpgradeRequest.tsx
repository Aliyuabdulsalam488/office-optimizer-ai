import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface RoleRequest {
  id: string;
  requested_role: string;
  reason: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

const ROLE_OPTIONS = [
  { value: "hr_manager", label: "HR Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "procurement_manager", label: "Procurement Manager" },
  { value: "executive", label: "Executive" },
  { value: "executive_assistant", label: "Executive Assistant" },
  { value: "architect", label: "Architect" },
  { value: "home_builder", label: "Home Builder" },
];

export const RoleUpgradeRequest = () => {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [reason, setReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("role_upgrade_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = async () => {
    if (!selectedRole || !reason.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a role and provide a reason",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("role_upgrade_requests").insert({
        user_id: user.id,
        requested_role: selectedRole as any,
        reason: reason.trim(),
      });

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: "Your role upgrade request has been submitted for review",
      });

      setSelectedRole("");
      setReason("");
      await loadRequests();
    } catch (error: any) {
      toast({
        title: "Error submitting request",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="gap-1 bg-green-500">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const hasPendingRequest = requests.some((r) => r.status === "pending");

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner size="lg" text="Loading requests..." />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <ArrowUpCircle className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">Request Role Upgrade</h3>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="role">Role you want to upgrade to</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for upgrade request</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why you should be upgraded to this role..."
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={submitRequest}
            disabled={submitting || hasPendingRequest}
            className="w-full"
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Request"
            )}
          </Button>

          {hasPendingRequest && (
            <p className="text-sm text-muted-foreground text-center">
              You have a pending request. Wait for review before submitting
              another.
            </p>
          )}
        </div>
      </Card>

      {requests.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Requests</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {ROLE_OPTIONS.find((r) => r.value === request.requested_role)
                        ?.label || request.requested_role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <p className="text-sm">{request.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
