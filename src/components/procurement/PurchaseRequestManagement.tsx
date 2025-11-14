import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, CheckCircle, XCircle, FileEdit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PurchaseRequestForm from "./PurchaseRequestForm";

interface PurchaseRequest {
  id: string;
  pr_number: string;
  department: string;
  description: string;
  status: string;
  total_amount: number;
  requested_date: string;
  requested_by: string;
}

const PurchaseRequestManagement = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("purchase_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching purchase requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const updateData: any = { status: newStatus };
      if (newStatus === "reviewed" || newStatus === "approved") {
        updateData.reviewed_by = user.id;
        updateData.reviewed_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from("purchase_requests")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Purchase request ${newStatus}`,
      });
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleConvertToPO = async (pr: PurchaseRequest) => {
    // This would open a PO creation form pre-filled with PR data
    toast({
      title: "Converting to Purchase Order",
      description: "This feature will be implemented with PO management",
    });
  };

  const filteredRequests = requests.filter((req) =>
    req.pr_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-500";
      case "submitted": return "bg-blue-500";
      case "reviewed": return "bg-yellow-500";
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "converted": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedRequest(null);
    fetchRequests();
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchase Requests</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchase requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No purchase requests found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{request.pr_number}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Department</p>
                            <p className="font-medium">{request.department}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date(request.requested_date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Amount</p>
                            <p className="font-medium">${request.total_amount?.toLocaleString() || "0"}</p>
                          </div>
                        </div>
                        {request.description && (
                          <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {request.status === "submitted" && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStatusUpdate(request.id, "approved")}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleStatusUpdate(request.id, "rejected")}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConvertToPO(request)}
                          >
                            <FileEdit className="h-4 w-4 mr-1" />
                            Convert to PO
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Request</DialogTitle>
          </DialogHeader>
          <PurchaseRequestForm onClose={handleFormClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PurchaseRequestManagement;