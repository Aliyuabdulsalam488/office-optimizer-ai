import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: any;
  metadata: any;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

export const AuditLogViewer = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (filterAction !== "all") {
        query = query.eq("action", filterAction);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Enrich with user profile data
      const enrichedLogs = await Promise.all(
        (data || []).map(async (log) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", log.user_id)
            .single();

          return {
            ...log,
            profiles: profile || undefined,
          };
        })
      );

      setLogs(enrichedLogs);
    } catch (error: any) {
      toast({
        title: "Error loading audit logs",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      role_added: "bg-green-500/10 text-green-500",
      role_removed: "bg-red-500/10 text-red-500",
      user_created: "bg-blue-500/10 text-blue-500",
      user_updated: "bg-yellow-500/10 text-yellow-500",
      user_deleted: "bg-red-500/10 text-red-500",
    };

    return (
      <Badge variant="outline" className={colors[action] || "bg-gray-500/10"}>
        {action.replace(/_/g, " ")}
      </Badge>
    );
  };

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(query) ||
      log.entity_type.toLowerCase().includes(query) ||
      log.profiles?.email?.toLowerCase().includes(query) ||
      log.profiles?.full_name?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner size="sm" text="Loading audit logs..." />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Audit Log</h3>
          <p className="text-sm text-muted-foreground">
            Track all administrative actions and system changes
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="role_added">Role Added</SelectItem>
            <SelectItem value="role_removed">Role Removed</SelectItem>
            <SelectItem value="user_created">User Created</SelectItem>
            <SelectItem value="user_updated">User Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No audit logs found
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getActionBadge(log.action)}
                      <span className="text-sm font-medium">
                        {log.entity_type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By: {log.profiles?.full_name || "Unknown"} (
                      {log.profiles?.email || "N/A"})
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                {log.changes && (
                  <div className="text-xs bg-muted p-2 rounded font-mono">
                    {JSON.stringify(log.changes, null, 2)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
