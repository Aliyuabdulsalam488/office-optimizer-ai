import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Share2, Users, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollaborationPanelProps {
  planId: string;
}

const CollaborationPanel = ({ planId }: CollaborationPanelProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("view");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    fetchShares();
  }, [planId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("floor_plan_comments")
        .select("*, profiles(full_name, email)")
        .eq("floor_plan_id", planId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchShares = async () => {
    try {
      const { data, error } = await supabase
        .from("floor_plan_shares")
        .select("*")
        .eq("floor_plan_id", planId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setShares(data || []);
    } catch (error) {
      console.error("Error fetching shares:", error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("floor_plan_comments")
        .insert({
          floor_plan_id: planId,
          user_id: user.id,
          comment: newComment,
        });

      if (error) throw error;

      setNewComment("");
      await fetchComments();

      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error: any) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const shareFloorPlan = async () => {
    if (!shareEmail.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("floor_plan_shares")
        .insert({
          floor_plan_id: planId,
          shared_by: user.id,
          shared_with_email: shareEmail,
          access_level: accessLevel,
        });

      if (error) throw error;

      setShareEmail("");
      await fetchShares();

      toast({
        title: "Floor plan shared",
        description: `Shared with ${shareEmail}`,
      });
    } catch (error: any) {
      toast({
        title: "Error sharing floor plan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Share Panel */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Share Floor Plan</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Share this floor plan with clients or team members
        </p>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>

          <div>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="comment">View & Comment</SelectItem>
                <SelectItem value="edit">Full Edit Access</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={shareFloorPlan}
            disabled={loading || !shareEmail}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 mr-2" />
            )}
            {loading ? "Sharing..." : "Share Floor Plan"}
          </Button>
        </div>

        {shares.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Shared With:</h4>
            {shares.map((share) => (
              <div
                key={share.id}
                className="flex justify-between items-center p-2 bg-muted rounded"
              >
                <span className="text-sm">{share.shared_with_email}</span>
                <Badge variant="secondary">{share.access_level}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Comments Panel */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Comments & Feedback</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment or feedback..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button
              onClick={addComment}
              disabled={loading || !newComment.trim()}
              size="sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? "Posting..." : "Post Comment"}
            </Button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">
                          {comment.profiles?.full_name || comment.profiles?.email || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.comment}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CollaborationPanel;
