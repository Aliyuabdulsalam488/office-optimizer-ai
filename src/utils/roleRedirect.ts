import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Role-based routing map
export const ROLE_ROUTES: Record<string, string> = {
  hr_manager: "/hr-dashboard",
  finance_manager: "/finance-dashboard",
  architect: "/architect-dashboard",
  home_builder: "/home-builder-dashboard",
  executive: "/executive-dashboard",
  executive_assistant: "/ea-dashboard",
  sales_manager: "/sales-dashboard",
  procurement_manager: "/procurement-dashboard",
  employee: "/employee-dashboard",
  admin: "/dashboard",
};

export const getUserRole = async (userId: string, retries = 3): Promise<string | null> => {
  for (let i = 0; i < retries; i++) {
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (userRoles && userRoles.length > 0) {
      return userRoles[0].role;
    }

    // Wait a bit before retrying (role assignment might be in progress)
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return null;
};

export const redirectToRoleDashboard = async (
  userId: string, 
  navigate: NavigateFunction,
  fallback: string = "/employee-dashboard"
) => {
  const role = await getUserRole(userId);
  const route = role ? ROLE_ROUTES[role] || fallback : fallback;
  navigate(route);
  return route;
};
