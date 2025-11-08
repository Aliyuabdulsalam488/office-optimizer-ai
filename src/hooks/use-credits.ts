import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreditData {
  currentCredits: number;
  maxCredits: number;
  totalUsed: number;
  nextRefreshDate: string;
}

export const useCredits = () => {
  const [credits, setCredits] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCredits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_credits")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setCredits({
          currentCredits: data.current_credits,
          maxCredits: data.max_credits,
          totalUsed: data.total_credits_used,
          nextRefreshDate: data.next_refresh_date,
        });
      }
    } catch (error: any) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const deductCredits = async (amount: number, description: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc("deduct_credits", {
        p_user_id: user.id,
        p_amount: amount,
        p_description: description,
      });

      if (error) throw error;

      if (data) {
        await fetchCredits();
        return true;
      } else {
        toast({
          title: "Insufficient credits",
          description: "You don't have enough credits for this action",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();

    // Subscribe to credit changes
    const channel = supabase
      .channel("user_credits_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_credits",
        },
        () => {
          fetchCredits();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { credits, loading, fetchCredits, deductCredits };
};
