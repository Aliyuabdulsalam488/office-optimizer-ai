import { supabase } from "@/integrations/supabase/client";

export const logUserActivity = async (
  activityType: "login" | "logout" | "password_reset" | "email_verified",
  userId?: string
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) return;

    // Get device info from user agent
    const userAgent = navigator.userAgent;
    const deviceInfo = {
      browser: getBrowser(userAgent),
      os: getOS(userAgent),
      userAgent: userAgent,
    };

    await supabase.from("user_activity").insert({
      user_id: targetUserId,
      activity_type: activityType,
      device_info: deviceInfo,
    });
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

export const logAuditEvent = async (
  action: string,
  entityType: string,
  entityId?: string,
  changes?: any,
  metadata?: any
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      changes,
      metadata,
    });
  } catch (error) {
    console.error("Error logging audit event:", error);
  }
};

function getBrowser(userAgent: string): string {
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Opera")) return "Opera";
  return "Unknown";
}

function getOS(userAgent: string): string {
  if (userAgent.includes("Win")) return "Windows";
  if (userAgent.includes("Mac")) return "macOS";
  if (userAgent.includes("Linux")) return "Linux";
  if (userAgent.includes("Android")) return "Android";
  if (userAgent.includes("iOS")) return "iOS";
  return "Unknown";
}
