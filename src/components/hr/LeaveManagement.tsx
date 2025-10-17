import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, CheckCircle, XCircle, Clock } from "lucide-react";

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: "vacation" | "sick" | "personal" | "unpaid";
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeName: "John Smith",
    type: "vacation",
    startDate: "2025-10-25",
    endDate: "2025-10-29",
    days: 5,
    status: "pending",
    reason: "Family vacation",
  },
  {
    id: "2",
    employeeName: "Emily Davis",
    type: "sick",
    startDate: "2025-10-18",
    endDate: "2025-10-19",
    days: 2,
    status: "approved",
    reason: "Medical appointment",
  },
  {
    id: "3",
    employeeName: "Robert Wilson",
    type: "personal",
    startDate: "2025-10-22",
    endDate: "2025-10-22",
    days: 1,
    status: "pending",
    reason: "Personal matter",
  },
];

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "vacation": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "sick": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "personal": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "unpaid": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const stats = {
    pending: leaveRequests.filter(r => r.status === "pending").length,
    approved: leaveRequests.filter(r => r.status === "approved").length,
    totalDays: leaveRequests.reduce((sum, r) => sum + r.days, 0),
  };

  return (
    <Card className="p-6 bg-gradient-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h3 className="text-xl font-bold">Leave Management</h3>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Approved (This Month)</p>
          <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
        </Card>
        <Card className="p-4 bg-background/50">
          <p className="text-sm text-muted-foreground mb-1">Total Days Off</p>
          <p className="text-2xl font-bold">{stats.totalDays}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {leaveRequests.map((request) => (
          <Card key={request.id} className="p-4 bg-background/50 border-border hover:border-primary/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold mb-1">{request.employeeName}</h4>
                <p className="text-sm text-muted-foreground">{request.reason}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={getTypeColor(request.type)}>
                  {request.type}
                </Badge>
                <Badge className={`${getStatusColor(request.status)} flex items-center gap-1`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-semibold">{request.startDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-semibold">{request.endDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-semibold">{request.days} day{request.days > 1 ? 's' : ''}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-sm font-semibold capitalize">{request.type}</p>
              </div>
            </div>

            {request.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-red-500 border-red-500 hover:bg-red-500/10">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}

            {request.status === "approved" && (
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20 text-sm text-green-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved leave request
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h4 className="font-semibold mb-2">Leave Balance Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Vacation Days</p>
            <p className="text-lg font-bold">15 remaining</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Sick Days</p>
            <p className="text-lg font-bold">8 remaining</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Personal Days</p>
            <p className="text-lg font-bold">3 remaining</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Used This Year</p>
            <p className="text-lg font-bold">12 days</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LeaveManagement;
