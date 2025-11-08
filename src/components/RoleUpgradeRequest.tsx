import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpCircle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const AVAILABLE_ROLES = [
  { value: "hr_manager", label: "HR Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "procurement_manager", label: "Procurement Manager" },
  { value: "executive", label: "Executive" },
  { value: "executive_assistant", label: "Executive Assistant" },
  { value: "architect", label: "Architect" },
  { value: "home_builder", label: "Home Builder" },
];

interface RoleRequest {
  id: string;
  requested_role: string;
  reason: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

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
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("role_upgrade_requests")
        .insert([{
          user_id: user.id,
          requested_role: selectedRole as any,
          reason: reason.trim(),
        }]);

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
        return <Badge variant="outline" className="bg-yellow-500/10"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner size="sm" text="Loading requests..." />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ArrowUpCircle className="w-6 h-6 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Request Role Upgrade</h3>
            <p className="text-sm text-muted-foreground">
              Request access to additional roles and responsibilities
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Requested Role</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Reason for Request
            </label>
            <Textarea
              placeholder="Explain why you need this role and how you'll use it..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={submitRequest}
            disabled={submitting || !selectedRole || !reason.trim()}
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
                  <div className="font-medium">
                    {AVAILABLE_ROLES.find((r) => r.value === request.requested_role)?.label || request.requested_role}
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                {request.reason && (
                  <p className="text-sm text-muted-foreground">{request.reason}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  Submitted: {new Date(request.created_at).toLocaleDateString()}
                  {request.reviewed_at && (
                    <> • Reviewed: {new Date(request.reviewed_at).toLocaleDateString()}</>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
