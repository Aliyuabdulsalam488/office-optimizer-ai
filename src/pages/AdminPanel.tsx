import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
}

const AVAILABLE_ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "hr_manager", label: "HR Manager" },
  { value: "finance_manager", label: "Finance Manager" },
  { value: "sales_manager", label: "Sales Manager" },
  { value: "procurement_manager", label: "Procurement Manager" },
  { value: "executive", label: "Executive" },
  { value: "executive_assistant", label: "Executive Assistant" },
  { value: "architect", label: "Architect" },
  { value: "home_builder", label: "Home Builder" },
  { value: "employee", label: "Employee" },
];

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email?.toLowerCase().includes(query) ||
            user.full_name?.toLowerCase().includes(query) ||
            user.roles.some((role) => role.toLowerCase().includes(query))
        )
      );
    }
  }, [searchQuery, users]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const isAdmin = userRoles?.some((r) => r.role.toString() === "admin");

      if (!isAdmin) {
        toast({
          title: "Access denied",
          description: "This panel is for administrators only",
          variant: "destructive",
        });
        navigate("/employee-dashboard");
        return;
      }

      await loadUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      navigate("/auth");
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, created_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Get all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: User[] = (profiles || []).map((profile) => ({
        id: profile.id,
        email: profile.email || "",
        full_name: profile.full_name || "N/A",
        created_at: profile.created_at || "",
        roles: allRoles
          ?.filter((r) => r.user_id === profile.id)
          .map((r) => r.role.toString()) || [],
      }));

      setUsers(usersWithRoles);
      setFilteredUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Error loading users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openRoleDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles);
    setShowRoleDialog(true);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const updateUserRoles = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingRoles(true);

      // Get current roles
      const currentRoles = selectedUser.roles;
      const newRoles = selectedRoles;

      // Roles to add
      const rolesToAdd = newRoles.filter((role) => !currentRoles.includes(role));

      // Roles to remove
      const rolesToRemove = currentRoles.filter((role) => !newRoles.includes(role));

      // Add new roles
      if (rolesToAdd.length > 0) {
        const { error: insertError } = await supabase.from("user_roles").insert(
          rolesToAdd.map((role) => ({
            user_id: selectedUser.id,
            role: role as any,
          }))
        );

        if (insertError) throw insertError;
      }

      // Remove old roles
      if (rolesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", selectedUser.id)
          .in("role", rolesToRemove as any);

        if (deleteError) throw deleteError;
      }

      toast({
        title: "Roles updated",
        description: `Updated roles for ${selectedUser.email}`,
      });

      setShowRoleDialog(false);
      await loadUsers();
    } catch (error: any) {
      toast({
        title: "Error updating roles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingRoles(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading admin panel..." />
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle="Manage users and their roles"
      icon={<Shield className="w-8 h-8 text-primary" />}
    >
      {/* Search and Actions */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={loadUsers} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Administrators</div>
          <div className="text-2xl font-bold">
            {users.filter((u) => u.roles.includes("admin")).length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Managers</div>
          <div className="text-2xl font-bold">
            {
              users.filter((u) =>
                u.roles.some((r) => r.includes("manager"))
              ).length
            }
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Employees</div>
          <div className="text-2xl font-bold">
            {users.filter((u) => u.roles.includes("employee")).length}
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ? "No users found" : "No users yet"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.length === 0 ? (
                        <Badge variant="outline">No roles</Badge>
                      ) : (
                        user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant={role === "admin" ? "default" : "secondary"}
                          >
                            {AVAILABLE_ROLES.find((r) => r.value === role)
                              ?.label || role}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => openRoleDialog(user)}
                      variant="outline"
                      size="sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Manage Roles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Role Management Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage User Roles</DialogTitle>
            <DialogDescription>
              Update roles for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {AVAILABLE_ROLES.map((role) => (
              <div key={role.value} className="flex items-center space-x-2">
                <Checkbox
                  id={role.value}
                  checked={selectedRoles.includes(role.value)}
                  onCheckedChange={() => handleRoleToggle(role.value)}
                />
                <Label
                  htmlFor={role.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {role.label}
                </Label>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRoleDialog(false)}
              disabled={updatingRoles}
            >
              Cancel
            </Button>
            <Button onClick={updateUserRoles} disabled={updatingRoles}>
              {updatingRoles ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                "Update Roles"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminPanel;
